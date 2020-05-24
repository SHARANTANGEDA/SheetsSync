package com.udaan.sheets.models

import com.google.api.services.sheets.v4.model.Spreadsheet
import org.hibernate.validator.constraints.Length
import org.jdbi.v3.core.mapper.RowMapper
import org.jdbi.v3.core.statement.StatementContext
import java.sql.ResultSet
import java.sql.SQLException
import javax.validation.constraints.NotBlank


class SheetsTable(id: Int) {

    private val id:Int = id

}


class SheetsTableMapper() : RowMapper<SheetsTable> {

    @Throws(SQLException::class)
    override fun map(resultSet: ResultSet, statementContext: StatementContext): SheetsTable {
        return SheetsTable(
            resultSet.getInt("id")
        )
    }
}