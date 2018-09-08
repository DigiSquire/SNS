export const environment = {
  production: true,
  firebaseConfig: {
    apiKey: 'AIzaSyA5qqC3_VWzNvREfQvlNUkdTUym_CtKEhQ',
    authDomain: 'fire-ng-proto.firebaseapp.com',
    databaseURL: 'https://fire-ng-proto.firebaseio.com',
    projectId: 'fire-ng-proto',
    storageBucket: 'fire-ng-proto.appspot.com',
    messagingSenderId: '407159742468'
  },
  API_BASE_URI: 'https://sns-api-207407.appspot.com/api',
  API_BASE_URI_LOCAL: 'http://localhost:8083/api',
  IMAGE_LOCAL: 'http://localhost:8083/api/gallery/image/',
  IMAGE: 'https://sns-api-207407.appspot.com/api/gallery/image/',
  id: '_id',
  emailId: 'emailId',
  wrongCredentials: 'auth/wrong-password',
  invalidUser: 'auth/user-not-found'
};
