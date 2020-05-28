package com.udaan.sheets.db
import com.udaan.sheets.models.SheetsInfo
import com.udaan.sheets.models.SheetsInfoMapper
import org.jdbi.v3.sqlobject.config.RegisterRowMapper
import org.jdbi.v3.sqlobject.customizer.Bind
import org.jdbi.v3.sqlobject.statement.SqlQuery
import org.jdbi.v3.sqlobject.statement.SqlUpdate

@RegisterRowMapper(SheetsInfoMapper::class)
interface SheetsInfoDao {

    @SqlUpdate("create table if not exists SheetsInfo (id integer primary key, spreadsheetid varchar(150) not " +
            "null, sheetname varchar(150) not null, cols integer not null, hasLabel varchar(50) not null" +
            ", state varchar(50) not null, structured varchar(50) not null, columnnames varchar (500), columntypes varchar(500))")
    fun createSheetsInfoTable()

    @SqlUpdate("insert into SheetsInfo (spreadsheetid, sheetname,cols, haslabel, state, structured, columnNames, columntypes) " +
            "values (:spreadsheetid, :sheetname, :cols, :haslabel, :state, :structured, :columnNames, :columnTypes)")
    fun insert(@Bind("spreadsheetid") spreadsheetid:String, @Bind("sheetname")sheetname:String,
               @Bind("cols") cols: Int, @Bind("haslabel") haslabel: String, @Bind("state") state: String,
               @Bind("structured") structured: String, @Bind("columnNames") columnNames: String,
               @Bind("columnTypes") columnTypes: String)

    @SqlUpdate("update  SheetsInfo set state = :state where spreadsheetid=:spreadsheetid and sheetname=:sheetname")
    fun updateState(@Bind("spreadsheetid") spreadsheetid:String, @Bind("sheetname")sheetname:String,
                    @Bind("state") state: String)

    @SqlQuery("select id from SheetsInfo where spreadsheetid = :spreadsheetid and sheetname = :sheetname")
    fun checkExistence(@Bind("spreadsheetid") spreadsheetid: String, @Bind("sheetname")sheetname: String): String?

    @SqlQuery("select id, spreadsheetid, sheetname, cols, haslabel, state, structured, columnnames, columntypes from SheetsInfo " +
            "where spreadsheetid = :spreadsheetid and sheetname = :sheetname")
    fun getInfo(@Bind("spreadsheetid") spreadsheetid: String, @Bind("sheetname")sheetname: String): SheetsInfo

    @SqlUpdate("delete from SheetsInfo where spreadsheetid = :spreadsheetid and sheetname = :sheetname")
    fun remove(@Bind("spreadsheetid") spreadsheetid: String, @Bind("sheetname")sheetname: String)

    @SqlQuery("select * from SheetsInfo where state= :state")
    fun getActiveSheets(@Bind("state") state: String): List<SheetsInfo>?

    @SqlQuery("select * from SheetsInfo where id= :id")
    fun getInfoById(@Bind("id") id: Int): SheetsInfo?

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

    fun insert(spreadsheetid:String, sheetname:String, cols: Int, hasLabel: String, state: String, structured: String,
               columnNames: String, columnTypes: String): Int {
        sheetsInfoDao.insert(spreadsheetid, sheetname, cols, hasLabel, state, structured, columnNames, columnTypes)
        println("Inserted Data")
        return 1
    }
    fun updateState(spreadsheetid:String, sheetname:String, state: String): Int {
        sheetsInfoDao.updateState(spreadsheetid, sheetname, state)
        println("Inserted Data")
        return 1
    }
    fun checkExistence(spreadsheetid: String, sheetname: String): String? {
        return sheetsInfoDao.checkExistence(spreadsheetid, sheetname)
    }

    fun getInfo(spreadsheetid: String, sheetname: String): SheetsInfo {
        return sheetsInfoDao.getInfo(spreadsheetid, sheetname)
    }

    fun remove(spreadsheetid: String, sheetname: String): Int {
        sheetsInfoDao.remove(spreadsheetid, sheetname)
        return 1
    }

    fun getActiveSheets(state: String): List<SheetsInfo>? {
        return sheetsInfoDao.getActiveSheets(state)
    }

    fun getInfoById(id: Int): SheetsInfo? {
        return sheetsInfoDao.getInfoById(id)
    }

}