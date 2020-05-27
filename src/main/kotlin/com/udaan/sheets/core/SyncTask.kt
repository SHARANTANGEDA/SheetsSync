package com.udaan.sheets.core

import com.google.api.services.sheets.v4.model.Spreadsheet
import com.google.common.util.concurrent.AbstractScheduledService
import com.udaan.sheets.api.SchedulerTask
import java.util.concurrent.TimeUnit


//class SpreadSheetSyncBackgroundTask(scheduledTask: SchedulerTask, spreadSheetId: String,
//                                    sheetName: String, hasLabel: Boolean) : AbstractScheduledService() {
////    private val LOGGER = LoggerFactory.getLogger(ConsoleLoggingScheduledTask::class.java)
//    private val scheduledTask =  scheduledTask
//    private val spreadSheetId = spreadSheetId
//    private val sheetName = sheetName
//    private val hasLabel = hasLabel
//    @Throws(Exception::class)
//    override fun runOneIteration() {
////        LOGGER.info("runOneIteration")
//        scheduledTask.syncTaskStructured(spreadSheetId, sheetName, hasLabel)
//    }
//
//    override fun scheduler(): Scheduler {
//        return Scheduler.newFixedRateSchedule(
//            0,
//            45,
//            TimeUnit.SECONDS
//        )
//    }
//}