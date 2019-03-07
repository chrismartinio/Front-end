import firebase from './mainFire'

// send data to back end: or to configure


export async function signInWithFacebook() {
  const appId = Expo.Constants.manifest.extra.facebook.appId;
  const permissions = ['public_profile', 'email'];  // Permissions required, consult Facebook docs

  const {
    type,
    token,
  } = await Expo.Facebook.logInWithReadPermissionsAsync(
    appId,
    {permissions}
  );
  console.log(type)

  switch (type) {
    case 'success': {
      await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);  // Set persistent auth state
      const credential = firebase.auth.FacebookAuthProvider.credential(token);
      const facebookProfileData = await firebase.auth().signInAndRetrieveDataWithCredential(credential);  // Sign in with Facebook credential

      // Do something with Facebook profile data

      // navigate to registration page for categories
        // complete sign up flow:


      // OR you have subscribed to auth state change, authStateChange handler will process the profile data
      // send data to redux store for profile handling:

      return Promise.resolve({type: 'success', data:facebookProfileData});
    }
    case 'cancel': {
      return Promise.reject({type: 'cancel'});
    }
  }
}