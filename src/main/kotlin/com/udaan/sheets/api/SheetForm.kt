package com.udaan.sheets.api

import com.fasterxml.jackson.annotation.JsonProperty

class SheetForm {
    @JsonProperty("sheetName")
    val sheetName: String? = null

    @JsonProperty("spreadSheetLink")
    val spreadSheetLink: String? = null

    @JsonProperty("withLabel")
    val withLabel: String? = null
}