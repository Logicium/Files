var FileCard = function (fileData) {

    this.fileCard = col(3).removeClass('text-center').addClass('text-left').height('200px')
        .css('padding-right','10px').css('padding-left','10px').css('padding-top','25px');
    this.name = highlightText(fileData.name).css('font-size','28px').css('font-family','Open Sans Condensed');
    this.type = highlightText('Type: '+fileData.type).css('font-size','20px').css('font-family','Open Sans Condensed');

    return this.fileCard.append(
        div().css('background-color',transparentWhiteHeavy()).append(
            div().append(this.name).css('padding','20px').css('padding-top','25px'),
            div().append(this.type).css('padding','20px').css('padding-top','40px')
        )
    );

};