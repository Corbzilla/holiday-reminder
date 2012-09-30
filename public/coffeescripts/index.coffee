class Index
    constructor: () ->
        @sign = new SignIn()
        @ref = new Register()
        @friendCheck = new FriendCheck("#btnCheckFriends", "#email", true)
        
ind = new Index()