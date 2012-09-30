class QuickJump
    constructor: (btn, jump) ->
        @btn = $(btn)
        @jump = jump
        @btn.on "click", @goto
    goto: () =>
        currentLoc = window.location.href
        if currentLoc.indexOf("#")
            currentLoc = currentLoc.split("#")[0]
        window.location.href = currentLoc + @jump
        $(@jump).siblings("input").first().focus()
        return