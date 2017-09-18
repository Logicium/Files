var FileCard = function (fileData) {

    this.fileCard = col(3).removeClass('text-center').addClass('text-left').css(Styles.padding({t:'25px',a:'5px'})).click(function(){

        var nr = new NaviRow(fileData.name);
        $('.levelNavi').append(nr.playKeyframe(
            {name:'expand-height',duration:'1s',timingFunction:'ease'},function(){
                $.each($('.naviRow'),function () {
                    $(this).resetKeyframe(function(){});
                    setTimeout(function(){$($(this).find('.levelFace')).resetKeyframe(function(){});},1000);
                });
                $('.levelFace:last').playKeyframe(
                    {name:'new-level',duration:'1s',timingFunction:'ease'}
                );
            }));

        var transformValue = 0;
        $.each( $('.facePanel') ,function(){
            transformValue = transformValue - 1500;
            $(this).css('z-index',transformValue).css('transition','2s ease').css('animation-delay',transformValue/10+'ms')
                .css({'transform':'translateY(300px) translateZ('+transformValue+'px)'});
        });

        $('.faceMatrix').prepend(new ViewFile(fileData).playKeyframe({
            name:'new-panel',duration:'1s',timingFunction:'ease',complete:function(){$(this).resetKeyframe()}
        }));

    });
    this.name = highlightText(fileData.name.trunc(25)).css('text-overflow','ellipsis').css('white-space','pre-line').css('word-break','break-all').css('font-size','22px').css('font-family','Open Sans Condensed');
    this.type = highlightTextLight('Type | '+ (fileData.extension || fileData.type)).css(Styles.font({size:'16px'}));
    this.infoContainer  = div().height('200px').css(Styles.click());
    var self=this;
    if(/(jpg|gif|png|JPG|GIF|PNG|JPEG|jpeg)$/.test(fileData.extension)){
        $.post('/files/image',{path:fileData.path,extension:fileData.extension,token:Token},function(data){
            $(self.infoContainer).css('background-image','url(data:image/jpg;base64,'+data+')').css('background-size','cover')
        });
    }else{
        $(self.infoContainer).css('background-color',transparentWhiteHeavy());
    }

    return this.fileCard.append(
        this.infoContainer.append(
            div().append(this.name).css('padding','20px').css('padding-top','25px'),
            div().append(this.type).css('padding','20px').css('padding-top','50px')
        )
    );
};