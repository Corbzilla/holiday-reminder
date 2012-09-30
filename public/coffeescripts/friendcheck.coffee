class FriendCheck
    constructor: (btn, email, redirect) ->
        @email = $(email)
        @btnCheckFriends = $(btn)
        @btnCheckFriends.on("click", @submit)
        $(".jqFriend").on("click", @submitFriend)
        $("#btnFindFb").on("click", @checkFacebook)
        @redirect = redirect
    submit: () =>
        data = 
            email: @email.val()
        window.location.href="/friendlist/" + data.email;
        ##AJAX##
        ##Utility.ajaxOptions.url ="/friendlist"
        ##Utility.ajaxOptions.success = @success
        ##Utility.ajaxOptions.error = @error
        ##Utility.ajaxOptions.data = JSON.stringify(data)
        ##$.ajax(Utility.ajaxOptions)
        return
    submitFriend: () ->
        friend = $(@).siblings('.friendId')
        friendId = friend.val()
        data =
            friend: friendId
        getFriendSuccess = (response) ->
            if response
                for item, i in response
                    itemOut = $("<li><h3>" + item.item.name + "</h3><div class='item_desc'>"  +item.item.desc + "</div></li>");
                    if item.link
                        itemLink = "<a href='http://" + item.item.link + "' target='_BLANK'>Link To Item</a>"
                        itemOut.append(itemLink)
                    itemOut.append("<input type='button' class='btnAmazon btn btn-small' value='Search Amazon' />")
                    itemOut.append("<input type='button' class='btn btn-small bntAddToList' value='Add to Shopping List' />")
                    itemOut.append("<input type='button' class='btn btn-small btnFindLocal' value='Find Locally' />")
                    itemOut.append("<input type='button' class='btn btn-small btnMarked' value='Mark as Purchased' />")
                    itemOut.append("<input type='hidden' class='itemId' value='" + item._id + "' />")
                    itemOut.append("<div class='results'></div>")
                    friend.parent().append(itemOut)
            return
        getFriendError = () ->
            return
        Utility.ajaxOptions.url ="/getfriendlist"
        Utility.ajaxOptions.success = getFriendSuccess
        Utility.ajaxOptions.error = getFriendError
        Utility.ajaxOptions.data = JSON.stringify(data)
        $.ajax(Utility.ajaxOptions)
        return
    checkFacebook: () =>
        FB.api "/me/friends", (response) ->
            if not response or response.error
                ## err handling
            else
                data =
                    friends: response.data,
                    redirect: @redirect
                Utility.ajaxOptions.url ="/fbfriendlist"
                Utility.ajaxOptions.success = (response) ->
                    return
                Utility.ajaxOptions.error = (response) ->
                    return
                Utility.ajaxOptions.data = JSON.stringify(data)
                $.ajax(Utility.ajaxOptions)
            return
        return
    ##success: () =>
        ##window.location.href = "/friendlist"
        ##return
    ##error: () =>
        ##return