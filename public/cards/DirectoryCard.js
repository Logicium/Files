var DirectoryCard = function(directoryData){

    var image = directoryData.image || 'public/images/bg5.jpg';

    this.directoryCard = div().css('margin-top','25px');
    this.directoryBanner = gradientImage(image,transparent(),transparentWhite()).append(
        row().append( col(3).append(highlightTextLight(directoryData.name)),col(6),col(3).append(highlightTextLight(directoryData.children.length+' Items')) )
    ).height('200px').addClass('hvr-bgfade').css('padding','75px').css('font-size','30px').css('font-family','Open Sans Condensed')
        .css('background-position','50% 55%').css('cursor','pointer').css('color','black')

        .click(function(){

            var index =0;
            var oldRects=[];
            $.each($('.levelNavi'),function(){
                //get the old position rect
                oldRects[index++] = $(this).get(0).getBoundingClientRect();
            });
            console.log(oldRects);
            //add the new one temporarily and save the group.
            $('.levelNavi').append(new NaviRow(directoryData.name));
            index=0;
            var newLevels = $('.levelNavi');
            $.each(newLevels,function(){
                //animate from old to new.
                var newRect = $(this).get(0).getBoundingClientRect();
                //instantly set to Old
                var oldRect = oldRects[index++];
                var id = setInterval(frame, 5);
                function frame() {
                    if (oldRect == newRect) {
                        clearInterval(id);
                    } else {
                        oldRect++;
                        $(this).css('top',oldRect.top+'px').css('bottom',oldRect.bottom+'px').css('left',oldRect.left+'px').css('right',oldRect.right+'px');
                    }
                }

            });





            var transformValue = 0;
            $.each( $('.facePanel') ,function(elem){
                transformValue = transformValue - 1500;
               $(this).css('z-index',transformValue).css('transition','2s ease').css({'transform':'translateY(300px) translateZ('+transformValue+'px)'});
            });

            $('.faceMatrix').prepend(new FacePanel(directoryData));

        });

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

        this.directoryPercent = buttonCol().width((folderCount/total)*100+'%').text(folderCount+' Folders');
        this.filePercent = buttonCol().width((fileCount/total)*100+'%').text(fileCount+' Files');

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
