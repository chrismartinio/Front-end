Start the NodeJS server:

1. Make sure that you're in the same directory as the package.json file for the node server.
2. $npm install
3. create new file under config: 'main.js', c/p trello config details into main js.
4. $npm start
5. it should start the server, and it will say started on port 3000. (make sure that that port is free on localhost)
6. to hit the endpoint for the server its: *DO NOT USE HTTPS WHEN FETCHING DATA USE HTTP* SOME ROUTES ARE GET/SOME ROUTES ARE POST. VERIFY IN ROUTING.js
  Verified Connections:
      (YOUR PHYSICAL IP ADDRESS HERE):3000/api/auth/login
      (YOUR PHYSICAL IP ADDRESS HERE):3000/api/onboarding/spendAWeekend
  * working on
      (YOUR PHYSICAL IP ADDRESS HERE):3000/api/auth/tellUsMore
      (YOUR PHYSICAL IP ADDRESS HERE):3000/api/auth/register
      everything else...


    *Look in homescreen inside this.handleEmailAndPassword for an example of using fetch to hit the data point line 72*
