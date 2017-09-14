var div = function(){return $('<div>')};
var text = function(string,color,size){return div().text(string).css('color',color).css('font-size',size);};

var panel = function(){return div().addClass('contentPanel animated fadeIn').css('overflow','auto').css('padding','100px').css('padding-top','25px');}

var highlightText = function(text){return $('<span style=\"background: rgba(0,0,0,0.71);\">&nbsp;'+text+'&nbsp;</span>').css('color','white');};
var highlightTextLight = function(text){return $('<span style=\"background:'+transparentWhiteHeavy()+'\">&nbsp;'+text+'&nbsp;</span>');};

var dimensionalPanel = function() {
    return div().css('position', 'absolute').addClass('facePanel').css('background', transparentWhite())
        .css('padding', '10px').css('margin', '10px').css('min-height', '600px').css('width', '95%');
};

var navDiv = function(){
    return col(2).addClass('hvr-underline-from-center').css('font-size','16px').css('line-height','50px')
        .css('height','50px').css('color','white').addClass('text-center').css('cursor','pointer')
};

var col = function(colNum){
    return  div().addClass('col-xs-'+colNum).addClass('text-center');
};

var siteBar = function (name) {
    var appName = row().css('line-height','75px').height('80px');
    var logoutButton = buttonCol('Logout','','1').height('100%').css('line-height','75px');
    var styledText = div().addClass('appName col-xs-3').text(name).css('font-size','26px').css('color','black').css('letter-spacing','10px')
        .css('text-transform', 'uppercase').css('display','inline-block').css('font-family','Open Sans Condensed').height('100%').css('background-color',transparentWhiteHeavy());

    return appName.append(
        styledText,
        col('8').height('100%').css('background-color',transparentWhiteHeavy()),
        logoutButton
        // div().addClass('col-xs-1 col-xs-offset-8 text-right').append(
        //     $('<span>').addClass('text-center').css('font-size','large')
        //         .html('&nbsp;Logout&nbsp;').css('display','inline-block').css('color','black').css('border-radius','5px')
        //         .css('border','1px solid black').css('cursor','pointer').css('min-width','91px')
        // )
    );
};

var base64ImageGradient = function(image,gradient){

};
var base64Image = function(){
    return
};

var panelTitle = function(name){
    var appName = row().css('line-height','60px').css('padding','10px').css('background-color',transparentWhiteHeavy()).css('margin-bottom','10px');
    return appName.append(
        div().width('100%').addClass('text-center').text(name).css('font-size','24px').css('color','black').css('letter-spacing','8px')
            .css('text-transform', 'uppercase').css('display','inline-block').css('font-family','Open Sans Condensed')
    );
};

var buttonCol = function(name,icon,colNum){
    icon = icon || '';
    return col(colNum).addClass('button cta').css('letter-spacing','6px').css('text-transform', 'uppercase')
        .css('font-family','Open Sans Condensed').html(icon).text(name).css('margin',0).css('padding',0)
        .css('max-width','100%').css('height','100%').css('line-height','50px').css('font-size','16px');
};

var row = function(){
    return $('<div>').addClass('row').css('margin','0 auto');
};

var image = function(url){
    return $('<div>').css('margin','5px').height('105px').width('150px').css('background-image','url('+ url +')').css('background-size','cover');
};

var circularImage = function(url){
    return div().css('background-image','url('+ url +')').height('100px').width('100px').css('background-size','cover').css('border-radius','50%').css('border','2px white solid')
};

var gradientImage = function(image,color1,color2){
    return $('<div>').css('background-image','linear-gradient(to right,'+color1+','+color2+'), url('+ image +')').css('background-size','cover');
};

var button = function(name){
    return $('<div>').addClass('button ghost').css('line-height','40px').css('min-width','100%').css('margin-top','40px').text(name);
};

var input = function (name,type) {
    var type = type || 'text';
    return $('<input>').attr('type',type).attr('placeholder',name).addClass('button ghost').css('max-width','100%').width('100%')
        .css('color','white').css('display','block').css('margin-top','10px').css('margin-bottom','10px').css('padding','10px')
};

var list = function(array){
    var list = div();
    for(var i in array){
        list.append(div().html(array[i]));
    }
    return list;
};

var title = function(htmlText){
    return div().css('letter-spacing','12px').html(htmlText)
        .css('padding-top','100px').css('color','white').css('font-size','40px').css('font-family','Open Sans Condensed');
};

var subtitle = function (htmlText) {
    return div().css('margin-top','250px').css('font-style','italic').css('letter-spacing','4px').html(htmlText)
        .css('color','white').css('font-size','24px').css('font-family','Open Sans Condensed');
};

var banner = function(image,innerHtml){
    var banner = $('<div>').addClass('').css('background-image','linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.0)),url('+image+')')
        .css('background-size','cover').css('height','600px').css('width','100%').css('background-position','50% 99%').append(
            innerHtml
        )
    return banner;
};

var profileCol = function(imageUrl,role,name,email,size){
    return col(size).append(
        div().css('padding-bottom','20px').css('color','white').html(role).css('font-size','large'),
        div().css('margin','0 auto').css('border-radius','50%').css('height','200px').css('width','200px').css('border','solid white 2px').css('background-image','url('+imageUrl+')').css('background-size','cover'),
        div().css('padding-top','20px').css('color','white').html(name).css('font-size','large'),
        div().css('padding-bottom','20px').css('color','white').html(email).css('font-size','large')
    );
};

var PdfThumb = function(image){
    return $('<div>').css('margin','0 auto').css('height','225px').css('width','175px')
        .css('background-image','url('+image+')').css('background-size','cover');
};

var resource = function(image,name,file){
    return $('<div>').css('background','rgba(246, 246, 246, 0.15)').css('margin','0 auto').css('margin-top','30px').addClass('row').append(
        $('<div>').addClass('col-xs-3').css('margin','20px').append(
            new PdfThumb(image)
        ),
        $('<div>').addClass('col-xs-5 text-center').append(
            $('<div>').css('font-size','24px').css('color','white').css('margin','40px').css('padding-top','70px').text(name)
        ),
        $('<div>').addClass('<div>').addClass('col-xs-3 text-center').append(
            $('<div>').css('background','rgba(0, 0, 0, 0.75)').addClass('hvr-sweep-to-bottom').css('margin','20px')
                .css('color','white').css('font-size','20px').css('height','75px').css('width','100%').css('padding-right','25px').css('padding-left','25px').css('max-width', '200px')
                .css('cursor','pointer').css('line-height','75px').css('margin-top','85px').text('Download')
        ).click(function(){
            window.open(('/download?path='+file),'_self',false);
        })
    );
};

var background = function(url){
    var backgroundClass = {
        'height': '100%',
        'width': '100%',
        'background-size' :'cover',
        'position': 'fixed',
        'z-index': '-1;filter: blur(20px)'
    };

    var backgroundImage = $('<div>').addClass('backgroundImage').css(backgroundClass)
        .css('background-image','url('+ url +')');
    return backgroundImage;
};
