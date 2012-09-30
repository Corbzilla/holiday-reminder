class DashBoard
    constructor: () ->
        @myItems = new ItemList("#btnAddItem", "#yourList", "#itemName", "#itemDesc", "#itemLink")
        @friendCheck = new FriendCheck("#btnFindFriend", "#friendEmail", false)
        @shoppingList = new ShoppingList("#btnCreateList", "#listName", "#createdLists")
        @mobileNav = new MobileNav("#section", ["#wishlistSection", "#friendSection", "#shoppingListSection"])
        @localSearch = new LocalSearch(".btnFindLocal")
        @jumpAddItem = new QuickJump("#addItemJump", "#addItemSection")
        @jumpAddItem = new QuickJump("#findFriendJump", "#findFriendSection")
        @jumpAddItem = new QuickJump("#createListJump", "#createListSection")
        @markPurchased = new AddFriendList("#na", "#na", ".btnMarked")
        
dash = new DashBoard()