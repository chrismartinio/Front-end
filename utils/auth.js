import firebase from './mainFire'

// send data to back end: or to configure



export async function signInWithFacebook() {

  try{
    const appId = Expo.Constants.manifest.extra.facebook.appId;
    const permissions = ['public_profile', 'email'];  // Permissions required, consult Facebook docs

    const {
        type,
        token,
        expires,
        declinedPermissions,
    } = await Expo.Facebook.logInWithReadPermissionsAsync(
      appId,
      {permissions}
    )
      if (type === 'success') {
        // Get the user's name using Facebook's Graph API
        const response = await fetch(`https://graph.facebook.com/me?fields=id,name,email,birthday&access_token=${token}`);
        //const dataNeeded = await fetch(` https://graph.facebook.com/${await response.json().id}?fields=id,name,email&access_token=${token}`)
         return (await response.json());
      } else {
        // type === 'cancel'
        console.log(`Facebook Login Error: ${message}`);
      }
  } catch ({ message }) {
    console.log(`Facebook Login Error: ${message}`);
  }


}