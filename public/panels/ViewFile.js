var ViewFile = function (fileData) {

    var self = this;
    this.viewFilePanel = dimensionalPanel();
    this.panelTitleBar = panelTitle(fileData.name);
    this.viewerContainer = div();

    if(/(jpg|gif|png|JPG|GIF|PNG|JPEG|jpeg)$/.test(fileData.extension)){
        $.post('/files/image',{path:fileData.path,extension:fileData.extension,token:Token},function(data){
            $(self.viewerContainer).append();
            var imageView = div().css('background-image','url(data:image/jpg;base64,'+data+')').css('background-size','cover')
        });
    }else{
        $(self.infoContainer).css('background-color',transparentWhiteHeavy());
    }

    return this.viewFilePanel.append(
        this.panelTitleBar
    );

};
