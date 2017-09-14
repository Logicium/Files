$.keyframe.define({
    name:'expand-height',
    from:{'height':'0px',opacity:'0'},
    to:{'height':'200px',opacity:'1'}
});

$.keyframe.define({
    name:'retract-height',
    from:{'height':'200px',opacity:'1'},
    to:{'height':'0px',opacity:'0'}
});

$.keyframe.define({
    name:'fade-in',
    from:{opacity:'0'},
    to:{opacity:'1'}
});

$.keyframe.define({
    name:'new-panel',
    from:{transform:'translateY(50px) translateZ(100px)',opacity:'0'},
    to:{transform:'translateY(0px) translateZ(0px)',opacity:'1'}
});

$.keyframe.define({
    name:'new-level',
    from:{transform:'rotateX(-80deg) translateZ(0px)',opacity:'0'},
    to:{transform:'rotateX(-90deg) translateZ(30px)',opacity:'1'}
});

var DirectoryCard = function(directoryData){

    var image = directoryData.image || 'public/images/bg5.jpg';

    this.directoryCard = div().css('margin-top','25px');
    this.directoryBanner = gradientImage(image,transparent(),transparentWhite()).append(
        row().append( col(3).append(highlightTextLight(directoryData.name)),col(6),col(3).append(highlightTextLight(directoryData.children.length+' Items')) )
    ).height('200px').addClass('hvr-bgfade').css('padding','75px').css('font-size','30px').css('font-family','Open Sans Condensed')
        .css('background-position','50% 55%').css('cursor','pointer').css('color','black')

        .click(function(){

            var nr = new NaviRow(directoryData.name);
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

            $('.faceMatrix').prepend(new FacePanel(directoryData).playKeyframe({
                name:'new-panel',duration:'1s',timingFunction:'ease',complete:function(){$(this).resetKeyframe()}
            }));

        });

    var self = this;
    var images = [];
    for(var index in directoryData.children){
        var c = directoryData.children[index];
        if( c.type == 'file' && /(jpg|gif|png|JPG|GIF|PNG|JPEG|jpeg)$/.test(c.extension) ) images.push(c)
    }

    if(images.length!=0){
        var deferred = [];
        for(var index in images){
            deferred.push(
                $.ajax({
                    url: '/files/image',
                    data: {token:Token,extension:images[index].extension,path:images[index].path},
                    type: 'POST'
                })
            );
        }
        var now = Date.now();
        var keyframeObject = {name:'hover-slideshow-'+now};
        $.when.apply($, deferred).then(function(){
            // Do your success stuff
            $.each(arguments,function(i,val){
                console.log(i,images.length,val);
                var unitPercent = ((1)/images.length)*100; //1,2,50% unit
                var percent = ((i)/images.length)*100; //1,2, 50% local
                var quarter = (unitPercent)/4; //
                console.log(((i+1)/images.length)+'p%',percent+'%',quarter);
                if(i==0) keyframeObject['0%']={'background-image':'url(data:image/jpg;base64,'+val[0]+')',opacity:'0'};
                keyframeObject[(percent+(quarter))+'%']={'background-image':'url(data:image/jpg;base64,'+val[0]+')',opacity:'1'};
                keyframeObject[(percent+(quarter*2))+'%']={'background-image':'url(data:image/jpg;base64,'+val[0]+')',opacity:'1'};
                keyframeObject[(percent+(quarter*3))+'%']={'background-image':'url(data:image/jpg;base64,'+val[0]+')',opacity:'1'};
                keyframeObject[(percent+(quarter*4))+'%']={'background-image':'url(data:image/jpg;base64,'+val[0]+')',opacity:'1'};
            });
        });

        this.directoryBanner.hover(
            function(){
                console.log(keyframeObject);
                $.keyframe.define(keyframeObject);
                $(self.directoryBanner).playKeyframe({name:'hover-slideshow-'+now,duration:images.length*2000+'ms',iterationCount:'infinite'})
            },
            function(){
                $(self.directoryBanner).resetKeyframe()
            }
        );
    }



    this.statsRow = row();

    directoryData.totals = directoryData.totals || '';

    if(directoryData.totals == ''){
        this.statsRow.append(
            col(12).css('background-color',transparentWhiteHeavy()).text('0 Files & Folders').height('50px')
                .css('font-size','16px').css('line-height','50px').css('letter-spacing','6px')
                .css('text-transform', 'uppercase').css('font-family','Open Sans Condensed')
        )
    }
    else{
        var folderCount = directoryData.totals.folders;
        var fileCount =  directoryData.totals.files;
        var total = folderCount + fileCount;

        this.directoryPercent = buttonCol().css('min-width','15%').css('max-width','85%').width((folderCount/total)*100+'%').text(folderCount+' Folders');
        this.filePercent = buttonCol().css('min-width','15%').css('max-width','85%').width((fileCount/total)*100+'%').text(fileCount+' Files');

        this.statsRow.append(
            this.directoryPercent,
            this.filePercent
        )
    }

    return this.directoryCard.append(
        this.directoryBanner,
        this.statsRow
    )
};
