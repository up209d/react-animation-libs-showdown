import React from 'react';
import { Redirect } from 'react-router-dom';

import actions from 'js/actions';
import actionTypes from 'js/actionTypes';

import Login from 'js/components/pages/Login/Login';
import Home from 'js/components/pages/Home/Home';
import Front from 'js/components/pages/Front/Front';

export const RedirectToLogin = () => (
  <Redirect to={'/login'}/>
);

export const RedirectToHome = () => (
  <Redirect to={'/home'}/>
);

// 2 Set of Routes for userLoggedIn and userNotLoggedIn
const routeConfig = (isLoggedIn) => {
  return !isLoggedIn ?
    // WHEN USER IS NOT LOGGED IN
    [
      {
        path: '/front',
        component: Front,
        loadData: null
      },
      {
        path: '/login',
        component: Login,
        loadData: actions.getData.bind(null,actionTypes.DATA_FOR_LOGIN)
      },
      {
        path: '/',
        component: Front,
        loadData: actions.getData.bind(null,actionTypes.DATA_FOR_HOME)
      }
    ] :
    // WHEN USER IS ALREADY LOGGED IN
    [
      {
        path: '/home',
        component: Home,
        loadData: actions.getData.bind(null,actionTypes.DATA_FOR_HOME)
      },
      {
        path: '/login',
        component: Home,
        loadData: actions.getData.bind(null,actionTypes.DATA_FOR_HOME)
      },
      {
        path: '/',
        component: Home,
        loadData: actions.getData.bind(null,actionTypes.DATA_FOR_HOME)
      }
    ]
};

export default routeConfig;