package com.udaan.sheets.api

import com.udaan.sheets.core.GoogleSheet
import com.udaan.sheets.db.SheetsInfoDao
import com.udaan.sheets.db.SheetsInfoService
import io.dropwizard.hibernate.UnitOfWork
import javax.ws.rs.*
import javax.ws.rs.core.Form
import javax.ws.rs.core.MediaType
import javax.ws.rs.core.Response

@Path("/")
class EnterSheetName(sheetsInfoDao: SheetsInfoDao) {
    private lateinit var spreadSheetLink: String
    private lateinit var range: String
    private lateinit var spreadSheetId: String
    private var sheetsInfoDao: SheetsInfoDao = sheetsInfoDao

    @Path("/enter")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    @UnitOfWork
    fun getLink(form: Form):Response {
        val formMap = form.asMap()
        spreadSheetLink = formMap["spreadSheetLink"].toString()
        range = ((formMap["sheetName"]?.get(0) ?: formMap["sheetName"]) as String)
        return if( spreadSheetLink.isEmpty() || range.isEmpty()) {
            Response.status(400).entity("Enter details again").build()
        } else {
            spreadSheetId = parseLink(spreadSheetLink)
            println("Extracted Spreadsheet Id is : $spreadSheetId")
//            val res = sheetsInfoDao.createTable()
//            println("After Create: $res")
            val preRes = sheetsInfoDao.check(spreadSheetId, range)
            println("PreRes: $preRes")
            if (preRes == null) {
                val ins = sheetsInfoDao.insertSheet(spreadSheetId, range)
                println("After Insert: ${ins.toString()}")
            }
            val result = sheetsInfoDao.check(spreadSheetId, range)
            println("Post check: $result")
            val sheets = GoogleSheet()
            val sheetData = sheets.getSpreadSheetRecords(spreadSheetId, range)
            if (sheetData!=null) {
                val cols = sheetData[0].size
                println(cols.toString()+":: " +sheetData[0])
            }
            println("Done")
            Response.status(200).entity("Success").build()
        }

    }

    // Example Link: https://docs.google.com/spreadsheets/d/1OMxBy70k2htgn48pZwk4pEX0_dX_bTa-/edit#gid=883250178
    private fun parseLink(spreadSheetLink: String):String {
        val idx = spreadSheetLink.indexOf("/d/")
        val end = spreadSheetLink.indexOf("/", idx+3)
        return spreadSheetLink.substring(idx+3, end)
    }
}