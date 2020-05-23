package com.udaan.sheets.models

import org.hibernate.annotations.NamedQueries
import org.hibernate.annotations.NamedQuery
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Table
import javax.validation.constraints.NotNull

@Entity
@Table(name = "SheetsInfo")
@NamedQueries(
//    Named(name = "udaan.SheetsInfo.createTable",
//        query = "create table if not exists SheetsInfo (id integer primary key, spreadsheetid varchar(150) not null, sheetname varchar(150) not null)"),
//
//    NamedQuery(name = "udaan.SheetsInfo.insert",
//        query = "insert into SheetsInfo (spreadsheetid, sheetname) values (:spreadsheetid, :sheetname)"),

    NamedQuery(name = "udaan.SheetsInfo.check",
        query = "select id from SheetsInfo where spreadsheetid = :spreadsheetid and sheetname = :sheetname")
)
public class SheetsInfo: java.security.Principal {
    constructor() {}

    @Id
    @Column(name = "id")
    @NotNull
    private var  id: Int = 0

    @NotNull
    @Column(name = "spreadsheetid")
    private lateinit var spreadsheetid:String

    @NotNull
    @Column(name = "sheetname")
    private lateinit var sheetname: String
    constructor(spreadsheetid: String, sheetname: String) {
        this.spreadsheetid = spreadsheetid
        this.sheetname = sheetname
    }
    override fun getName(): String? {
        return sheetname
    }
}


//class SheetsInfoMapper() : RowMapper<SheetsInfo> {
//
//    @Throws(SQLException::class)
//    override fun map(resultSet: ResultSet, statementContext: StatementContext): SheetsInfo {
//        return SheetsInfo(
//            resultSet.getInt("id"),
//            resultSet.getString("spreadsheetid"),
//            resultSet.getString("sheetname")
//        )
//    }
//}