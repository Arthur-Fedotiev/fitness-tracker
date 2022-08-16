export const environment = {
  useEmulators: false,
  firebase: {
    projectId: 'fitness-tracker-de06b',
    appId: '1:450961916900:web:a85ab7b9651ed92cd5bdf1',
    storageBucket: 'fitness-tracker-de06b.appspot.com',
    locationId: 'europe-west',
    apiKey: 'AIzaSyCae4RTHeovIDsippQzDnGFUhgExauhKv8',
    authDomain: 'fitness-tracker-de06b.firebaseapp.com',
    messagingSenderId: '450961916900',
  },
  algolia: {
    appId: 'YDPTK1N3A0',
    appKey: 'f276d50884ab207ec3de77c64dd4cb55',
  },
  api: {
    createUser:
      'https://us-central1-fitness-tracker-de06b.cloudfunctions.net/createUser',
  },
  production: true,
};
