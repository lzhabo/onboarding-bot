require('dotenv').config();

import * as firebase from 'firebase';

var firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
};
firebase.initializeApp(firebaseConfig);

module.exports = {
    getData(path) {
        return firebase.database().ref(path).once('value').then(function (data) {
            return data.val();
        });
    },
    pushData(path, data) {
        return firebase.database().ref(path).push(data).then(data => {
            return ((data as any).path.pieces_);
        });
    },
    setData(path, data) {
        firebase.database().ref(path).set(data);
    },
    updateData(path, data) {
        firebase.database().ref(path).update(data);
    },
    removeData(path) {
        firebase.database().ref(path).remove();
    }
};
