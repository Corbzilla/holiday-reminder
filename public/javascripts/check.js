// Generated by CoffeeScript 1.3.3
(function() {
  var AddFriendList, CheckPage, FriendCheck, Utility, check,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Utility = (function() {

    function Utility() {}

    Utility.ajaxOptions = {
      url: "/",
      type: "POST",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      success: function() {},
      error: function() {}
    };

    return Utility;

  })();

  AddFriendList = (function() {

    function AddFriendList(btn, value, btnPurchased) {
      this.error = __bind(this.error, this);

      this.success = __bind(this.success, this);

      this.add = __bind(this.add, this);
      this.value = $(value);
      $(btn).on("click", this.add);
      $(btnPurchased).on("click", this.markPurchased);
    }

    AddFriendList.prototype.add = function() {
      var data;
      data = {
        friend: this.value.val()
      };
      Utility.ajaxOptions.url = "/addfriendlist";
      Utility.ajaxOptions.success = this.success;
      Utility.ajaxOptions.error = this.error;
      Utility.ajaxOptions.data = JSON.stringify(data);
      $.ajax(Utility.ajaxOptions);
    };

    AddFriendList.prototype.success = function(response) {
      if (response) {

      }
    };

    AddFriendList.prototype.error = function(response) {
      if (console) {
        console.error(response);
      }
    };

    AddFriendList.prototype.markPurchased = function() {
      var $this, data, item, itemId, markError, markSuccess;
      $this = $(this);
      item = $this.siblings(".itemId");
      itemId = item.val();
      $this.addClass('disabled');
      $this.off("click");
      data = {
        itemId: itemId
      };
      markSuccess = function() {};
      markError = function() {
        item.removeClass('disabled');
        $this.on("click", this.markPurchased);
      };
      Utility.ajaxOptions.url = "/markitempurchased";
      Utility.ajaxOptions.success = markSuccess;
      Utility.ajaxOptions.error = markError;
      Utility.ajaxOptions.data = JSON.stringify(data);
      $.ajax(Utility.ajaxOptions);
    };

    return AddFriendList;

  })();

  FriendCheck = (function() {

    function FriendCheck(btn, email) {
      this.submit = __bind(this.submit, this);
      this.email = $(email);
      this.btnCheckFriends = $(btn);
      this.btnCheckFriends.on("click", this.submit);
      $(".jqFriend").on("click", this.submitFriend);
    }

    FriendCheck.prototype.submit = function() {
      var data;
      data = {
        email: this.email.val()
      };
      window.location.href = "/friendlist/" + data.email;
    };

    FriendCheck.prototype.submitFriend = function() {
      var data, friend, friendId, getFriendError, getFriendSuccess;
      friend = $(this).siblings('.friendId');
      friendId = friend.val();
      data = {
        friend: friendId
      };
      getFriendSuccess = function(response) {
        friend.parent().append('<p>' + response + '</p>');
      };
      getFriendError = function() {};
      Utility.ajaxOptions.url = "/getfriendlist";
      Utility.ajaxOptions.success = getFriendSuccess;
      Utility.ajaxOptions.error = getFriendError;
      Utility.ajaxOptions.data = JSON.stringify(data);
      return $.ajax(Utility.ajaxOptions);
    };

    return FriendCheck;

  })();

  CheckPage = (function() {

    function CheckPage(addBtn) {
      this.afl = new AddFriendList("#btnAddList", "#friend", ".btnMarked");
      this.check = new FriendCheck("#btnCheckFriends", "#email");
    }

    return CheckPage;

  })();

  check = new CheckPage();

}).call(this);
