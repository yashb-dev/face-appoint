# face-appoint
This was my first node.js project. The app keeps track of your appointments and alerts you 30 minutes before the start of one. It also lets you book appointments with other users in the database based on what service you would like. 

### Set Up
1. Create a project on Google Cloud
3. Pull this repository into your directory
2. Enable Firebase API and create 'user-data' and 'appointments' collections in the root folder
3. Create Credentials for the project (service-account recommended), download and place in directory, and re-name to key.json
4. In config_template.js, modify projectID and cookieSecret to appropriate values and rename file to config.js
5. In cloud shell: 'npm install'
6. To start: 'node app.js'

### Set Up Alerts
1. Create 'current-time' collection in the root Firebase folder
2. Create 'time' document in that collection with 1 field with label 'time' and value of any timestamp
3. Enable Cloud Functions
4. Create a new function and set the trigger to Firebase, and update, and in the file path use 'current-time/time'
4. Copy the contents of alert.js into index.js and add the following to the package.json:
```javascript
"dependencies": {
  "@google-cloud/firestore": "latest",
  "nodemailer": "^4.7.0"
}
```
5. Change the values in the transporter (line 11-17) to your values
6. Go to the Firebase file /current-time/time and change the time value to anything
