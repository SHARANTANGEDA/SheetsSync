package com.udaan.sheets.api

import com.udaan.sheets.core.BackgroundTask
import com.udaan.sheets.core.GoogleSheet
import com.udaan.sheets.db.SheetTableService
import com.udaan.sheets.db.SheetsInfoService
import com.udaan.sheets.models.SheetsInfo
import io.dropwizard.setup.Environment
import org.jdbi.v3.core.statement.UnableToCreateStatementException
import org.sqlite.SQLiteException
import java.util.stream.Collectors
import java.util.stream.IntStream
import javax.ws.rs.*
import javax.ws.rs.core.Form
import javax.ws.rs.core.MediaType
import javax.ws.rs.core.Response


@Path("/")
class SheetSync(
    private var sheetsInfoService: SheetsInfoService, private var sheetTableService: SheetTableService,
    private val environment: Environment
) {
    private lateinit var spreadSheetLink: String
    private lateinit var range: String
    private lateinit var spreadSheetId: String
    private lateinit var columnNames: List<String>
    private lateinit var columnTypes: List<String>
    private var hasLabel: Boolean = true
    private var structured: Boolean = false
    private var map: MutableMap<String, BackgroundTask> = mutableMapOf()

    @Path("/enter")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    fun getLink(form: Form): Response {
        val formMap = form.asMap()
        spreadSheetLink = formMap["spreadSheetLink"].toString()
        range = ((formMap["sheetName"]?.get(0) ?: formMap["sheetName"]) as String)
        this.hasLabel = ((formMap["withLabel"]?.get(0) ?: formMap["withLabel"]) as String) == "true"
//        this.structured = ((formMap["structured"]?.get(0) ?: formMap["structured"]) as String) == "true"
        if (structured) {
            val columnNames = ((formMap["columns"]?.get(0) ?: formMap["columns"]) as String)
            val columnTypes = ((formMap["types"]?.get(0) ?: formMap["types"]) as String)
            val resTuple = parseColumns(columnNames, columnTypes)
            this.columnNames = resTuple.first
            this.columnTypes = resTuple.second
            val modifiedColumnNames: MutableList<String> = this.columnNames as MutableList<String>
            for ((idx, cell) in this.columnNames.withIndex()) {
                modifiedColumnNames[idx] = (cell.replace("\\s".toRegex(), ""))
            }
            this.columnNames = modifiedColumnNames.toList()
        }
        if (spreadSheetLink.isEmpty() || range.isEmpty()) {
            return Response.status(400).entity("Enter details again").build()
        } else {
            spreadSheetId = parseLink(spreadSheetLink)
            println("Extracted Spreadsheet Id is : $spreadSheetId")
            val res = sheetsInfoService.createSheetsInfoTable()
            println("After Create: $res")
            val sheets = GoogleSheet()
            val sheetData = sheets.getSpreadSheetRecords(spreadSheetId, range)
            if (sheetData == null) {
                return Response.status(404).entity("No data found in the sheet").build()
            } else {
                if (sheetsInfoService.checkExistence(spreadSheetId, range) == null) {
                    val label = if (hasLabel) 1 else 0
                    if (structured) {
                        val ins = sheetsInfoService.insert(
                            spreadSheetId, range, this.columnNames.size + 1,label, 0,
                            1)
                        println("After Insert: $ins")
                        val primKey = sheetsInfoService.checkExistence(spreadSheetId, range)
                        syncStructuredTable(primKey.toString(), columnNames, columnTypes, hasLabel, sheetData)
                    } else {
                        var columnNumbers = 0
                        for (row: List<Any> in sheetData) {
                            if (row.size > columnNumbers) {
                                columnNumbers = row.size
                            }
                        }
                        println("Column Numbers:$columnNumbers")
                        val ins = sheetsInfoService.insert(spreadSheetId, range, columnNumbers + 1,
                            label, 0,0)
                        println("After Insert: $ins")
                        val primKey = sheetsInfoService.checkExistence(spreadSheetId, range)
                        syncUnStructuredTable(primKey.toString(), hasLabel, sheetData, columnNumbers)

                    }
                    println("Done")
                    return Response.status(200).entity("Success").build()
                } else {
                    println("Already Exists")
                    return Response.status(403).entity("A Job is Already running for this SpreadSheet").build()
                }
            }

        }

    }

    @Path("/cancelSync/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    fun stopSync(@PathParam("id") id: String) {
        val backgroundTask = map.computeIfPresent(id) { _, backgroundTask -> backgroundTask }
        if (backgroundTask != null) {
            backgroundTask.stop()
            sheetsInfoService.updateState(backgroundTask.getDetails().first, backgroundTask.getDetails().second, 0)
            map.remove(id)
            Response.status(200).entity("Success").build()
        } else {
            Response.status(404).entity("Job is not found, please check again").build()
        }
    }

    @Path("/restartSync/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    fun restartSync(@PathParam("id") id: String) {
        val info = sheetsInfoService.getInfoById(id.toInt())
        if (info != null) {
            sheetsInfoService.updateState(info.spreadsheetid, info.sheetname, 1)
            val periodicTask =
                BackgroundTask(
                    sheetsInfoService, sheetTableService, info.spreadsheetid, info.sheetname,
                    info.hasLabel, "table$id", info.structured
                )
            map["table$id"] = periodicTask
            environment.lifecycle().manage(periodicTask)
            periodicTask.start()
            Response.status(200).entity("Success").build()
        } else {
            Response.status(404).entity("Job is not found, please check again").build()
        }
    }

    @Path("/getTable/{id}/{cols}")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    fun getTableData(@PathParam("id") id: String, @PathParam("cols") cols: String): Response {
        try {
            val colNo = cols.toInt()
            val data: MutableList<List<String>> = mutableListOf()
            var list =sheetTableService.getData(id, "rowId")
            data.add(list)
            println(list.size)
            for(i in 1 until colNo) {
                list =sheetTableService.getData(id, "col$i")
                data.add(list)
                println(list.size)
            }
            val transData = transpose(data.toList())
            println(transData)
            return Response.status(200).entity(transData).build()
        }catch (e:Exception) {
            return Response.status(400).entity("Error in receiving the data").build()
        }
    }

    @Path("/getSheets")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    fun getAllTables(): Response {
        val data = sheetsInfoService.getAllSheets()
        return if (data!=null) {
            Response.status(200).entity(data).build()
        }else {
            Response.status(404).entity("Data Not available").build()
        }
    }

    private fun <T> transpose(list: List<List<T>>): List<List<T>?>? {
        val N = list.stream()
            .mapToInt { l: List<T> -> l.size }.max()
            .orElse(-1)
        val iterList = list.stream()
            .map { it.iterator() }
            .collect(Collectors.toList())
        return IntStream.range(0, N)
            .mapToObj {
                iterList.stream()
                    .filter { it.hasNext() }
                    .map { m: Iterator<T> -> m.next() }
                    .collect(Collectors.toList())
            }
            .collect(Collectors.toList())
    }

    private fun syncStructuredTable(tableName: String, columnNames: List<String>, columnTypes: List<String>,
                                    hasLabel: Boolean, sheetData: List<List<Any>>) {
        val str = StringBuilder()
        str.append("rowId integer primary key,")
        for ((colInd, columnName) in columnNames.withIndex()) {
            str.append(columnName)
            str.append(" ")
            str.append(columnTypes[colInd])
            if (colInd != columnNames.size - 1) {
                str.append(",")
            }
        }
        sheetTableService.createSheetsInfoTable("table$tableName", str.toString())
        var newSheet: List<List<String>> = sheetData as List<List<String>>
        if (hasLabel) {
            newSheet = sheetData.subList(1, sheetData.size)
        }
        val colStr = columnNames.joinToString(separator = ",")
        println("L: $colStr")
        val insertData = StringBuilder()
        for (row in newSheet) {
            insertData.append("(")
            insertData.append(row.joinToString(separator = ",")
            { "\"${it.replace("\"","\'").replace("?","\'?\'")}\"" }) //.replace(",",";")
            insertData.append("),")
    }
        sheetTableService.insert("table$tableName", colStr, insertData.toString().substring(0, insertData.length - 1))
        sheetsInfoService.updateState(spreadSheetId, range, 1)
        val label = if (hasLabel) 1 else 0
        val struct = if (structured) 1 else 0
        val periodicTask =
            BackgroundTask(sheetsInfoService, sheetTableService, spreadSheetId, range, label,
                "table$tableName", struct)
        map["table$tableName"] = periodicTask
        environment.lifecycle().manage(periodicTask)
        periodicTask.start()
    }

    private fun syncUnStructuredTable(tableName: String, hasLabel: Boolean, sheetData: List<List<Any>>,
                                      columnNumbers: Int) {
        val str = StringBuilder()
        val columnNames: MutableList<String> = mutableListOf()
        str.append("rowId integer primary key,")
        for (i: Int in 1..columnNumbers) {
            columnNames.add("col$i")
            str.append("col$i")
            str.append(" ")
            str.append("text")
            if (i != columnNumbers) {
                str.append(",")
            }
        }
        sheetTableService.createSheetsInfoTable("table$tableName", str.toString())
        var newSheet: List<List<String>> = sheetData as List<List<String>>
        if (hasLabel) {
            newSheet = sheetData.subList(1, sheetData.size)
        }
        val insertData = StringBuilder()
        for (row in newSheet) {
            insertData.append("(")
            if (row.isNotEmpty()) {
                insertData.append(row.joinToString(separator = ",")
                { "\"${it.replace("\"","\'").replace("?","\'?\'")}\"" })

            }
            if (row.size < columnNumbers) {
                if (row.isNotEmpty()) {
                    insertData.append(",")
                }
                for (i: Int in 1..columnNumbers - row.size) {
                    if (i != columnNumbers - row.size) {
                        insertData.append("\"NULL\",")
                    } else {
                        insertData.append("\"NULL\"")
                    }
                }
            }
            insertData.append("),")
        }
        sheetTableService.insert(
            "table$tableName",
            columnNames.joinToString(","),
            insertData.toString().substring(0, insertData.length - 1)
        )
        sheetsInfoService.updateState(spreadSheetId, range, 1)
        val label = if (hasLabel) 1 else 0
        val struct = if (structured) 1 else 0
        val periodicTask =
            BackgroundTask(sheetsInfoService, sheetTableService, spreadSheetId, range, label,
                "table$tableName", struct)
        map["table$tableName"] = periodicTask
        environment.lifecycle().manage(periodicTask)
        periodicTask.start()
    }

    fun startAllTasks() {
        try {
            val sheetsInfoList = sheetsInfoService.getActiveSheets(1)
            if (sheetsInfoList != null) {
                for (sheetInfo: SheetsInfo in sheetsInfoList) {
                    val periodicTask = BackgroundTask(
                        sheetsInfoService,
                        sheetTableService, sheetInfo.spreadsheetid, sheetInfo.sheetname,
                        sheetInfo.hasLabel, "table${sheetInfo.id}", sheetInfo.structured)
                    map["table${sheetInfo.id}"] = periodicTask
                    periodicTask.start()
                }
            } else {
                println("No Service is expected to be started")
            }
        } catch (e: UnableToCreateStatementException) {
            println("No Sheet is set yet, not starting anything")
        } catch (e: SQLiteException) {
            println("No Sheet is set yet")
        }

    }

    private fun parseColumns(columnNames: String, columnTypes: String): Pair<List<String>, List<String>> {
        val columnList: List<String> = columnNames.substring(1, columnNames.length - 1).split(',')
        val columnTypesList: List<String> = columnTypes.substring(1, columnTypes.length - 1).split(',')
        return Pair(columnList, columnTypesList)
    }

    // Example Link: https://docs.google.com/spreadsheets/d/1OMxBy70k2htgn48pZwk4pEX0_dX_bTa-/edit#gid=883250178
    private fun parseLink(spreadSheetLink: String): String {
        val idx = spreadSheetLink.indexOf("/d/")
        val end = spreadSheetLink.indexOf("/", idx + 3)
        return spreadSheetLink.substring(idx + 3, end)
    }
}

class SchedulerTask(
    private val sheetsInfoService: SheetsInfoService,
    private val sheetTableService: SheetTableService,
    private val spreadSheetId: String,
    private val sheetName: String,
    private val hasLabel: Int,
    private val structured: Int
) : Runnable {

/*    fun syncTaskStructured() {
//        println("Running again")
//        val sheetInfo = sheetsInfoService.getInfo(spreadSheetId, sheetName)
//        val columnNames = sheetInfo.columnnames.substring(1, sheetInfo.columnnames.length - 1).split(',')
//        val columnTypes = sheetInfo.columntypes.substring(1, sheetInfo.columntypes.length - 1).split(',')
//        val primKey = sheetInfo.id
//        val sheets = GoogleSheet()
//        val sheetData = sheets.getSpreadSheetRecords(spreadSheetId, sheetName)
//        val str = StringBuilder()
//        for ((colInd, columnName) in columnNames.withIndex()) {
//            str.append(columnName)
//            str.append(" ")
//            str.append(columnTypes[colInd])
//            if (colInd != columnNames.size - 1) {
//                str.append(",")
//            }
//        }
//        sheetTableService.updateTable("table$primKey", str.toString())
//        var newSheet: List<List<String>> = sheetData as List<List<String>>
//        if (hasLabel) {
//            newSheet = sheetData.subList(1, sheetData.size)
//        }
//        val colStr = columnNames.joinToString(separator = ",")
//        val insertData = StringBuilder()
//        for (row in newSheet) {
//            insertData.append("(")
//            insertData.append(row.joinToString(separator = ",") { it -> "\"$it\"" })
//            insertData.append("),")
//        }
//        sheetTableService.insert("table$primKey", colStr, insertData.toString().substring(0, insertData.length - 1))
//    }
 */

    private fun syncTaskUnStructured() {
        println("Running again")
        val sheetInfo = sheetsInfoService.getInfo(spreadSheetId, sheetName)
        val primKey = sheetInfo.id
        val sheets = GoogleSheet()
        val sheetData = sheets.getSpreadSheetRecords(spreadSheetId, sheetName)
        var columnNumbers = 0
        if (sheetData != null) {
            for (row: List<Any> in sheetData) {
                if (row.size > columnNumbers) {
                    columnNumbers = row.size
                }
            }
            val str = StringBuilder()
            val columnNames: MutableList<String> = mutableListOf()
            str.append("rowId integer primary key,")
            for (i: Int in 1..columnNumbers) {
                columnNames.add("col$i")
                str.append("col$i")
                str.append(" ")
                str.append("text")
                if (i != columnNumbers) {
                    str.append(",")
                }
            }
            sheetTableService.updateTable("table$primKey", str.toString())
            var newSheet: List<List<String>> = sheetData as List<List<String>>
            if (hasLabel==1) {
                newSheet = sheetData.subList(1, sheetData.size)
            }
            val colStr = columnNames.joinToString(separator = ",")
            val insertData = StringBuilder()
            for (row in newSheet) {
                insertData.append("(")
                if (row.isNotEmpty()) {
                    insertData.append(row.joinToString(separator = ",") {
                        "\"${it.replace("\"","\'").replace("?","\'?\'")}\"" })
                }
                if (row.size < columnNumbers) {
                    if (row.isNotEmpty()) {
                        insertData.append(",")
                    }
                    for (i: Int in 1..columnNumbers - row.size) {
                        if (i != columnNumbers - row.size) {
                            insertData.append("\"NULL\",")
                        } else {
                            insertData.append("\"NULL\"")
                        }
                    }
                }
                insertData.append("),")
            }
            sheetTableService.insert("table$primKey", colStr, insertData.toString().substring(0, insertData.length - 1))
        }

    }

    override fun run() {
        try {
            println("In run")
            if (structured==0) {
                syncTaskUnStructured()

            }
//            else {
//                syncTaskStructured()
//            }
        } catch (e: Exception) {
            e.printStackTrace()
            println("ERROR - unexpected exception" + e.message)
        }

    }
}

