package com.udaan.sheets

import com.fasterxml.jackson.annotation.JsonProperty
import io.dropwizard.Configuration
import io.dropwizard.bundles.assets.AssetsBundleConfiguration
import io.dropwizard.bundles.assets.AssetsConfiguration
import io.dropwizard.db.DataSourceFactory
import io.dropwizard.db.PooledDataSourceFactory
import javax.validation.Valid
import javax.validation.constraints.NotNull

//class SheetsSyncConfiguration : Configuration() // TODO: implement service configuration

class SheetsSyncConfiguration : Configuration(), AssetsBundleConfiguration {

    @Valid
    @NotNull
    @JsonProperty
    private val assets = AssetsConfiguration.builder().build()
    override fun getAssetsConfiguration(): AssetsConfiguration {
        return assets
    }

    @Valid
    @NotNull
    private var database: DataSourceFactory = DataSourceFactory()

    fun getDataSourceFactory(): DataSourceFactory {
        return database
    }
    @JsonProperty("database")
    fun setDataSourceFactory(factory: DataSourceFactory) {
        database = factory
    }


}