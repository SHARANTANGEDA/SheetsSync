package com.udaan.sheets.db
import com.udaan.sheets.models.SheetsInfo
import io.dropwizard.hibernate.AbstractDAO
import org.hibernate.SessionFactory
import org.hibernate.query.Query
import javax.persistence.NoResultException

class SheetsInfoDao(sessionFactory: SessionFactory?) : AbstractDAO<SheetsInfo?>(sessionFactory) {

//    fun createTable() {
//        namedQuery(
//            "udaan.SheetsInfo.createTable"
//        ) as Query
//    }

    fun check(spreadsheetid: String, sheetname: String): String? {
        val query = (namedQuery("udaan.SheetsInfo.check").setParameter("spreadsheetid", spreadsheetid).setParameter("sheetname", sheetname)as Query)
        return try {
            query.singleResult.toString()
        } catch (noResult: NoResultException) {
            null
        }
    }

    fun insertSheet(spreadsheetid: String, sheetname: String): SheetsInfo? {
        return persist(SheetsInfo(spreadsheetid, sheetname))
    }
}


object SheetsInfoService {

    private lateinit var sheetsInfoDao: SheetsInfoDao
    fun setDAO(userDAO: SheetsInfoDao) {
        SheetsInfoService.sheetsInfoDao = userDAO
    }
//
//    fun createTable(): Int {
//        sheetsInfoDao.createTable()
//        return 1
//    }

    fun insertRow(spreadsheetid: String, sheetname: String): Int {
        sheetsInfoDao.insertSheet(spreadsheetid, sheetname)
        return 1
    }

    private fun checkRow(spreadsheetid: String, sheetname: String): String? {
        return sheetsInfoDao.check(spreadsheetid, sheetname)
    }
}