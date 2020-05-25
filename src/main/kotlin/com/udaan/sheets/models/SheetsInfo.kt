package com.udaan.sheets.models

import com.google.api.services.sheets.v4.model.Spreadsheet
import org.hibernate.validator.constraints.Length
import org.jdbi.v3.core.mapper.RowMapper
import org.jdbi.v3.core.statement.StatementContext
import java.sql.ResultSet
import java.sql.SQLException
import javax.validation.constraints.NotBlank


class SheetsInfo(id: Int, spreadsheetid: String, sheetname: String, cols: Int, state: String, structured: String,
                 columnNames: String, columnTypes: String) {

//    constructor() {}
    val id:Int = id

    @Length(min = 1, max = 150)
    @NotBlank
    val spreadsheetid = spreadsheetid

    @NotBlank
    @Length(min = 1, max = 150)
    val sheetname: String = sheetname


    val cols: Int = cols

    @NotBlank
    @Length(min = 1, max = 50)
    val state: String = state

    @NotBlank
    @Length(min = 1, max = 50)
    val structured: String = structured

    @NotBlank
    @Length(min = 3, max = 500)
    val columnnames : String = columnNames

    @NotBlank
    @Length(min = 3, max = 500)
    val columntypes : String = columnTypes
}


class SheetsInfoMapper() : RowMapper<SheetsInfo> {

    @Throws(SQLException::class)
    override fun map(resultSet: ResultSet, statementContext: StatementContext): SheetsInfo {
        return SheetsInfo(
            resultSet.getInt("id"),
            resultSet.getString("spreadsheetid"),
            resultSet.getString("sheetname"),
            resultSet.getInt("cols"),
            resultSet.getString("state"),
            resultSet.getString("structured"),
            resultSet.getString("columnnames"),
            resultSet.getString("columntypes")
        )
    }
}