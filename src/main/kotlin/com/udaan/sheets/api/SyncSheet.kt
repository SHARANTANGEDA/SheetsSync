package com.udaan.sheets.api

import com.udaan.sheets.core.GoogleSheet
import com.udaan.sheets.db.SheetTableService
import com.udaan.sheets.db.SheetsInfoService
import java.lang.StringBuilder
import javax.ws.rs.*
import javax.ws.rs.core.Form
import javax.ws.rs.core.MediaType
import javax.ws.rs.core.Response

@Path("/")
class EnterSheetName(sheetsInfoService: SheetsInfoService, sheetTableService: SheetTableService) {
    private lateinit var spreadSheetLink: String
    private lateinit var range: String
    private lateinit var spreadSheetId: String
    private var sheetsInfoService: SheetsInfoService = sheetsInfoService
    private var sheetTableService: SheetTableService = sheetTableService
    private lateinit var columnNames: List<String>
    private lateinit var columnTypes: List<String>
    private var hasLabel: Boolean = true
    private var structured: Boolean = true

    @Path("/enter")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    fun getLink(form: Form): Response {
        val formMap = form.asMap()
        spreadSheetLink = formMap["spreadSheetLink"].toString()
        range = ((formMap["sheetName"]?.get(0) ?: formMap["sheetName"]) as String)
        this.hasLabel = ((formMap["withLabel"]?.get(0) ?: formMap["withLabel"]) as String) == "true"
        this.structured = ((formMap["structured"]?.get(0) ?: formMap["structured"]) as String) == "true"
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
        return if (spreadSheetLink.isEmpty() || range.isEmpty()) {
            Response.status(400).entity("Enter details again").build()
        } else {
            spreadSheetId = parseLink(spreadSheetLink)
            println("Extracted Spreadsheet Id is : $spreadSheetId")
            val res = sheetsInfoService.createSheetsInfoTable()
            println("After Create: $res")
            val sheets = GoogleSheet()
            val sheetData = sheets.getSpreadSheetRecords(spreadSheetId, range)
            if (sheetsInfoService.checkExistence(spreadSheetId, range) == null) {
                val ins = sheetsInfoService.insert(spreadSheetId, range, this.columnNames.size + 1, structured.toString(), columnNames.toString())
                println("After Insert: $ins")
                val primKey = sheetsInfoService.checkExistence(spreadSheetId, range)
                if(structured) {
                    if (sheetData != null) {
                        syncStructuredTable(primKey.toString(), columnNames, columnTypes, hasLabel, sheetData)
                    }
                }
//                else {
//                    syncTable(primKey.toString(), hasLabel, sheetData)
//                }
                if (sheetData != null) {
                    val cols = sheetData[0].size
                    println(cols.toString() + ":: " + sheetData[0])
                    println("Done")
                    Response.status(200).entity("Success").build()
                }
                Response.status(200).entity("Success").build()
            } else {
                println("Already Exists")
                Response.status(403).entity("A Job is Already running for this SpreadSheet").build()
            }


        }

    }

    private fun syncStructuredTable(tableName: String, columnNames: List<String>, columnTypes: List<String>, hasLabel: Boolean, sheetData: List<List<Any>>) {
        val str = StringBuilder()
        str.append("rowId integer primary key,")
        for((colInd, columnName) in columnNames.withIndex()) {
            str.append(columnName)
            str.append(" ")
            str.append(columnTypes[colInd])
            if (colInd != columnNames.size-1) {
                str.append(",")
            }
        }
        sheetTableService.createSheetsInfoTable("table$tableName", str.toString())
        var newSheet: List<List<String>> = sheetData as List<List<String>>
        if(hasLabel) {
            newSheet = sheetData.subList(1, sheetData.size)
        }
        val colStr = columnNames.joinToString(separator = ",")
        println("L: $colStr")
        var colValues: MutableList<String> = columnNames as MutableList<String>
        colValues.clear()
        var insertData = StringBuilder()
        for (row in newSheet) {
            insertData.append("(")
            insertData.append(row.joinToString(separator = ",") { it -> "\"$it\"" })
            insertData.append("),")
        }
        sheetTableService.insert("table$tableName", colStr, insertData.toString().substring(0, insertData.length-1))
//        sheetTableService.insert("table$tableName", colStr, colValues)
    }

    private fun syncTable(tableName: String, hasLabel: Boolean) {

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