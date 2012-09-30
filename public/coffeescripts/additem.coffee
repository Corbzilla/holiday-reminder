class ItemList
    constructor: (btn, list, name, desc, link) ->
        @btn = $(btn)
        @list = $(list)
        @name = $(name)
        @desc = $(desc)
        @link =$(link)
        $(btn).on("click", @add)
        $(list).on("mouseenter", "li", @showDesc).on("mouseleave", "li", @hideDesc)
        $(list).on("click", "li", @holdDesc)
        $("body").on("click", ".btnAmazon", @amazonSearch)
        $("#results").on("click", ".amazon-result", @loadAmazonResult)
        $("body").on("click", ".bntAddToList", @displayShoppingList)
        $("#createdListsAdd").on("click", "li", @addToShoppingList)
    add: () =>
        item = 
            name: @name.val()
            desc: @desc.val()
            link: @link.val()
        itemOut = $("<li><h3>" + item.name + "</h3><div class='item_desc'>"  +item.desc + "</div></li>");
        if item.link
            itemLink = "<a href='http://" + item.link + "' target='_BLANK'>Link To Item</a>"
            itemOut.append(itemLink)
        itemOut.append("<input type='button' class='btnAmazon btn btn-small' value='Search Amazon' />")
        itemOut.append("<input type='button' class='btn btn-small bntAddToList' value='Add to Shopping List' />")
        itemOut.append("<input type='button' class='btn btn-small btnFindLocal' value='Find Locally' />")
        itemOut.append("<input type='hidden' class='itemId-updating' value='0'/>")
        itemOut.append("<div class='results'></div>")        
        @list.append(itemOut)
        ## AJAX call ##
        Utility.ajaxOptions.url ="/additem"
        Utility.ajaxOptions.success = (response) ->
            if response
                itemUpdating = $(".itemId-updating")
                itemUpdating.val(response._id)
                itemUpdating.removeClass(".itemId-updating").addClass(".itemId")                
            return
        Utility.ajaxOptions.error = () ->
            return
        Utility.ajaxOptions.data = JSON.stringify(item)
        $.ajax(Utility.ajaxOptions)
        @clearFields()
        return
    clearFields: () =>
        @name.val("")
        @desc.val("")
        @link.val("")
        return
    showDesc: () ->
        item = $(@)
        itemDesc = item.find('.item_desc')
        itemDesc.show();
        return
    hideDesc: () ->
        item = $(@)
        itemDesc = item.find('.item_desc')
        itemDesc.hide()
        return
    holdDesc: () ->
        item = $(@)
        list = item.parent()
        itemDesc = item.find('.item_desc')
        itemDesc.show();
        list.off("mouseenter").off("mouseleave")
        list.on("li", "click", removeHold)
        return
    removeHold = () ->
        item = $(@)
        list = item.parent()
        list.off("click")
        list.on("mouseenter", "li", @showDesc).on("mouseleave", "li", @hideDesc)
        list.on("click", "li", @holdDesc)
        return
    amazonSearch: () ->
        item = $(@).parent()
        keywords = item.find("h3").text()
        data =
            keywords: keywords
        Utility.ajaxOptions.url ="/amazonsearch"
        Utility.ajaxOptions.success = (response) ->
            ## add search results to page
            if response
                parent = item
                parent.find(".results").empty()
                parent.find(".results").append("<h3>Amazon Results</h3>")
                items = response.ItemSearchResponse.Items[0].Item
                for item, i in items
                    if item.DetailPageURL
                        url = item.DetailPageURL[0]
                        itemAttrs = item.ItemAttributes[0] or undefined
                        if itemAttrs
                            itemTitle = itemAttrs.Title[0] or ""
                            itemListPrice = itemAttrs.ListPrice or undefined
                            if itemListPrice
                                itemFormattedPrice = " suggested retail price" + itemListPrice[0].FormattedPrice[0]
                            else
                                itemFormattedPrice = " no suggested price"
                        href = "<div><a href='" + url + "' class='amazon-result'>" + itemTitle + "</a>" + itemFormattedPrice + "</div>"
                        parent.find(".results").append(href)
            return
        Utility.ajaxOptions.error = () ->
            return
        Utility.ajaxOptions.data = JSON.stringify(data)
        $.ajax(Utility.ajaxOptions)
        return
    loadAmazonResult: (evt) ->
        evt.stopPropagation()
        src = $(@).attr('href')        
        window.open src, "Amazon_Window", "resizable=yes,scrollbars=yes,status=yes"
        return false
    displayShoppingList: () ->
        item = $(@).parent()
        createdLists = $("#createdListsAdd").detach()
        item.append(createdLists)
        createdLists.show()
        return
    addToShoppingList: () ->
        item = $(@)
        parent = $(@).parent().parent()
        listId = item.find(".shopping-list-val").val()
        itemId = parent.find(".itemId").val()
        data =
            listId: listId
            itemId: itemId
        Utility.ajaxOptions.url ="/posttoshoppinglist"
        Utility.ajaxOptions.success = () ->
            return
        Utility.ajaxOptions.error = () ->
            return
        Utility.ajaxOptions.data = JSON.stringify(data)
        $.ajax(Utility.ajaxOptions)
        return