// Generated by CoffeeScript 1.3.3
(function() {
  var DashBoard, ItemList, dash,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  ItemList = (function() {

    function ItemList(btn, list, name, desc, link) {
      this.clearFields = __bind(this.clearFields, this);

      this.add = __bind(this.add, this);
      this.btn = $(btn);
      this.list = $(list);
      this.name = $(name);
      this.desc = $(desc);
      this.link = $(link);
      $(btn).on("click", this.add);
      $(list).on("mouseenter", "li", this.showDesc).on("mouseleave", "li", this.hideDesc);
    }

    ItemList.prototype.add = function() {
      var item, itemLink, itemOut;
      item = {
        name: this.name.val(),
        desc: this.desc.val(),
        link: this.link.val()
      };
      itemOut = $("<li><h3>" + item.name + "</h3><div class='item_desc'>" + item.desc + "</div></li>");
      if (item.link) {
        itemLink = "<a href='http://" + item.link + "' target='_BLANK'>Link To Item</a>";
        itemOut.append(itemLink);
      }
      this.list.append(itemOut);
      this.clearFields();
    };

    ItemList.prototype.clearFields = function() {
      this.name.val("");
      this.desc.val("");
      this.link.val("");
    };

    ItemList.prototype.showDesc = function() {
      var item, itemDesc;
      item = $(this);
      itemDesc = item.find('.item_desc');
      itemDesc.show();
    };

    ItemList.prototype.hideDesc = function() {
      var item, itemDesc;
      item = $(this);
      itemDesc = item.find('.item_desc');
      itemDesc.hide();
    };

    return ItemList;

  })();

  DashBoard = (function() {

    function DashBoard() {
      this.myItems = new ItemList("#btnAddItem", "#yourList", "#itemName", "#itemDesc", "#itemLink");
    }

    return DashBoard;

  })();

  dash = new DashBoard();

}).call(this);