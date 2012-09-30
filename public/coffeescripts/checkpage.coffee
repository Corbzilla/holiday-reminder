class CheckPage
    constructor: (addBtn) ->
        @afl = new AddFriendList("#btnAddList", "#friend", ".btnMarked")
        @check = new FriendCheck("#btnCheckFriends", "#email")
        
check = new CheckPage()