class FriendCheck
    constructor: () ->
        @email = $("#email")
        @btnCheckFriends = $("#btnCheckFriends")
        @btnCheckFriends.on("click", this.submit)
    submit: () =>
        data = 
            email: @email.val()
        ##AJAX##
        return
    success: () =>
        window.location.href = "/friendlist"
        return
    error: () =>
        return