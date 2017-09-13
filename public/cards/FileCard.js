var FileCard = function (fileData) {

    this.fileCard = col(3).removeClass('text-center').addClass('text-left').height('200px').css('padding','5px').css('padding-top','25px');
    this.name = highlightText(fileData.name).css('font-size','28px').css('font-family','Open Sans Condensed');
    this.type = highlightText('Type | '+ (fileData.extension || fileData.type)).css('font-size','20px').css('font-family','Open Sans Condensed');
    this.infoContainer  = div();
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
            div().append(this.type).css('padding','20px').css('padding-top','40px')
        )
    );

};