# blindlyDateRMK
Inside Project directory

Installation reqs:
1. install yarn (if you haven't)
  https://yarnpkg.com/en/docs/install#mac-stable
2. install expo client
  $npm install -g expo-cli
3. install XCode (for IOS)
  Install Xcode through the Apple App Store. It'll take a while, go have a nap.
  Next, open up Xcode, go to preferences and click the Components tab, install a simulator from the list.
  Once the simulator is open and you have a project open in Expo Dev Tools,
  you can press Run on iOS simulator in Expo Dev Tools
  and it will install the Expo Client to the simulator and open up your app inside of it.

4. android stuff (HAVEN"T DONE YET)
   https://docs.expo.io/versions/v32.0.0/workflow/android-studio-emulator/

*Problems occur if watchman isn't installed as rn uses it.
You will have to change the chatServer line 16 of chatMain.js (currntly http://10.0.0.246:3000/users) to the physical IP address of your computer NOT the local host IP address. It should be in your network settings.
Project Start:
1. start ngrok server
 $ ./ngrok http 3000
2. start Chatmain server in ChatServer directory
  $ nodemon Server.js
3. Start front end in project directory
  $ yarn start


  **** WHEN FETCHING DATA: CHANGE "LOCALHOST" TO YOUR PHYSICAL IP ADDRESS ****



