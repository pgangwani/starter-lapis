// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import FontFaceObserver from 'fontfaceobserver';
import { Route, Switch } from 'react-router-dom';
import type { Stack } from 'immutable';

import config from 'config';
import { PrivateRoute } from 'core';
import { actions } from 'redux/actions/app';
import './index.css';
import { Header, Navigation, NotificationBar } from './components';
import {
  SecretSpace,
  NotificationCenter,
  NotFound,
  About,
  Projects,
  Login,
} from './screens';

type Props = {
  load: ActionCreator,
  isAuthenticated: boolean,
  notifications: Stack<Notification>,
  isNotificationsOpen: boolean,
  toggleNotifications: ActionCreator,
};

function loadFonts() {
  const roboto = new FontFaceObserver('Roboto');

  Promise.all([roboto.load()]).then(() => {
    if (document && document.body) {
      document.body.className += ' fonts-loaded';
    }
  });
}
class App extends Component {
  componentWillMount() {
    // Observe loading and set proper styles when fonts have loaded
    // Fonts are added inside global.css
    loadFonts();
  }
  componentDidMount() {
    this.props.load();
  }

  props: Props;
  render() {
    const {
      isAuthenticated,
      isNotificationsOpen,
      toggleNotifications,
      notifications,
    } = this.props;
    return (
      <div styleName="wrapper">
        <Helmet {...config.app.head} />
        <NotificationBar
          notifications={notifications}
          isNotificationsOpen={isNotificationsOpen}
          toggleNotifications={toggleNotifications}
        />
        <div styleName="app">
          <Header />
          <div styleName="content">
            <Navigation
              styleName="navigation"
              links={[
                { to: '/', text: 'About' },
                { to: '/login', text: 'Login' },
                { to: '/projects', text: 'Projects' },
                { to: '/notifications', text: 'Notification Center' },
                { to: '/secret', text: 'Secret', hide: !isAuthenticated },
              ]}
            />
            <div styleName="routes">
              <Switch>
                <Route exact path="/" component={About} />
                <Route path="/login" component={Login} />
                <Route path="/projects" component={Projects} />
                <Route path="/notifications" component={NotificationCenter} />
                <PrivateRoute path="/secret" component={SecretSpace} />
                <Route component={NotFound} />
              </Switch>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default connect(
  state => ({
    notifications: state.getIn(['app', 'notifications']),
    isNotificationsOpen: state.getIn(['app', 'ui', 'isNotificationsOpen']),
    isAuthenticated: state.getIn(['user', 'authenticated']),
  }),
  { ...actions },
)(App);
