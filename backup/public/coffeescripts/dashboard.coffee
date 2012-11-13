class DashBoard
    constructor: () ->
        @myItems = new ItemList("#btnAddItem", "#yourList", "#itemName", "#itemDesc", "#itemLink")
        
dash = new DashBoard()