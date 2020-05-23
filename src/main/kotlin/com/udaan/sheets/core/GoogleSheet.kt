package com.udaan.sheets.core

import com.google.api.client.auth.oauth2.Credential

import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport
import com.google.api.client.http.HttpTransport
import com.google.api.client.json.JsonFactory
import com.google.api.client.json.jackson2.JacksonFactory
import com.google.api.client.util.store.FileDataStoreFactory
import com.google.api.services.sheets.v4.Sheets
import com.google.api.services.sheets.v4.SheetsScopes
import com.google.api.services.sheets.v4.model.*
import java.io.*
import java.util.*
import kotlin.system.exitProcess


class GoogleSheet {
    companion object {
        private const val APPLICATION_NAME = "Google Sheets"
        private val JSON_FACTORY: JsonFactory = JacksonFactory.getDefaultInstance()

        //If modifying these scopes, delete your previously saved tokens/ folder.
        private val SCOPES = listOf(SheetsScopes.SPREADSHEETS, SheetsScopes.DRIVE, SheetsScopes.DRIVE_FILE)
        private const val CREDENTIALS_FILE_PATH = "/credentials.json"

        //Directory to store user credentials for this application.

        /*        private val DATA_STORE_DIR = File(
        *           System.getProperty("user.home"), ".credentials/sheets.googleapis.com-java-quickstart"
             )*/
        private val DATA_STORE_DIR = File(
            System.getProperty("user.home"), ".credentials/sheets.googleapis"
        )
        private var DATA_STORE_FACTORY: FileDataStoreFactory? = null
        private var HTTP_TRANSPORT= GoogleNetHttpTransport.newTrustedTransport()

        /**
         * Creates an authorized Credential object.
         *
         * @return An authorized Credential object.
         * @throws IOException If the credentials.json file cannot be found.
         */
        @Throws(IOException::class)
        fun authorize(): Credential {
            // Load client secrets.
            val `in` =
                GoogleSheet::class.java.getResourceAsStream(CREDENTIALS_FILE_PATH)
/*            val clientSecrets =
            val credential =
                AuthorizationCodeInstalledApp(flow, LocalServerReceiver()).authorize("user")
*/
            val credential = GoogleCredential.fromStream(`in`)
                .createScoped(SCOPES)
            println(credential)
            println("Credentials saved to " + DATA_STORE_DIR.absolutePath)
            return credential
        }

        /**
         * Build and return an authorized Sheets API client service.
         *
         * @return an authorized Sheets API client service
         * @throws IOException
         */
        @Throws(IOException::class)
        fun sheetsService(): Sheets{
                val credential = authorize()
                return Sheets.Builder(
                    HTTP_TRANSPORT,
                    JSON_FACTORY,
                    credential
                ).setApplicationName(APPLICATION_NAME).build()
            }

        init {
            try {
                HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport()
                DATA_STORE_FACTORY =
                    FileDataStoreFactory(DATA_STORE_DIR)
            } catch (t: Throwable) {
                t.printStackTrace()
                exitProcess(1)
            }
        }
    }

    @Throws(IOException::class)
    fun getSpreadSheetRecords(
        spreadsheetId: String?,
        range: String?
    ): List<List<Any>>? {
        val service = sheetsService()
        val res = service.spreadsheets().values().get(spreadsheetId, range)
        val values = res.execute().getValues()
        println(values.toString())
        return if (values != null && values.size != 0) {
            values
        } else {
            println("No data found.")
            null
        }
    }

    @Throws(IOException::class)
    fun create(title: String?): String {
        val service = sheetsService()
        var spreadsheet = Spreadsheet()
            .setProperties(
                SpreadsheetProperties()
                    .setTitle(title)
            )
        spreadsheet = service
            .spreadsheets()
            .create(spreadsheet)
            .setFields("spreadsheetId")
            .execute()
        println("Spreadsheet ID: " + spreadsheet.spreadsheetId)
        return spreadsheet.spreadsheetId
    }

    @Throws(IOException::class)
    fun updateValues(
        spreadsheetId: String?,
        range: String?,
        _values: List<List<Any?>?>?
    ): UpdateValuesResponse {
        val service = sheetsService()
        val vr =
            ValueRange()
                .setValues(_values)
                .setMajorDimension("ROWS")
        val result = service
            .spreadsheets()
            .values()
            .update(spreadsheetId, range, vr)
            .setValueInputOption("USER_ENTERED").execute()
        System.out.printf("%d cells updated.", result.updatedCells)
        return result
    }

    @Throws(IOException::class)
    fun getValues(
        spreadsheetId: String?,
        range: String?
    ): ValueRange {
        val service = sheetsService()
        val result = service
            .spreadsheets()
            .values()[spreadsheetId, range]
            .execute()
        val numRows = if (result.getValues() != null) result.getValues().size else 0
        System.out.printf("%d rows retrieved.", numRows)
        return result
    }

    @Throws(IOException::class)
    fun formattingCells(spreadsheetId: String?): BatchUpdateSpreadsheetResponse {
        val service = sheetsService()
        val requests: MutableList<Request> =
            ArrayList()

        //Formatting of the borders
        val borderTop = Border()
            .setStyle("DASHED")
            .setWidth(10)
            .setColor(
                Color()
                    .setRed(1f)
                    .setGreen(0f)
                    .setBlue(0f)
            )
        val borderBottom =
            Border()
                .setStyle("DASHED")
                .setWidth(10).setColor(
                    Color()
                        .setRed(1f)
                        .setGreen(0f)
                        .setBlue(0f)
                )
        var tableRange = setRangeOfCells(0, 1, 10, 1, 10)
        requests.add(
            Request()
                .setUpdateBorders(
                    UpdateBordersRequest()
                        .setRange(tableRange)
                        .setTop(borderTop)
                        .setBottom(borderBottom)
                )
        )

        //Formatting of the cells
        tableRange = setRangeOfCells(0, 0, 1, 0, 4)
        var cellData = CellData()
            .setUserEnteredFormat(
                CellFormat()
                    .setBackgroundColor(
                        Color().setRed(0f).setGreen(0f).setBlue(0f)
                    )
                    .setHorizontalAlignment("CENTER")
                    .setTextFormat(
                        TextFormat()
                            .setForegroundColor(
                                Color().setBlue(1f).setRed(1f).setGreen(1f)
                            )
                            .setFontSize(12)
                            .setBold(true)
                    )
            )
        val sheetProperties =
            SheetProperties().setSheetId(0).setGridProperties(GridProperties().setFrozenRowCount(1))
        requests.add(
            Request()
                .setRepeatCell(
                    RepeatCellRequest()
                        .setRange(tableRange)
                        .setCell(cellData)
                        .setFields("userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)")
                )
        )

        //Freezing of header row
        requests.add(
            Request()
                .setUpdateSheetProperties(
                    UpdateSheetPropertiesRequest()
                        .setProperties(sheetProperties)
                        .setFields("gridProperties.frozenRowCount")
                )
        )

        //Merging of Cells
        tableRange = setRangeOfCells(0, 4, 6, 0, 3)
        requests.add(
            Request()
                .setMergeCells(
                    MergeCellsRequest()
                        .setRange(tableRange)
                        .setMergeType("MERGE_ALL")
                )
        )
        tableRange = setRangeOfCells(0, 4, 8, 5, 9)
        requests.add(
            Request()
                .setMergeCells(
                    MergeCellsRequest()
                        .setRange(tableRange)
                        .setMergeType("MERGE_COLUMNS")
                )
        )

        //Setting Date format
        tableRange = setRangeOfCells(0, 0, 100, 0, 100)
        cellData = CellData()
            .setUserEnteredFormat(
                CellFormat()
                    .setNumberFormat(
                        NumberFormat()
                            .setType("DATE")
                            .setPattern("hh:mm:ss am/pm, ddd mmm dd yyyy")
                    )
            )
        requests.add(
            Request()
                .setRepeatCell(
                    RepeatCellRequest()
                        .setRange(tableRange)
                        .setCell(cellData)
                        .setFields("userEnteredFormat.numberFormat")
                )
        )

        //Setting Decimal Format
        tableRange = setRangeOfCells(0, 1, 3, 1, 3)
        cellData = CellData()
            .setUserEnteredFormat(
                CellFormat()
                    .setNumberFormat(
                        NumberFormat()
                            .setType("NUMBER")
                            .setPattern("#,##0.0000")
                    )
            )
        requests.add(
            Request()
                .setRepeatCell(
                    RepeatCellRequest()
                        .setRange(tableRange).setCell(cellData)
                        .setFields("userEnteredFormat.numberFormat")
                )
        )
        val body = BatchUpdateSpreadsheetRequest().setRequests(requests)
        val response = service.spreadsheets().batchUpdate(spreadsheetId, body).execute()
        System.out.printf("%d cells updated.", response.replies.size)
        return response
    }

    fun setRangeOfCells(sheetId: Int, startRow: Int, endRow: Int, startColumn: Int, endColumn: Int): GridRange {
        return GridRange()
            .setSheetId(sheetId)
            .setStartRowIndex(startRow)
            .setEndRowIndex(endRow)
            .setStartColumnIndex(startColumn)
            .setEndColumnIndex(endColumn)
    }
}