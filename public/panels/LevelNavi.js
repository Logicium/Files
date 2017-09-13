var LevelNavi = function (name) {
    return div().addClass('levelNavi').css('margin','10px').css('perspective','50em').append(new NaviRow(name))
};

var NaviRow = function (name) {

    this.nameCol = col(6);
    this.dimensionalCol = col(6);
    this.dimensionalFace = new LevelFace();

    return row().addClass('naviRow').css(click()).height('200px').css('transform-style','preserve-3d').css('background-color',transparentWhite()).append(
        this.dimensionalCol.append(this.dimensionalFace),
        this.nameCol.append( div().css('padding-top','75px').css('margin','0 auto').text(name) )
    ).hover(
        function(){$(this).animate({'background-color':transparentBlack(),'color':'white'},300);},
        function () {$(this).animate({'background-color':transparentWhite(),'color':'black'},300)}
    ).click(function () {
        //Calculate number of times to dequeue.
        var thisRow = $(this);
        var dequeueCount = $('.naviRow').length - (thisRow.index()+1);

        console.log((thisRow.index()+1),$('.naviRow').length,dequeueCount);
        dequeue(0,dequeueCount);
    });
};

$.keyframe.define({
    name:'retract-height',
    from:{'height':'200px',opacity:'1'},
    to:{'height':'0px',opacity:'0'}
});

function dequeue(queueIndex,total){
    if(total - (queueIndex+1) >= 0){

        //Remove one Level Navi by retracting the height of the parent, then in the callback, remove the element.
        $('.naviRow:last').playKeyframe({
            name:'retract-height',duration:'1s',timingFunction:'ease',complete:function(){
                //$('.naviRow:last').remove();
            }
        });

        var transformValue = -($('.facePanel').length*1500-1500);
        var reverse = $('.facePanel').get();
        console.log(reverse);
        for(var i = reverse.length-1;i>=0;--i){
            console.log(transformValue,i);
            transformValue = transformValue + 1500;
            $($('.facePanel')[i]).css('z-index',transformValue).css('transition','2s ease')
                .css({'transform':'translateY(0px) translateZ('+transformValue+'px)'});
        }
        //Remove One facepanel, in the callback, bring all remaining face panels forward.
        $('.facePanel:first').fadeOut(750, function() {
            $(this).remove();
            $('.naviRow:last').remove();
            console.log((total - (queueIndex+1) >= 0),total - (queueIndex+1));
            if( total - (queueIndex+1) >= 0){
                dequeue(++queueIndex,total)
            }
        });
    }
}

var LevelFace = function () {

    this.faceWindow = div().css(Styles.size('200px','100%')).css('pointer-events','auto').css('margin','0 auto')
        .css('padding','0').css('transform-style','preserve-3d');

    this.level = div().css('position','absolute').addClass('levelFace').css('background','rgba(0,0,0,0.25)')
        .css('height','120px').css('width','120px').css({'transform':'rotateX(-90deg) translateZ(30px)'}).css('transition','1s ease');

    return this.faceWindow.append(
        this.level
    );
};
