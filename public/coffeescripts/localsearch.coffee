class LocalSearch
    constructor: (button) ->
        @latitude = undefined;
        @longitude = undefined;
        @button = $(button)
        ##@field = $(container).find(".jqField")
        $("body").on("click", button, @search)
        if navigator.geolocation
            navigator.geolocation.getCurrentPosition (position) =>
                @latitude = position.coords.latitude
                @longitude = position.coords.longitude
                return
    search: (evt) =>
        parent = $(evt.currentTarget).parent()
        item = parent.find("h3")
        keywords = item.text()
        keywords = keywords.replace /\s/g, "+"
        data =
            latitude: @latitude
            longitude: @longitude
            keywords: keywords
        Utility.ajaxOptions.url = "/searchretailigence"
        Utility.ajaxOptions.success = (response) ->
            if response.RetailigenceSearchResult
                results = response.RetailigenceSearchResult
                resultCount = results.count
                parent.find(".results").empty()
                parent.find(".results").append("<h3>Local Results</h3>")
                if resultCount                    
                    items = results.results
                    itemTemp = "<li>";
                    itemTemp += "<div class='name'><span class='bold'>Product:</span> {name}</div>"
                    itemTemp += "<div class='desc'><span class='bold'>Product Description:</span> {desc}</div>"
                    itemTemp += "<a href='{url}' class='url'>Link to Item</a>"
                    itemTemp += "<div class='price'><span class='bold'>Price:</span> {price}<span class='currency'> in {currency}</span></div>"
                    itemTemp += "<div class='sku'><span class='bold'>SKU:</span> {sku}</div>"
                    itemTemp += "<div class='quantity'><span class='bold'>Quantity:</span> {quantity}</div>"
                    itemTemp += "<div class='loc_name'><span class='bold'>Retailer:</span> {loc_name}</div>"
                    itemTemp += "<input type='button' class='btn btn-small btnLocalMap' value='Map' />"
                    itemTemp += "<input type='hidden' class='location' value='{location}' />"
                    itemTemp += "</li>"
                    for item, i in items
                        newTemp = itemTemp
                        result = item.SearchResult
                        name = result.product.name
                        desc = result.product.descriptionLong
                        price = result.price
                        currency = result.currency
                        sku = result.product.sku
                        quantity = result.quantityText
                        url = result.product.url
                        location = result.location.location.latitude.toString() + ", " + result.location.location.longitude.toString()
                        loc_name = result.location.name
                        newTemp = newTemp.replace("{name}", name).replace("{desc}", desc).replace("{url}", url)
                        newTemp = newTemp.replace("{price}", price).replace("{currency}", currency)
                        newTemp = newTemp.replace("{sku}", sku).replace("{quantity}", quantity)
                        newTemp = newTemp.replace("{loc_name}", loc_name).replace("{location}", location)
                        parent.find(".results").append(newTemp)
                else
                    parent.find(".results").append("<div class='no_results'>Nothing Found Locally</div>")
            return
        Utility.ajaxOptions.error = () ->
            return
        Utility.ajaxOptions.data = JSON.stringify(data)
        $.ajax(Utility.ajaxOptions)