var ViewFile = function (fileData) {

    var self = this;
    this.viewFilePanel = dimensionalPanel();
    this.panelTitleBar = panelTitle(fileData.name);
    this.collabRow = row().height('50px');
    this.collabOwner = col(1);
    syncJSON('/files/findUser',{token:Token},function(memberData){
        self.collabOwner = new MemberIcon(memberData.icon);
    });
    this.collabMembers = col(10);
    this.collabAdd = col(1).append(new roundIconSm('plus'));
    this.viewerContainer = div().height('400px');
    this.toolsRow = row();
    this.edit = buttonCol('Edit','folder',3).removeClass('cta').addClass('rev').css('color',transparentBlack());
    this.delete = buttonCol('Delete','folder',3).removeClass('cta').addClass('rev').css('color',transparentBlack())
    this.link = buttonCol('Link','folder',3).removeClass('cta').addClass('rev').css('color',transparentBlack())
    this.download = buttonCol('Download','folder',3).removeClass('cta').addClass('rev').css('color',transparentBlack())
    this.infoContainer = div().height('300px').css('color','white').css('background-color',transparentBlackHeavy());
    this.infoR1 = row().height('150px').css('padding-top','50px');
    this.infoR2 = row().height('150px').css('padding-top','50px');
    this.size = col(4).append(text('Size | '+fileData.size || 'tba','14px','white'));
    this.created = col(4).append(text('Created | '+fileData.created,'14px','white'));
    this.edited = col(4).append(text('Edited | '+fileData.edited || 'never','14px','white'));
    this.views = col(4).append(text('Views | '+fileData.views || '0','14px','white'));
    this.downloads = col(4).append(text('Downloads | '+fileData.downloads || '0','14px','white'));
    this.type = col(4).append(text('Type | '+fileData.extension.toUpperCase(),'14px','white'));

    if(/(jpg|gif|png|JPG|GIF|PNG|JPEG|jpeg)$/.test(fileData.extension)){
        $.post('/files/image',{token:Token,path:fileData.path,extension:fileData.extension},function(data){
            $(self.viewerContainer).addClass('animated fadeIn').css('background-image','url(data:image/jpg;base64,'+data+')').css('background-size','cover');
        });
    }else{
        $(self.infoContainer).css('background-color',transparentWhiteHeavy());
    }

    return this.viewFilePanel.append(
        this.panelTitleBar,
        this.collabRow.append(this.collabOwner,this.collabMembers,this.collabAdd),
        this.viewerContainer,
        this.toolsRow.append(this.edit,this.delete,this.link,this.download),
        this.infoContainer.append(
          this.infoR1.append(this.size,this.created,this.edited),
          this.infoR2.append(this.views,this.downloads,this.type)
        )
    );

};
