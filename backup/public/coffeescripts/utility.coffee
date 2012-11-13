class Utility
    constructor: () ->
    @ajaxOptions =
        url: "/"
        type: "POST"
        dataType: "json"
        contentType: "application/json; charset=UTF-8"
        success: () ->
            return
        error: () ->
            return