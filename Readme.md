# Sync Google Spreadsheets with SQLITE Database

#### _Application is in Alpha Releasable and Testing Stage_
##### _Landing Page as well as Enter Sheets Page_
![Image of UI](readmePic/landing.png)
##### _View All Sheets_
![Image of UI](readmePic/home.png)
##### _View Data in a Sheet_
![Image of UI](readmePic/sheet.png)

### Stack Used
1. Kotlin with DropWizard Framework
2. SQLite3 Database
3. ReactJS with REDUX


## Steps to Run the code
1. Create google service account and add credentials to 
    `src/main/resources/credentials.json`  
2. Now in project home directory run
`./gradlew run`
3. As the Frontend has not been built yet content must be downloaded from API calls directly
`http://localhost:8000/api/enter`
4. Before entering the sheet link make sure that Google sheet is shared with service account as editor
5. You can also use un-structured sync as follows
_In this case rest of the work is taken care by Application itself, but is not as optimizable as structured_
```
spreadSheetLink: https://docs.google.com/spreadsheets/d/1vNgROdBY1fq2vf_k5xRaN0SXG8_bMl4gJEsKAsRzPek/edit#gid=0
sheetName: Sheet1
withLabel: false
structured: false
```
6. On running the gradle server and using curl or postman to send the POST request with above Body
7. Note that above is just a format, you may have to change them based on your credentials

#### _Now this might look tedious but once frontend is done users just have to enter the names of columns and choose type from a neat dropdown menu_
#### Structured Sync was removed to avoid SQL Injection attacks, and avoid failure when google sheet schema is changed