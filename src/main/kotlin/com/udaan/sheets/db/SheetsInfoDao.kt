package com.udaan.sheets.db
import com.udaan.sheets.models.SheetsInfoMapper
import org.jdbi.v3.sqlobject.config.RegisterRowMapper
import org.jdbi.v3.sqlobject.customizer.Bind
import org.jdbi.v3.sqlobject.statement.SqlQuery
import org.jdbi.v3.sqlobject.statement.SqlUpdate

@RegisterRowMapper(SheetsInfoMapper::class)
public interface SheetsInfoDao {

    @SqlUpdate("create table if not exists SheetsInfo (id integer primary key, spreadsheetid varchar(150) not " +
            "null, sheetname varchar(150) not null, cols integer not null, structured varchar(50) not null, columnnames varchar (350))")
    fun createSheetsInfoTable()

    @SqlUpdate("insert into SheetsInfo (spreadsheetid, sheetname, cols, structured, columnNames) " +
            "values (:spreadsheetid, :sheetname, :cols, :structured, :columnNames)")
    fun insert(@Bind("spreadsheetid") spreadsheetid:String, @Bind("sheetname")sheetname:String,
               @Bind("cols") cols: Int, @Bind("structured") structured: String, @Bind("columnNames") columnNames: String)

    @SqlQuery("select id from SheetsInfo where spreadsheetid = :spreadsheetid and sheetname = :sheetname")
    fun checkExistence(@Bind("spreadsheetid") spreadsheetid: String, @Bind("sheetname")sheetname: String): String?

    @SqlUpdate("delete from SheetsInfo where spreadsheetid = :spreadsheetid and sheetname = :sheetname")
    fun remove(@Bind("spreadsheetid") spreadsheetid: String, @Bind("sheetname")sheetname: String)


}


class SheetsInfoService {
    lateinit var sheetsInfoDao: SheetsInfoDao

    constructor() {}
    constructor(sheetsInfoDao: SheetsInfoDao) {
        this.sheetsInfoDao = sheetsInfoDao
    }

    fun createSheetsInfoTable(): Int {
        println("Created Table")
        sheetsInfoDao.createSheetsInfoTable()
        return 1
    }

    fun insert(spreadsheetid:String, sheetname:String, cols: Int, structured: String,columnNames: String): Int {
        sheetsInfoDao.insert(spreadsheetid, sheetname, cols, structured, columnNames)
        println("Inserted Data")
        return 1
    }
    fun checkExistence(spreadsheetid: String, sheetname: String): String? {
        return sheetsInfoDao.checkExistence(spreadsheetid, sheetname)
    }
    fun remove(spreadsheetid: String, sheetname: String): Int {
        sheetsInfoDao.remove(spreadsheetid, sheetname)
        return 1
    }

}