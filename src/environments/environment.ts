// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
// https://sns-api-207407.appspot.com
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: 'AIzaSyA5qqC3_VWzNvREfQvlNUkdTUym_CtKEhQ',
    authDomain: 'fire-ng-proto.firebaseapp.com',
    databaseURL: 'https://fire-ng-proto.firebaseio.com',
    projectId: 'fire-ng-proto',
    storageBucket: 'fire-ng-proto.appspot.com',
    messagingSenderId: '407159742468'
  },
  API_BASE_URI: 'http://localhost:8083/api',
  API_BASE_URI_LOCAL: 'http://localhost:8083/api',
  IMAGE_LOCAL: 'http://localhost:8083/api/gallery/image/',
  IMAGE: 'https://sns-api-207407.appspot.com/api/gallery/image/',
  id: '_id',
  emailId: 'emailId',
  wrongCredentials: 'auth/wrong-password',
  invalidUser: 'auth/user-not-found',
  role_artist: 'artist',
  role_admin: 'admin'
};
