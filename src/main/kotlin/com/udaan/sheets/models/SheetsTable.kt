package com.udaan.sheets.models

//import org.jdbi.v3.core.mapper.RowMapper
//import org.jdbi.v3.core.statement.StatementContext
//import org.skife.jdbi.v2.tweak.ResultSetMapper
//import java.sql.ResultSet
//import java.sql.SQLException
//
//
//class SheetsTable(rowId: Int, vararg cols: String) {
//
//    private val rowId:Int = rowId
//    private val cols: Array<out String> = cols
//
//}

//class SheetsTableMappers() : RowMapper<SheetsTable> {
//
//    @Throws(SQLException::class)
//    override fun map(resultSet: ResultSet, statementContext: StatementContext): SheetsTable {
//        for (i in 1..resultSet.metaData.columnCount) {
//            resultSet.getString("col$i")
//        }
//        return SheetsTable(
//            resultSet.getInt("rowId"),
//            resultSet.getString("cols")
//        )
//    }
//}
//
//class SheetsTableMapper : ResultSetMapper<Map<String, Any>> {
//    @Throws(SQLException::class)
//    override fun map(rs: ResultSet, ctx: StatementContext?): Map<String, Any> {
//        println("Res$rs")
//        val map: MutableMap<String, Any> = mutableMapOf()
//        map[rs.metaData.getColumnLabel(1)] = rs.getInt("rowId");
//
//        for (i in 2..rs.metaData.columnCount) {
//            println("MAP:"+ rs.metaData.getColumnLabel(i)+"::"+i)
//            map[rs.metaData.getColumnLabel(i)] = rs.getString("col$i");
//        }
//        return map.toMap()
//    }
//}

//abstract class SheetsTableMapper : ResultSetMapper<Map<String, Any>> {
//    @Throws(SQLException::class)
//    fun map(index: Int, r: ResultSet, ctx: StatementContext?): Map<String, Any> {
//        val map: MutableMap<String, Any> = HashMap()
//        for (i in 1..r.metaData.columnCount) {
//            map[r.metaData.getColumnLabel(i)] = r.getObject(i)
//        }
//        return map
//    }
//}