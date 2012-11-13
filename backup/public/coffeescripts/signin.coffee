class SignIn
    constructor: () ->
        @userName = $("#userName")
        @passWord = $("#passWord")
        @btnSignIn = $("#btnSignIn")
        @signInErr = $("#signInErr")
        @btnSignIn.on("click", this.submit)
    submit: () =>
        @signInErr.hide()
        data =
            username: @userName.val()
            password: @passWord.val()
        ##AJAX##
        Utility.ajaxOptions.url ="/signin"
        Utility.ajaxOptions.success = @success
        Utility.ajaxOptions.error = @error
        Utility.ajaxOptions.data = JSON.stringify(data)
        $.ajax(Utility.ajaxOptions)
        return
    success: () =>
        window.location.href ="/dashboard"
        return
    error: () =>
        @signInErr.show()
        return
        
sign = new SignIn()