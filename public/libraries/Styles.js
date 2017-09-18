var Styles = {
    height: function (size) {
        return {'height':size}
    },
    width: function (size) {
        return {'width':size}
    },
    size: function (height, width) {
        return {
            'height':height,
            'width':width
        }
    },
    backgroundImageFull:function(imageUrl){
        return {
            'height': '100%',
            'width': '100%',
            'background-size' :'cover',
            'position': 'fixed',
            'z-index': '-1;filter: blur(5px)',
            'background-image': 'linear-gradient(to left,rgba(24, 90, 157, 0.10), rgba(67, 206, 162, 0.10)), url('+ imageUrl +')',
            'pointer-events':'none'
        };
    },
    click : function(){
        return { 'cursor' : 'pointer' };
    },

    buttonText : function(fontName,size,space,charCase){
        return {
            'letter-spacing': space ||'6px',
            'text-transform': charCase || 'uppercase',
            'font-family': fontName || 'Open Sans Condensed',
            'font-size': size ||'16px'
        }
    },
    font:function (obj) {
        obj = obj ||{};
        return {
            'font-family':obj.name||'Open Sans Condensed',
            'font-size':obj.size||'20px',
            'color':obj.color||'black'
        }
    },
    padding:function(pad){
        pad = pad || {};
        return {
            'padding':pad.a,
            'padding-top':pad.t,
            'padding-bottom':pad.b,
            'padding-left':pad.l,
            'padding-right':pad.r
        }
    },
    backgroundImage:function(image){
        return {
            'background-image':'url('+ image +')',
            'background-size':'cover'
        }
    },
    base64Image:function(image,crop) {
        return {
            'background-image': 'url(data:image/jpg;base64,' + image + ')',
            'background-size': crop || 'cover'
        };
    },
    gradientImage:function(obj){
        obj = obj || {};
        return{
            'background-image': 'linear-gradient(to left,'+obj.c1+', '+obj.c2+'), url('+ obj.image +')',
            'background-size': crop || 'cover'
        }
    }
};

var click = function(){
    return {
        'cursor':'pointer'
    };
};

var font = function(size){
    return {'font-size':size};
};


var titleText = function(obj){
    obj = obj || {};
    return {
        'font-size':obj.size||'38px',
        'color':obj.color||'white',
        'letter-spacing':obj.space||'10px',
        'text-transform':obj.charCase||'uppercase',
        'font-family':obj.fontName||'Open Sans Condensed'
    }
};

var base64Image = function(image,crop){
    return {
        'background-image':'url(data:image/jpg;base64,'+image+')',
        'background-size':crop||'cover'
    };
};

var gradientImage = function(image,gradient1,gradient2){
    return {}
};