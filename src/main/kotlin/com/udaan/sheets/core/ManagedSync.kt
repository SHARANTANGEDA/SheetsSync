package com.udaan.sheets.core

import com.google.common.util.concurrent.AbstractScheduledService
import com.udaan.sheets.api.SchedulerTask
import io.dropwizard.lifecycle.Managed
import org.glassfish.jersey.internal.guava.ThreadFactoryBuilder
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit
import javax.inject.Inject


class ManagedPeriodicTask(private val periodicTask: AbstractScheduledService) :
    Managed {
//    private val LOGGER = LoggerFactory.getLogger(ManagedPeriodicTask::class.java)

    @Throws(Exception::class)
    override fun start() {
        periodicTask.startAsync().awaitRunning()
    }

    @Throws(Exception::class)
    override fun stop() {
        periodicTask.stopAsync().awaitTerminated()
    }

}

class BackgroundTask(scheduledTask: SchedulerTask, spreadSheetId: String,
                  sheetName: String, hasLabel: Boolean) : Managed, Runnable {
    private val mainRunner = Executors.newSingleThreadScheduledExecutor(
        ThreadFactoryBuilder().setDaemon(true).setNameFormat("task-%d").build()
    )

    // injected by DI or set programatically
    @Inject
    private val delay: Long = 0

    @Inject
    private val period: Long = 45000

    private val scheduledTask =  scheduledTask
    private val spreadSheetId = spreadSheetId
    private val sheetName = sheetName
    private val hasLabel = hasLabel

    @Throws(java.lang.Exception::class)
    override fun start() {
        mainRunner.scheduleAtFixedRate(this, delay, period, TimeUnit.MILLISECONDS)
    }

    @Throws(java.lang.Exception::class)
    override fun stop() {
        mainRunner.shutdown()
    }

    override fun run() {
        try {
            runInner()
        } catch (e: java.lang.Exception) {
            println("Error executing task$e")
        }
    }

    @Throws(java.lang.Exception::class)
    private fun runInner() {
        scheduledTask.syncTaskStructured(spreadSheetId, sheetName, hasLabel)
    }
//
//    companion object {
//        private val log: Logger = Logger.getLogger(MessageTask::class.java)
//    }
}