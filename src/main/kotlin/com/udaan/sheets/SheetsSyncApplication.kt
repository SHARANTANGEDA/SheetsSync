package com.udaan.sheets

//import io.dropwizard.jdbi3.JdbiFactory

import com.intellij.openapi.updateSettings.impl.Product
import com.udaan.sheets.api.EnterSheetName
import com.udaan.sheets.db.SheetsInfoDao
import com.udaan.sheets.db.SheetsInfoService
import com.udaan.sheets.models.SheetsInfo
import io.dropwizard.Application
import io.dropwizard.bundles.assets.ConfiguredAssetsBundle
import io.dropwizard.db.DataSourceFactory
import io.dropwizard.db.PooledDataSourceFactory
import io.dropwizard.setup.Bootstrap
import io.dropwizard.setup.Environment
import org.eclipse.jetty.servlets.CrossOriginFilter
import org.jdbi.v3.core.Jdbi
import java.util.*
import javax.servlet.DispatcherType
import io.dropwizard.hibernate.HibernateBundle;



class SheetsSyncApplication : Application<SheetsSyncConfiguration>() {

    override fun getName(): String {
        return "SheetsSync"
    }
    private val hibernateBundle: HibernateBundle<SheetsSyncConfiguration> =
        object : HibernateBundle<SheetsSyncConfiguration>(
            SheetsInfo::class.java
        ) {
            override fun getDataSourceFactory(configuration: SheetsSyncConfiguration): DataSourceFactory? {
                return configuration.getDataSourceFactory()
            }
        }
    override fun initialize(bootstrap: Bootstrap<SheetsSyncConfiguration>) {
        bootstrap.addBundle(ConfiguredAssetsBundle("/assets/", "/", "index.html"))
        bootstrap.addBundle(hibernateBundle)
    }

    override fun run(configuration: SheetsSyncConfiguration,
                     environment: Environment) {

        environment.jersey().urlPattern = "/api/*"
        val sheetsInfoDao = SheetsInfoDao(hibernateBundle.sessionFactory)
        SheetsInfoService.setDAO(sheetsInfoDao)
        environment.jersey().register(EnterSheetName(sheetsInfoDao))
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
