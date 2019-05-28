import firebase from 'firebase'  // Should not be used elsewhere in the project
import '@firebase/firestore';



//

 firebase.initializeApp(Expo.Constants.manifest.extra.firebase);

// export default firebase;

const dbh = firebase.firestore();

dbh.collection("characters").doc("mario").set({
  employment: "plumber",
  outfitColor: "red",
  specialAttack: "fireball"
})





//import firebase from 'firebase'  // Should not be used elsewhere in the project

class Fire {
  constructor(){
    if(!firebase.apps.length) this.init()
    this.observeAuth()
  }

  init = () => {
    firebase.initializeApp(Expo.Constants.manifest.extra.firebase);
  }

  observeAuth = () =>
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);

  onAuthStateChanged = user => {
    if (!user) {
      try {
        firebase.auth().signInAnonymously();
      } catch ({ message }) {
        alert(message);
      }
    }
  };

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  get ref() {
    return firebase.database().ref('messages');
  }

  parse = snapshot => {
    const { timestamp: numberStamp, text, user } = snapshot.val();
    const { key: _id } = snapshot;
    const timestamp = new Date(numberStamp);
    const message = {
      _id,
      timestamp,
      text,
      user,
    };
    return message;
  };

  on = callback =>
    this.ref
      .limitToLast(20)
      .on('child_added', snapshot => callback(this.parse(snapshot)));

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }
  // send the message to the Backend
  send = messages => {

    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i];
      const message = {
        text,
        user,
        timestamp: this.timestamp,
      };
      this.append(message);
      console.log(message);

    }

  };

  append = message => this.ref.push(message);

  // close the connection to the Backend
  off() {
    this.ref.off();
  }

}





firebase.shared = new Fire()
export default firebase




