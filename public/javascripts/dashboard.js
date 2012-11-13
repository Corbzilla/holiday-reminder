// Generated by CoffeeScript 1.3.3
(function() {
  var AddFriendList, DashBoard, FriendCheck, ItemList, LocalSearch, MobileNav, QuickJump, ShoppingList, Utility, dash,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Utility = (function() {

    function Utility() {}

    Utility.ajaxOptions = {
      url: "/",
      type: "POST",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      success: function() {},
      error: function() {},
      complete: function() {}
    };

    Utility.btnDisable = function() {
      $("body").on("click", ".btn:not(.btn-success)", function() {
        $(this).addClass("disabled");
      });
    };

    return Utility;

  })();

  ItemList = (function() {
    var removeHold;

    function ItemList(btn, list, name, desc, link) {
      this.clearFields = __bind(this.clearFields, this);

      this.add = __bind(this.add, this);
      this.btn = $(btn);
      this.list = $(list);
      this.name = $(name);
      this.desc = $(desc);
      this.link = $(link);
      $(btn).on("click", this.add);
      $("body").on("click", ".item_desc", this.showDesc);
      $("body").on("click", ".btnAmazon", this.amazonSearch);
      $("#results").on("click", ".amazon-result", this.loadAmazonResult);
      $("body").on("click", ".bntAddToList", this.displayShoppingList);
      $("#createdListsAdd").on("click", "li", this.addToShoppingList);
      $("body").on("click", ".jqAmazon-link", this.addLink);
    }

    ItemList.prototype.add = function() {
      var item, itemLink, itemOut;
      item = {
        name: this.name.val(),
        desc: this.desc.val(),
        link: this.link.val()
      };
      itemOut = $("<li><h3>" + item.name + "</h3><div class='item_desc'>Show Description</div><div class='item_data'>" + item.desc + "</div></li>");
      if (item.link) {
        itemLink = "<div class='link_container'>";
        itemLink += "<a href='http://" + item.link + "' target='_BLANK'>Link To Item</a>";
        itemLink += "</div>";
        itemOut.append(itemLink);
      }
      itemOut.append("<input type='button' class='btnAmazon btn btn-small' value='Search Amazon' />");
      itemOut.append("<input type='button' class='btn btn-small bntAddToList' value='Add to Shopping List' />");
      itemOut.append("<input type='button' class='btn btn-small btnFindLocal' value='Find Locally' />");
      itemOut.append("<input type='hidden' class='itemId-updating' value='0'/>");
      itemOut.append("<div class='results'></div>");
      this.list.append(itemOut);
      Utility.ajaxOptions.url = "/additem";
      Utility.ajaxOptions.success = function(response) {
        var itemUpdating;
        if (response) {
          itemUpdating = $(".itemId-updating");
          itemUpdating.val(response._id);
          itemUpdating.removeClass(".itemId-updating").addClass(".itemId");
        }
      };
      Utility.ajaxOptions.error = function() {};
      Utility.ajaxOptions.data = JSON.stringify(item);
      $.ajax(Utility.ajaxOptions);
      this.clearFields();
    };

    ItemList.prototype.clearFields = function() {
      this.name.val("");
      this.desc.val("");
      this.link.val("");
    };

    ItemList.prototype.showDesc = function() {
      var el, isVisible, item, itemDesc, text;
      el = $(this);
      isVisible = el.data("visible") || false;
      text = "";
      item = el.parent();
      itemDesc = item.find('.item_data');
      if (!isVisible) {
        text = "Hide Description";
        itemDesc.show();
        el.data("visible", true);
      } else {
        text = "Show Description";
        itemDesc.hide();
        el.data("visible", false);
      }
      el.text(text);
    };

    ItemList.prototype.holdDesc = function() {
      var item, itemDesc, list;
      item = $(this);
      list = item.parent();
      itemDesc = item.find('.item_desc');
      itemDesc.show();
      list.off("mouseenter").off("mouseleave");
      list.on("li", "click", removeHold);
    };

    removeHold = function() {
      var item, list;
      item = $(this);
      list = item.parent();
      list.off("click");
      list.on("mouseenter", "li", this.showDesc).on("mouseleave", "li", this.hideDesc);
      list.on("click", "li", this.holdDesc);
    };

    ItemList.prototype.amazonSearch = function() {
      var btn, data, item, keywords;
      btn = $(this);
      item = btn.parent();
      keywords = item.find("h3").text();
      data = {
        keywords: keywords
      };
      Utility.ajaxOptions.url = "/amazonsearch";
      Utility.ajaxOptions.success = function(response) {
        var container, href, i, itemAttrs, itemFormattedPrice, itemListPrice, itemTitle, items, linkCss, parent, results, tooltipText, url, _i, _len;
        if (response) {
          btn.removeClass("disabled");
          parent = item;
          results = parent.find(".results");
          results.empty();
          linkCss = "jqAmazon-link";
          container = results.parent().parent();
          tooltipText = "Click here to add this link to help your friends find the item.";
          if (container.attr("id") === "displayList") {
            linkCss = "jqShopping-link";
            tooltipText = "Click here to add this link to help you find the item, your friend will not see this.";
          }
          results.append("<h3>Amazon Results</h3>");
          items = response.ItemSearchResponse.Items[0].Item;
          for (i = _i = 0, _len = items.length; _i < _len; i = ++_i) {
            item = items[i];
            if (item.DetailPageURL) {
              url = item.DetailPageURL[0];
              itemAttrs = item.ItemAttributes[0] || void 0;
              if (itemAttrs) {
                itemTitle = itemAttrs.Title[0] || "";
                itemListPrice = itemAttrs.ListPrice || void 0;
                if (itemListPrice) {
                  itemFormattedPrice = " suggested retail price" + itemListPrice[0].FormattedPrice[0];
                } else {
                  itemFormattedPrice = " no suggested price";
                }
              }
              href = "<div><span class='small-circle " + linkCss + "' rel='tooltip' data-original-title='" + tooltipText + "'>+</span><a href='" + url + "' class='amazon-result'>" + itemTitle + "</a>" + itemFormattedPrice + "</div>";
              parent.find(".results").append(href);
            }
          }
          $("[rel=tooltip]").tooltip();
        }
      };
      Utility.ajaxOptions.error = function() {
        btn.removeClass("disabled");
      };
      Utility.ajaxOptions.data = JSON.stringify(data);
      $.ajax(Utility.ajaxOptions);
    };

    ItemList.prototype.loadAmazonResult = function(evt) {
      var src;
      evt.stopPropagation();
      src = $(this).attr('href');
      window.open(src, "Amazon_Window", "resizable=yes,scrollbars=yes,status=yes");
      return false;
    };

    ItemList.prototype.displayShoppingList = function() {
      var createdLists, item;
      item = $(this).parent();
      createdLists = $("#createdListsAdd").detach();
      item.append(createdLists);
      createdLists.show();
    };

    ItemList.prototype.addToShoppingList = function() {
      var data, item, itemId, listId, parent;
      item = $(this);
      parent = $(this).parent().parent();
      listId = item.find(".shopping-list-val").val();
      itemId = parent.find(".itemId").val();
      data = {
        listId: listId,
        itemId: itemId
      };
      Utility.ajaxOptions.url = "/posttoshoppinglist";
      Utility.ajaxOptions.success = function() {
        $("#createdListsAdd").hide();
        parent.find(".bntAddToList").removeClass("disabled");
      };
      Utility.ajaxOptions.error = function() {
        $("#createdListsAdd").hide();
        parent.find(".bntAddToList").removeClass("disabled");
      };
      Utility.ajaxOptions.data = JSON.stringify(data);
      $.ajax(Utility.ajaxOptions);
    };

    ItemList.prototype.addLink = function() {
      var data, item, itemId, link, linkContainer;
      linkContainer = $(this).parent();
      item = linkContainer.parent().parent();
      link = linkContainer.find("a").attr("href");
      itemId = item.find(".itemId").val();
      data = {
        link: link,
        itemId: itemId
      };
      Utility.ajaxOptions.url = "/addlink";
      Utility.ajaxOptions.success = function() {
        item.find(".item_desc").after("<a href='http://" + data.link + "' target='_BLANK'>Link To Item</a>");
      };
      Utility.ajaxOptions.error = function() {};
      Utility.ajaxOptions.data = JSON.stringify(data);
      $.ajax(Utility.ajaxOptions);
    };

    return ItemList;

  })();

  FriendCheck = (function() {

    function FriendCheck(btn, email, redirect) {
      this.checkFacebook = __bind(this.checkFacebook, this);

      this.submit = __bind(this.submit, this);
      this.email = $(email);
      this.btnCheckFriends = $(btn);
      this.btnCheckFriends.on("click", this.submit);
      $(".jqFriend").on("click", this.submitFriend);
      $("body").on("click", ".jqFbFriend", this.submitFbFriend);
      this.redirect = redirect;
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
        var i, item, itemLink, itemOut, _i, _len;
        if (response) {
          for (i = _i = 0, _len = response.length; _i < _len; i = ++_i) {
            item = response[i];
            itemOut = $("<li><h3>" + item.item.name + "</h3><div class='item_desc'>Show Description</div><div class='item_data'>" + item.item.desc + "</div></li>");
            if (item.link) {
              itemLink = "<div class='link_container'>";
              itemLink += "<a href='http://" + item.item.link + "' target='_BLANK'>Link To Item</a>";
              itemLink += "</div>";
              itemOut.append(itemLink);
            }
            itemOut.append("<input type='button' class='btnAmazon btn btn-small' value='Search Amazon' />");
            itemOut.append("<input type='button' class='btn btn-small bntAddToList' value='Add to Shopping List' />");
            itemOut.append("<input type='button' class='btn btn-small btnFindLocal' value='Find Locally' />");
            itemOut.append("<input type='button' class='btn btn-small btnMarked' value='Mark as Purchased' />");
            itemOut.append("<input type='hidden' class='itemId' value='" + item._id + "' />");
            itemOut.append("<div class='results'></div>");
            friend.parent().append(itemOut);
          }
        }
      };
      getFriendError = function() {};
      Utility.ajaxOptions.url = "/getfriendlist";
      Utility.ajaxOptions.success = getFriendSuccess;
      Utility.ajaxOptions.error = getFriendError;
      Utility.ajaxOptions.data = JSON.stringify(data);
      $.ajax(Utility.ajaxOptions);
    };

    FriendCheck.prototype.submitFbFriend = function() {
      var data, friend, friendId, getFriendError, getFriendSuccess;
      friend = $(this).siblings('.friendId');
      friendId = friend.val();
      data = {
        matchId: friendId
      };
      getFriendSuccess = function(response) {
        var i, item, itemLink, itemOut, _i, _len;
        if (response) {
          for (i = _i = 0, _len = response.length; _i < _len; i = ++_i) {
            item = response[i];
            itemOut = $("<li><h3>" + item.item.name + "</h3><div class='item_desc'>Show Description</div><div class='item_data'>" + item.item.desc + "</div></li>");
            if (item.link) {
              itemLink = "<div class='link_container'>";
              itemLink += "<a href='http://" + item.item.link + "' target='_BLANK'>Link To Item</a>";
              itemLink += "</div>";
              itemOut.append(itemLink);
            }
            itemOut.append("<input type='button' class='btnAmazon btn btn-small' value='Search Amazon' />");
            itemOut.append("<input type='button' class='btn btn-small bntAddToList' value='Add to Shopping List' />");
            itemOut.append("<input type='button' class='btn btn-small btnFindLocal' value='Find Locally' />");
            itemOut.append("<input type='button' class='btn btn-small btnMarked' value='Mark as Purchased' />");
            itemOut.append("<input type='hidden' class='itemId' value='" + item._id + "' />");
            itemOut.append("<div class='results'></div>");
            friend.parent().append(itemOut);
          }
        }
      };
      getFriendError = function() {};
      Utility.ajaxOptions.url = "/getfbfriendlist";
      Utility.ajaxOptions.success = getFriendSuccess;
      Utility.ajaxOptions.error = getFriendError;
      Utility.ajaxOptions.data = JSON.stringify(data);
      $.ajax(Utility.ajaxOptions);
    };

    FriendCheck.prototype.checkFacebook = function() {
      FB.api("/me/friends", function(response) {
        var data;
        if (!response || response.error) {

        } else {
          data = {
            friends: response.data,
            redirect: this.redirect
          };
          Utility.ajaxOptions.url = "/fbfriendlist";
          Utility.ajaxOptions.success = function(response) {};
          Utility.ajaxOptions.error = function(response) {};
          Utility.ajaxOptions.data = JSON.stringify(data);
          $.ajax(Utility.ajaxOptions);
        }
      });
    };

    return FriendCheck;

  })();

  ShoppingList = (function() {

    function ShoppingList(btn, field, list) {
      this.create = __bind(this.create, this);
      $(btn).on("click", this.create);
      this.name = $(field);
      this.list = $(list);
      $("body").on("click", ".shopping-list-item", this.display);
      $("body").on("click", ".jqShopping-link", this.addLink);
    }

    ShoppingList.prototype.create = function() {
      var data, newList, tempList;
      data = {
        listName: this.name.val()
      };
      newList = "<li class='shopping-list-item-updating'>" + data.listName;
      newList += "<input type='hidden' class='shopping-list-val' val='0' / >";
      newList += "</li>";
      this.list.append(newList);
      tempList = this.list;
      Utility.ajaxOptions.url = "/createlist";
      Utility.ajaxOptions.success = function(response) {
        var item;
        if (response) {
          item = tempList.find('.shopping-list-item-updating');
          item.find('.shopping-list-val').val(response.listId);
          item.removeClass('shopping-list-item-updating').addClass('shopping-list-item');
        }
      };
      Utility.ajaxOptions.error = function() {};
      Utility.ajaxOptions.data = JSON.stringify(data);
      return $.ajax(Utility.ajaxOptions);
    };

    ShoppingList.prototype.display = function() {
      var data, item, listId, listName;
      item = $(this);
      listId = item.find('.shopping-list-val').val();
      listName = item.text();
      $('#displayListName').text(listName);
      data = {
        listId: listId
      };
      Utility.ajaxOptions.url = "/getshoppinglist";
      Utility.ajaxOptions.success = function(response) {
        var i, itemLink, itemOut, _i, _len;
        if (response) {
          $("#listId").val(listId);
          $("#displayList").empty();
          for (i = _i = 0, _len = response.length; _i < _len; i = ++_i) {
            item = response[i];
            itemOut = $("<li><h3>" + item.item.name + "</h3><div class='item_desc'>Show Description</div><div class='item_data'>" + item.item.desc + "</div></li>");
            if (item.link) {
              itemLink = "<div class='link_container'>";
              itemLink += "<a href='http://" + item.item.link + "' target='_BLANK'>Link To Item</a>";
              itemLink += "</div>";
              itemOut.append(itemLink);
            }
            itemOut.append("<input type='button' class='btnAmazon btn btn-small' value='Search Amazon' />");
            itemOut.append("<input type='button' class='btn btn-small bntAddToList' value='Add to Shopping List' />");
            itemOut.append("<input type='button' class='btn btn-small btnFindLocal' value='Find Locally' />");
            itemOut.append("<input type='button' class='btn btn-small btnMarked' value='Mark as Purchased' />");
            itemOut.append("<input type='hidden' class='itemId' value='" + item._id + "' />");
            if (item.friendLink) {
              itemOut.append("<a href='" + item.friendLink + "' target='_BLANK' class='shopping-list-link'>Link To Item(Your Selection)</a>");
            }
            itemOut.append("<div class='results'></div>");
            $("#displayList").append(itemOut);
          }
        }
      };
      Utility.ajaxOptions.error = function() {};
      Utility.ajaxOptions.data = JSON.stringify(data);
      return $.ajax(Utility.ajaxOptions);
    };

    ShoppingList.prototype.addLink = function() {
      var data, item, itemId, link, linkContainer, listId;
      linkContainer = $(this).parent();
      item = linkContainer.parent().parent();
      link = linkContainer.find("a").attr("href");
      itemId = item.find(".itemId").val();
      listId = $("#listId").val();
      data = {
        itemId: itemId,
        listId: listId,
        link: link
      };
      Utility.ajaxOptions.url = "/addlistlink";
      Utility.ajaxOptions.success = function(response) {
        if (response) {
          item.find(".item_desc").after("<a href='http://" + data.link + "' class='shopping-list-link' target='_BLANK'>Link To Item</a>");
        }
      };
      Utility.ajaxOptions.error = function() {};
      Utility.ajaxOptions.data = JSON.stringify(data);
      return $.ajax(Utility.ajaxOptions);
    };

    return ShoppingList;

  })();

  MobileNav = (function() {

    function MobileNav(menu, sections) {
      this.select = __bind(this.select, this);
      this.sections = sections;
      this.menu = $(menu);
      this.menu.on("change", this.select);
    }

    MobileNav.prototype.select = function() {
      var selected;
      selected = parseInt(this.menu.val());
      $(".jqSection").not(".hidden-phone").addClass("hidden-phone");
      $(this.sections[selected]).removeClass("hidden-phone");
    };

    return MobileNav;

  })();

  LocalSearch = (function() {

    function LocalSearch(button) {
      this.search = __bind(this.search, this);

      var _this = this;
      this.latitude = void 0;
      this.longitude = void 0;
      this.button = $(button);
      $("body").on("click", button, this.search);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          _this.latitude = position.coords.latitude;
          _this.longitude = position.coords.longitude;
        });
      }
    }

    LocalSearch.prototype.search = function(evt) {
      var btn, data, item, keywords, parent;
      btn = $(evt.currentTarget);
      parent = btn.parent();
      item = parent.find("h3");
      keywords = item.text();
      keywords = keywords.replace(/\s/g, "+");
      data = {
        latitude: this.latitude,
        longitude: this.longitude,
        keywords: keywords
      };
      Utility.ajaxOptions.url = "/searchretailigence";
      Utility.ajaxOptions.success = function(response) {
        var currency, desc, i, itemTemp, items, loc_name, location, name, newTemp, price, quantity, result, resultCount, results, sku, url, _i, _len;
        btn.removeClass("disabled");
        if (response.RetailigenceSearchResult) {
          results = response.RetailigenceSearchResult;
          resultCount = results.count;
          parent.find(".results").empty();
          parent.find(".results").append("<h3>Local Results</h3>");
          if (resultCount) {
            items = results.results;
            itemTemp = "<li>";
            itemTemp += "<div class='name'><span class='bold'>Product:</span> {name}</div>";
            itemTemp += "<div class='desc'><span class='bold'>Product Description:</span> {desc}</div>";
            itemTemp += "<a href='{url}' class='url'>Link to Item</a>";
            itemTemp += "<div class='price'><span class='bold'>Price:</span> {price}<span class='currency'> in {currency}</span></div>";
            itemTemp += "<div class='sku'><span class='bold'>SKU:</span> {sku}</div>";
            itemTemp += "<div class='quantity'><span class='bold'>Quantity:</span> {quantity}</div>";
            itemTemp += "<div class='loc_name'><span class='bold'>Retailer:</span> {loc_name}</div>";
            itemTemp += "<input type='button' class='btn btn-small btnLocalMap' value='Map' />";
            itemTemp += "<input type='hidden' class='location' value='{location}' />";
            itemTemp += "</li>";
            for (i = _i = 0, _len = items.length; _i < _len; i = ++_i) {
              item = items[i];
              newTemp = itemTemp;
              result = item.SearchResult;
              name = result.product.name;
              desc = result.product.descriptionLong;
              price = result.price;
              currency = result.currency;
              sku = result.product.sku;
              quantity = result.quantityText;
              url = result.product.url;
              location = result.location.location.latitude.toString() + ", " + result.location.location.longitude.toString();
              loc_name = result.location.name;
              newTemp = newTemp.replace("{name}", name).replace("{desc}", desc).replace("{url}", url);
              newTemp = newTemp.replace("{price}", price).replace("{currency}", currency);
              newTemp = newTemp.replace("{sku}", sku).replace("{quantity}", quantity);
              newTemp = newTemp.replace("{loc_name}", loc_name).replace("{location}", location);
              parent.find(".results").append(newTemp);
            }
          } else {
            parent.find(".results").append("<div class='no_results'>Nothing Found Locally</div>");
          }
        }
      };
      Utility.ajaxOptions.error = function() {
        btn.removeClass("disabled");
      };
      Utility.ajaxOptions.data = JSON.stringify(data);
      return $.ajax(Utility.ajaxOptions);
    };

    return LocalSearch;

  })();

  QuickJump = (function() {

    function QuickJump(btn, jump) {
      this.goto = __bind(this.goto, this);
      this.btn = $(btn);
      this.jump = jump;
      this.btn.on("click", this.goto);
    }

    QuickJump.prototype.goto = function() {
      var currentLoc;
      currentLoc = window.location.href;
      if (currentLoc.indexOf("#")) {
        currentLoc = currentLoc.split("#")[0];
      }
      window.location.href = currentLoc + this.jump;
      $(this.jump).siblings("input").first().focus();
    };

    return QuickJump;

  })();

  AddFriendList = (function() {

    function AddFriendList(btn, value, btnPurchased) {
      this.error = __bind(this.error, this);

      this.success = __bind(this.success, this);

      this.add = __bind(this.add, this);
      this.value = $(value);
      $(btn).on("click", this.add);
      $(btnPurchased).on("click", this.markPurchased);
      $(".btnAddFbFriend").on("click", this.addFbFriend);
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

    AddFriendList.prototype.addFbFriend = function() {
      var data, matchId;
      matchId = $(this).siblings("friendId").val();
      data = {
        matchId: matchId
      };
      Utility.ajaxOptions.url = "/addfbfriendlist";
      Utility.ajaxOptions.success = function(response) {};
      Utility.ajaxOptions.error = function(response) {};
      Utility.ajaxOptions.data = JSON.stringify(data);
      return $.ajax(Utility.ajaxOptions);
    };

    return AddFriendList;

  })();

  DashBoard = (function() {

    function DashBoard() {
      this.myItems = new ItemList("#btnAddItem", "#yourList", "#itemName", "#itemDesc", "#itemLink");
      this.friendCheck = new FriendCheck("#btnFindFriend", "#friendEmail", false);
      this.shoppingList = new ShoppingList("#btnCreateList", "#listName", "#createdLists");
      this.mobileNav = new MobileNav("#section", ["#wishlistSection", "#friendSection", "#shoppingListSection"]);
      this.localSearch = new LocalSearch(".btnFindLocal");
      this.jumpAddItem = new QuickJump("#addItemJump", "#addItemSection");
      this.jumpAddItem = new QuickJump("#findFriendJump", "#findFriendSection");
      this.jumpAddItem = new QuickJump("#createListJump", "#createListSection");
      this.markPurchased = new AddFriendList("#na", "#na", ".btnMarked");
      Utility.btnDisable();
    }

    return DashBoard;

  })();

  dash = new DashBoard();

}).call(this);