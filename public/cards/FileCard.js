var FileCard = function (fileData) {

    this.fileCard = col(3).removeClass('text-center').addClass('text-left').css('padding','5px').css('padding-top','25px');
    this.name = highlightText(fileData.name.trunc(20)).css('text-overflow','ellipsis').css('white-space','pre-line').css('word-break','break-all').css('font-size','22px').css('font-family','Open Sans Condensed');
    this.type = highlightTextLight('Type | '+ (fileData.extension || fileData.type)).css('font-size','16px').css('font-family','Open Sans Condensed');
    this.infoContainer  = div().height('200px');
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

String.prototype.trunc = String.prototype.trunc ||
    function(n){
        return (this.length > n) ? this.substr(0, n-1) + '&hellip;' : this;
    };