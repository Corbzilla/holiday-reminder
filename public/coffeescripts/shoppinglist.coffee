class ShoppingList
    constructor: (btn, field, list) ->
        $(btn).on "click", @create
        @name = $(field)
        @list = $(list)
        $("body").on "click", ".shopping-list-item", @display
    create: () =>
        data =
            listName: @name.val()
        newList = "<li class='shopping-list-item-updating'>" + data.listName
        newList += "<input type='hidden' class='shopping-list-val' val='0' / >"
        newList += "</li>"
        @list.append(newList)
        tempList = @list
        Utility.ajaxOptions.url ="/createlist"
        Utility.ajaxOptions.success = (response) ->
            if response
                item = tempList.find('.shopping-list-item-updating')
                item.find('.shopping-list-val').val(response.listId)
                item.removeClass('shopping-list-item-updating').addClass('shopping-list-item')
            return
        Utility.ajaxOptions.error = () ->
            return
        Utility.ajaxOptions.data = JSON.stringify(data)
        $.ajax(Utility.ajaxOptions)
    display: () ->
        item = $(@)
        listId = item.find('.shopping-list-val').val()
        listName = item.find('.shopping-list-item').text()
        $('#displayListName').text(listName)
        data =
            listId: listId
        Utility.ajaxOptions.url ="/getshoppinglist"
        Utility.ajaxOptions.success = (response) ->
            if response
                $("#displayList").empty()
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
                    $("#displayList").append(itemOut)
            return
        Utility.ajaxOptions.error = () ->
            return
        Utility.ajaxOptions.data = JSON.stringify(data)
        $.ajax(Utility.ajaxOptions)