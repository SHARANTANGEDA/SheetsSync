package com.udaan.sheets.db
import com.udaan.sheets.models.SheetsInfoMapper
import org.jdbi.v3.sqlobject.config.RegisterRowMapper
import org.jdbi.v3.sqlobject.customizer.Bind
import org.jdbi.v3.sqlobject.customizer.Define
import org.jdbi.v3.sqlobject.statement.SqlBatch
import org.jdbi.v3.sqlobject.statement.SqlQuery
import org.jdbi.v3.sqlobject.statement.SqlUpdate

@RegisterRowMapper(SheetsInfoMapper::class)
public interface SheetTableDao {

    @SqlUpdate("create table if not exists <tableName> (<columns>)")
    fun createSheetsInfoTable(@Define("tableName") tableName: String, @Define("columns") columns: String)

    @SqlUpdate("drop table if exists <tableName>")
    fun deleteTable(@Define("tableName") tableName: String)

    @SqlUpdate("insert into <tableName> (<columns>) values <columnValue>")
    fun insert(@Define("tableName") tableName: String, @Define("columns") columns: String, @Define("columnValue") columnValues: String)

//    @SqlUpdate("delete from <tableName> where spreadsheetid = :spreadsheetid and sheetname = :sheetname") //(<columnValue>)
//    fun remove(@Define("tableName") tableName: String, @Bind("spreadsheetid") spreadsheetid: String, @Bind("sheetname")sheetname: String)


}


class SheetTableService {
    lateinit var sheetsTableDao: SheetTableDao
    constructor() {}
    constructor(sheetsTableDao: SheetTableDao) {
        this.sheetsTableDao = sheetsTableDao
    }

    fun createSheetsInfoTable(tableName: String, columns: String): Int {
        println("Created Table, $columns")
        sheetsTableDao.createSheetsInfoTable(tableName, columns)
        return 1
    }

    fun updateTable(tableName: String, columns: String): Int {
        println("Update Table, $columns")
        sheetsTableDao.deleteTable(tableName)
        sheetsTableDao.createSheetsInfoTable(tableName, columns)
        return 1
    }

    fun insert(tableName: String, columns: String, columnValues: String): Int {
        sheetsTableDao.insert(tableName, columns, columnValues)
        return 1
    }
//    fun remove(spreadsheetid: String, sheetname: String): Int {
//        sheetsTableDao.remove(spreadsheetid, sheetname)
//        return 1
//    }
}