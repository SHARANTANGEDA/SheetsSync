package com.udaan.sheets.db
import com.udaan.sheets.models.SheetsInfo
import com.udaan.sheets.models.SheetsInfoMapper
import org.jdbi.v3.sqlobject.config.RegisterRowMapper
import org.jdbi.v3.sqlobject.customizer.Bind
import org.jdbi.v3.sqlobject.statement.SqlQuery
import org.jdbi.v3.sqlobject.statement.SqlUpdate

@RegisterRowMapper(SheetsInfoMapper::class)
interface SheetsInfoDao {

    @SqlUpdate("create table if not exists SheetsInfo (id integer primary key, spreadsheetid TEXT not " +
            "null, sheetname TEXT not null, cols integer not null, hasLabel integer not null" +
            ", state integer not null, structured integer not null)")
    fun createSheetsInfoTable()
//, columnnames text, columntypes text
    @SqlUpdate("insert into SheetsInfo (spreadsheetid, sheetname,cols, haslabel, state, structured) " +
            "values (:spreadsheetid, :sheetname, :cols, :haslabel, :state, :structured)")
    fun insert(@Bind("spreadsheetid") spreadsheetid:String, @Bind("sheetname")sheetname:String,
               @Bind("cols") cols: Int, @Bind("haslabel") haslabel: Int, @Bind("state") state: Int,
               @Bind("structured") structured: Int)

    @SqlUpdate("update  SheetsInfo set state = :state where spreadsheetid=:spreadsheetid and sheetname=:sheetname")
    fun updateState(@Bind("spreadsheetid") spreadsheetid:String, @Bind("sheetname")sheetname:String,
                    @Bind("state") state: Int)

    @SqlQuery("select id from SheetsInfo where spreadsheetid = :spreadsheetid and sheetname = :sheetname")
    fun checkExistence(@Bind("spreadsheetid") spreadsheetid: String, @Bind("sheetname")sheetname: String): String?

    @SqlQuery("select id, spreadsheetid, sheetname, cols, haslabel, state, structured from SheetsInfo " +
            "where spreadsheetid = :spreadsheetid and sheetname = :sheetname")
    fun getInfo(@Bind("spreadsheetid") spreadsheetid: String, @Bind("sheetname")sheetname: String): SheetsInfo

    @SqlUpdate("delete from SheetsInfo where spreadsheetid = :spreadsheetid and sheetname = :sheetname")
    fun remove(@Bind("spreadsheetid") spreadsheetid: String, @Bind("sheetname")sheetname: String)

    @SqlQuery("select * from SheetsInfo where state= :state")
    fun getActiveSheets(@Bind("state") state: Int): List<SheetsInfo>?

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

    fun insert(spreadsheetid:String, sheetname:String, cols: Int, hasLabel: Int, state: Int, structured: Int): Int {
        sheetsInfoDao.insert(spreadsheetid, sheetname, cols, hasLabel, state, structured)
        println("Inserted Data")
        return 1
    }
    fun updateState(spreadsheetid:String, sheetname:String, state: Int): Int {
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

    fun getActiveSheets(state: Int): List<SheetsInfo>? {
        return sheetsInfoDao.getActiveSheets(state)
    }

    fun getInfoById(id: Int): SheetsInfo? {
        return sheetsInfoDao.getInfoById(id)
    }

}