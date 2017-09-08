var LevelNavi = function (name) {
    return div().addClass('levelNavi').css('margin','10px').css('perspective','50em').append(new NaviRow(name))
};

var NaviRow = function (name) {

    this.nameCol = col(6);
    this.dimensionalCol = col(6);
    this.dimensionalFace = new LevelFace();

    return row().addClass('animated').css('background-color',transparentWhite()).append(
        this.dimensionalCol.append(this.dimensionalFace),
        this.nameCol.append( div().css('padding-top','75px').css('margin','0 auto').text(name) )
    );
};

var LevelFace = function () {

    this.faceWindow = div().css(Styles.size('200px','100%')).css('pointer-events','auto').css('margin','0 auto')
        .css('padding','0').css('transform-style','preserve-3d');

    this.level = div().css('position','absolute').addClass('face').css('background','rgba(0,0,0,0.25)')
        .css('height','120px').css('width','120px').css({'transform':'rotateX(-90deg) translateZ(30px)'}).css('transition','2s ease');

    return this.faceWindow.append(
        this.level
    );
};
