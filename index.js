/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// ENV
import {
  USER_POOL_ID,
  USER_POOL_CLIENT_ID,
  IDENTITY_POOL_ID,
  PINPOINT_APP_ID,
  REGION,
} from '@env';

import {Amplify} from 'aws-amplify';
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: '',
      userPoolClientId: '',
      identityPoolId: '',
    },
  },
  Notifications: {
    PushNotification: {
      Pinpoint: {
        appId: '',
        region: '',
      },
    },
  },
  Analytics: {
    Pinpoint: {
      appId: '',
      region: '',
    },
  },
});

AppRegistry.registerComponent(appName, () => App);
