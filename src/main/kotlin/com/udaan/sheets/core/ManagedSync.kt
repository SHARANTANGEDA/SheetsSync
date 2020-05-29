package com.udaan.sheets.core

import com.udaan.sheets.api.SchedulerTask
import com.udaan.sheets.db.SheetTableService
import com.udaan.sheets.db.SheetsInfoService
import io.dropwizard.lifecycle.Managed
import org.glassfish.jersey.internal.guava.ThreadFactoryBuilder
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit

class BackgroundTask(sheetsInfoService : SheetsInfoService, sheetTableService: SheetTableService,
                     private val spreadSheetId: String,private val range:String, hasLabel:Int, tableName: String, structured: Int) : Managed {
    private val mainRunner = Executors.newSingleThreadScheduledExecutor(
        ThreadFactoryBuilder().setDaemon(true).setNameFormat(tableName).build()
    )

    // injected by DI or set programatically
    //@Inject
    private val delay: Long = 15

    //@Inject
    private val period: Long = 30


    private val scheduledTask:SchedulerTask = SchedulerTask(sheetsInfoService, sheetTableService, spreadSheetId,
        range, hasLabel, structured)

    @Throws(java.lang.Exception::class)
    override fun start() {
        mainRunner.scheduleWithFixedDelay(scheduledTask, delay, period, TimeUnit.SECONDS)
    }

    @Throws(java.lang.Exception::class)
    override fun stop() {
        println("Shutting Down")
        mainRunner.shutdown()
    }

    fun getDetails() :Pair<String, String> {
        return Pair(spreadSheetId, range)
    }
}
