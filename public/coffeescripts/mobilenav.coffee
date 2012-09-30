class MobileNav
    constructor: (menu, sections) ->
        @sections = sections
        @menu = $(menu)
        @menu.on "change", @select
    select: () =>
        selected = parseInt(@menu.val())
        $(".jqSection").not(".hidden-phone").addClass("hidden-phone")
        $(@sections[selected]).removeClass("hidden-phone")
        return
        