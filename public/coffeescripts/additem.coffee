class ItemList
    constructor: (btn, list, name, desc, link) ->
        @btn = $(btn)
        @list = $(list)
        @name = $(name)
        @desc = $(desc)
        @link =$(link)
        $(btn).on("click", @add)
        $("body").on("click", ".item_desc", @showDesc)
        ##$(list).on("click", "li", @holdDesc)
        $("body").on("click", ".btnAmazon", @amazonSearch)
        $("#results").on("click", ".amazon-result", @loadAmazonResult)
        $("body").on("click", ".bntAddToList", @displayShoppingList)
        $("#createdListsAdd").on("click", "li", @addToShoppingList)
        $("body").on("click", ".jqAmazon-link", @addLink)
    add: () =>
        item = 
            name: @name.val()
            desc: @desc.val()
            link: @link.val()
        itemOut = $("<li><h3>" + item.name + "</h3><div class='item_desc'>Show Description</div><div class='item_data'>"  +item.desc + "</div></li>");
        if item.link
            itemLink = "<div class='link_container'>"
            itemLink += "<a href='http://" + item.link + "' target='_BLANK'>Link To Item</a>"
            itemLink += "</div>"
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
        el = $(@)
        isVisible = el.data("visible") or false
        text = ""        
        item = el.parent()
        itemDesc = item.find('.item_data')
        if not isVisible
            text = "Hide Description"
            itemDesc.show();
            el.data("visible", true)
        else
            text = "Show Description"
            itemDesc.hide();
            el.data("visible", false)
        el.text(text)
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
        btn = $(@)
        item = btn.parent()
        keywords = item.find("h3").text()
        data =
            keywords: keywords
        Utility.ajaxOptions.url ="/amazonsearch"
        Utility.ajaxOptions.success = (response) ->
            ## add search results to page
            if response
                btn.removeClass("disabled")
                parent = item
                results = parent.find(".results")
                results.empty()
                linkCss = "jqAmazon-link"
                container = results.parent().parent()
                tooltipText = "Click here to add this link to help your friends find the item."
                if container.attr("id") == "displayList"
                    linkCss = "jqShopping-link"
                    tooltipText = "Click here to add this link to help you find the item, your friend will not see this."
                results.append("<h3>Amazon Results</h3>")
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
                        href = "<div><span class='small-circle " + linkCss + "' rel='tooltip' data-original-title='" + tooltipText + "'>+</span><a href='" + url + "' class='amazon-result'>" + itemTitle + "</a>" + itemFormattedPrice + "</div>"
                        parent.find(".results").append(href)
                $("[rel=tooltip]").tooltip();
            return
        Utility.ajaxOptions.error = () ->
            btn.removeClass("disabled")
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
            $("#createdListsAdd").hide()
            parent.find(".bntAddToList").removeClass("disabled")
            return
        Utility.ajaxOptions.error = () ->
            $("#createdListsAdd").hide()
            parent.find(".bntAddToList").removeClass("disabled")
            return
        Utility.ajaxOptions.data = JSON.stringify(data)
        $.ajax(Utility.ajaxOptions)
        return
    addLink: () ->
        linkContainer = $(@).parent()
        item = linkContainer.parent().parent()
        link = linkContainer.find("a").attr("href")
        itemId = item.find(".itemId").val()
        data =
            link: link
            itemId: itemId
        Utility.ajaxOptions.url ="/addlink"        
        Utility.ajaxOptions.success = () ->
            item.find(".item_desc").after("<a href='http://" + data.link + "' target='_BLANK'>Link To Item</a>")
            return
        Utility.ajaxOptions.error = () ->
            return
        Utility.ajaxOptions.data = JSON.stringify(data)
        $.ajax(Utility.ajaxOptions)
        return