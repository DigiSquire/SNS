// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
// https://sns-api-207407.appspot.com
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: 'AIzaSyCKM1VlODa0nDYzIimBAmv5EREWztL7Ssc',
    authDomain: 'ironic-objectivist-220216.firebaseapp.com',
    storageBucket: "ironic-objectivist-220216.appspot.com",
  },
  // var config = {
  //   apiKey: "AIzaSyCKM1VlODa0nDYzIimBAmv5EREWztL7Ssc",
  //   authDomain: "ironic-objectivist-220216.firebaseapp.com",
  //   databaseURL: "https://ironic-objectivist-220216.firebaseio.com",
  //   projectId: "ironic-objectivist-220216",
  //   storageBucket: "ironic-objectivist-220216.appspot.com",
  //   messagingSenderId: "41338027600"
  // };
  API_BASE_URI: 'https://ironic-objectivist-220216.appspot.com/api',
  // API_BASE_URI: 'https://apiv1.spacesnstories.com/api',
  API_BASE_URI_LOCAL: 'http://localhost:8083/api',
  id: '_id',
  emailId: 'emailId',
  wrongCredentials: 'auth/wrong-password',
  invalidUser: 'auth/user-not-found',
  role_artist: 'artist',
  role_admin: 'admin'
};
