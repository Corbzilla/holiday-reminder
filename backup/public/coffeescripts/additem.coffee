class ItemList
    constructor: (btn, list, name, desc, link) ->
        @btn = $(btn)
        @list = $(list)
        @name = $(name)
        @desc = $(desc)
        @link =$(link)
        $(btn).on("click", @add)
        $(list).on("mouseenter", "li", @showDesc).on("mouseleave", "li", @hideDesc)
    add: () =>
        item = 
            name: @name.val()
            desc: @desc.val()
            link: @link.val()
        itemOut = $("<li><h3>" + item.name + "</h3><div class='item_desc'>"  +item.desc + "</div></li>");
        if item.link
            itemLink = "<a href='http://" + item.link + "' target='_BLANK'>Link To Item</a>"
            itemOut.append(itemLink)
        @list.append(itemOut)
        ## AJAX call ##
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