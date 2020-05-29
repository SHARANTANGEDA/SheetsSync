package com.udaan.sheets

//import io.dropwizard.jdbi3.JdbiFactory

import com.udaan.sheets.api.SheetSync
import com.udaan.sheets.db.SheetTableDao
import com.udaan.sheets.db.SheetTableService
import com.udaan.sheets.db.SheetsInfoDao
import com.udaan.sheets.db.SheetsInfoService
import io.dropwizard.Application
import io.dropwizard.bundles.assets.ConfiguredAssetsBundle
import io.dropwizard.db.PooledDataSourceFactory
import io.dropwizard.lifecycle.Managed
import io.dropwizard.lifecycle.ServerLifecycleListener
import io.dropwizard.setup.Bootstrap
import io.dropwizard.setup.Environment
import org.eclipse.jetty.servlets.CrossOriginFilter
import org.jdbi.v3.core.Jdbi
import java.util.*
import javax.servlet.DispatcherType


class SheetsSyncApplication : Application<SheetsSyncConfiguration>() {

    override fun getName(): String {
        return "SheetsSync"
    }

    override fun initialize(bootstrap: Bootstrap<SheetsSyncConfiguration>) {
        bootstrap.addBundle(ConfiguredAssetsBundle("/assets/", "/", "index.html"))
    }

    override fun run(configuration: SheetsSyncConfiguration,
                     environment: Environment) {

        environment.jersey().urlPattern = "/api/*"

        val factory = JdbiFactory(true)
        val jdbi: Jdbi = factory.build(environment, configuration.getDataSourceFactory(), "sqlite3")
        val sheetsInfoDao = jdbi.onDemand(SheetsInfoDao::class.java)
        val sheetTabledao = jdbi.onDemand(SheetTableDao::class.java)
        //environment.jersey().register(UserResource(jdbi))
        environment.lifecycle().addServerLifecycleListener(ServerLifecycleListener {
            println("I work")
        })
        val sheetSync = SheetSync(SheetsInfoService(sheetsInfoDao), SheetTableService(sheetTabledao), environment)
        environment.jersey().register(sheetSync)
        environment.lifecycle().manage(object : Managed {
            @Throws(Exception::class)
            override fun start() {
                println("Trying to Auto start scheduled tasks")
                sheetSync.startAllTasks()
            }

            @Throws(Exception::class)
            override fun stop() {
                println("Stopped")
            }
        })
        Cors.insecure(environment)
    }
}

object Cors {
    fun insecure(env: Environment) {
        val corsFilter = env.servlets().addFilter("CORS", CrossOriginFilter::class.java)
        corsFilter.setInitParameter(CrossOriginFilter.ALLOWED_METHODS_PARAM, "GET,PUT,POST,DELETE,OPTIONS")
        corsFilter.setInitParameter(CrossOriginFilter.ALLOWED_ORIGINS_PARAM, "*")
        corsFilter.setInitParameter(
            CrossOriginFilter.ALLOWED_HEADERS_PARAM,
            "Content-Type,Authorization,X-Requested-With,Content-Length,Accept,Origin"
        )
        corsFilter.addMappingForUrlPatterns(EnumSet.allOf(DispatcherType::class.java), true, "/*")
    }
}
class JdbiFactory {
    private var autoInstallPlugins = false

    constructor() {}
    constructor(autoInstallPlugins: Boolean) {
        this.autoInstallPlugins = autoInstallPlugins
    }

    fun build(environment: Environment, configuration: PooledDataSourceFactory, name: String?): Jdbi {
        val dataSource = configuration.build(environment.metrics(), name)
        val jdbi = Jdbi.create(dataSource)
        if (autoInstallPlugins) {
            jdbi.installPlugins()
        }
        environment.lifecycle().manage(dataSource)
        return jdbi
    }
}

fun main(args: Array<String>) {
    SheetsSyncApplication().run(*args)
}
