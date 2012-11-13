class AddFriendList
    constructor: (btn, value, btnPurchased) ->
        @value = $(value)
        $(btn).on "click", @add
        $(btnPurchased).on "click", @markPurchased
        $(".btnAddFbFriend").on("click", @addFbFriend)
    add: () =>
        data =
            friend: @value.val()
        Utility.ajaxOptions.url ="/addfriendlist"
        Utility.ajaxOptions.success = @success
        Utility.ajaxOptions.error = @error
        Utility.ajaxOptions.data = JSON.stringify(data)
        $.ajax Utility.ajaxOptions
        return
    success: (response) =>
        if response
            return
    error: (response) =>
        if console
            console.error response
        return
    markPurchased: () ->
        $this = $(@)
        item = $this.siblings(".itemId")
        itemId = item.val()
        $this.addClass('disabled')
        $this.off("click");
        data =
            itemId: itemId
        markSuccess = () ->
            return
        markError = () ->
            item.removeClass('disabled')
            $this.on "click", @markPurchased
            return
        Utility.ajaxOptions.url ="/markitempurchased"
        Utility.ajaxOptions.success = markSuccess
        Utility.ajaxOptions.error = markError
        Utility.ajaxOptions.data = JSON.stringify(data)
        $.ajax Utility.ajaxOptions
        return
    addFbFriend: () ->
        matchId = $(@).siblings("friendId").val()
        data =
            matchId: matchId
        Utility.ajaxOptions.url ="/addfbfriendlist"
        Utility.ajaxOptions.success = (response) ->
            return
        Utility.ajaxOptions.error = (response) ->
            return
        Utility.ajaxOptions.data = JSON.stringify(data)
        $.ajax Utility.ajaxOptions