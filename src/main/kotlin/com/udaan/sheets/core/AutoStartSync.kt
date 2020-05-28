package com.udaan.sheets.core

import com.udaan.sheets.db.SheetTableService
import com.udaan.sheets.db.SheetsInfoService
import com.udaan.sheets.models.SheetsInfo
import io.dropwizard.setup.Environment

class AutoStartSync(sheetsInfoService: SheetsInfoService, sheetTableService: SheetTableService) {
    private lateinit var spreadSheetLink: String
    private lateinit var range: String
    private lateinit var spreadSheetId: String
    private var sheetsInfoService: SheetsInfoService = sheetsInfoService
    private var sheetTableService: SheetTableService = sheetTableService
    private lateinit var columnNames: List<String>
    private lateinit var columnTypes: List<String>
    private var hasLabel: Boolean = true
    private var structured: Boolean = true
    private var map : MutableMap<String, BackgroundTask> = mutableMapOf()



}