class ShoppingList
    constructor: (btn, field, list) ->
        $(btn).on "click", @create
        @name = $(field)
        @list = $(list)
        $("body").on "click", ".shopping-list-item", @display
        $("body").on "click", ".jqShopping-link", @addLink
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
        listName = item.text()
        $('#displayListName').text(listName)
        data =
            listId: listId
        Utility.ajaxOptions.url ="/getshoppinglist"
        Utility.ajaxOptions.success = (response) ->
            if response
                $("#listId").val(listId)
                $("#displayList").empty()
                for item, i in response
                    itemOut = $("<li><h3>" + item.item.name + "</h3><div class='item_desc'>Show Description</div><div class='item_data'>"  + item.item.desc + "</div></li>");
                    if item.link
                        itemLink = "<div class='link_container'>"
                        itemLink += "<a href='http://" + item.item.link + "' target='_BLANK'>Link To Item</a>"
                        itemLink += "</div>"
                        itemOut.append(itemLink)
                    itemOut.append("<input type='button' class='btnAmazon btn btn-small' value='Search Amazon' />")
                    itemOut.append("<input type='button' class='btn btn-small bntAddToList' value='Add to Shopping List' />")
                    itemOut.append("<input type='button' class='btn btn-small btnFindLocal' value='Find Locally' />")
                    itemOut.append("<input type='button' class='btn btn-small btnMarked' value='Mark as Purchased' />")
                    itemOut.append("<input type='hidden' class='itemId' value='" + item._id + "' />")
                    if item.friendLink
                        itemOut.append("<a href='" + item.friendLink + "' target='_BLANK' class='shopping-list-link'>Link To Item(Your Selection)</a>")
                    itemOut.append("<div class='results'></div>")
                    $("#displayList").append(itemOut)
            return
        Utility.ajaxOptions.error = () ->
            return
        Utility.ajaxOptions.data = JSON.stringify(data)
        $.ajax(Utility.ajaxOptions)
    addLink: () ->
        linkContainer = $(@).parent()
        item = linkContainer.parent().parent()
        link = linkContainer.find("a").attr("href")
        itemId = item.find(".itemId").val()
        listId = $("#listId").val()
        data =
            itemId: itemId
            listId: listId
            link: link
        Utility.ajaxOptions.url ="/addlistlink"
        Utility.ajaxOptions.success = (response) ->
            if response
                item.find(".item_desc").after("<a href='http://" + data.link + "' class='shopping-list-link' target='_BLANK'>Link To Item</a>")
            return
        Utility.ajaxOptions.error = () ->
            return
        Utility.ajaxOptions.data = JSON.stringify(data)
        $.ajax(Utility.ajaxOptions)