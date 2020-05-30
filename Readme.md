# Sync Google Spreadsheets with SQLITE Database

#### _Application is in Testing & Review Stage_
##### _Landing Page as well as Enter Sheets Page_
![Image of UI](readmePic/landing.png)
##### _View All Sheets_
![Image of UI](readmePic/home.png)
##### _View Data in a Sheet_
![Image of UI](readmePic/sheet.png)

### Stack Used


## Steps to run the ReactJS Client
1. Move into client/src
`cd ./client/src`
2. Install **_node_modules_**
`npm install`
3. Start the React client with following command
`npm start`
4. On running the above command a client with `http://localhost:3000`

## Steps to Run the Dropwizard Service
1. Create google service account and add credentials to 
    `src/main/resources/credentials.json`  
2. Now in project home directory run
`./gradlew run`
3. The above command will launch the server `http://localhost:8000/api/enter`

##### _Now the React Client will fetch the required data and is connected to the server_ 


#### Structured Sync was removed to avoid SQL Injection attacks, and avoid failure when google sheet schema is changed

## For Collaborators
This is created using the following stack
1. Kotlin with DropWizard Framework and Google Sheets API for backend server
2. SQLite3 Database
3. ReactJS with REDUX for Frontend

**_The UI, Logo and colors on the website were inspired from udaan.com website_**

This uses Google Service account so that repeated user authentication is not required and data sync can happen seamlessly without interruption.

And as Organization wide access is not given to the account, before syncing a sheet, it should be shared with the service account email address 

