class Register
    constructor: () ->
        @regName = $("#regName")
        @regEmail = $("#regEmail")
        @regPass = $("#regPass")
        @regConfirm = $("#regConfirm")
        @btnRegister = $("#btnRegister")
        @passErr = $("#passErr")
        @regErr = $("#regErr")
        @btnRegister.on("click", this.submit)
        @regConfirm.on("keyup", this.checkPass)
    submit: () =>
        @regErr.hide()
        data =
            name: @regName.val()
            email: @regEmail.val()
            pass: @regPass.val()
        ##AJAX ##
        Utility.ajaxOptions.url ="/register"
        Utility.ajaxOptions.success = @success
        Utility.ajaxOptions.error = @error
        Utility.ajaxOptions.data = JSON.stringify(data)
        $.ajax(Utility.ajaxOptions)
        return
    checkPass: () =>
        pass = @regPass.val()
        confirm = @regConfirm.val()
        if pass is confirm
            @passErr.hide()
            return
        else
            @passErr.show()
        return
    success: () =>
        window.location.href = "/dashboard"
    error: () =>
        @regErr.show()
        
reg = new Register()