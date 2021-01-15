LoadMenu = function() {
    for (var i = 0; i < SongList.menuList.length; i++) {
        var newMenuElement = new SongMenuElement(SongList.menuList[i], false, i + 1);
        SongListElements.push(newMenuElement);
    }
}