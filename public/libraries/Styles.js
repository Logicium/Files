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
    backgroundImage:function(imageUrl){
        return {
            'height': '100%',
            'width': '100%',
            'background-size' :'cover',
            'position': 'fixed',
            'z-index': '-1;filter: blur(5px)',
            'background-image': 'linear-gradient(to left,rgba(24, 90, 157, 0.10), rgba(67, 206, 162, 0.10)), url('+ imageUrl +')',
            'pointer-events':'none'
        };
    }
};

var height = function (size) {
    return {'height':size}
};

var width = function (size) {
    return {'width':size}
};

var size = function (height, width) {
    return {
        'height':height,
        'width':width
    }
};

var click = function(){
    return {
        'cursor':'pointer'
    };
};

var backgroundImage = function(imageUrl){
    return {
        'height': '100%',
        'width': '100%',
        'background-size' :'cover',
        'position': 'fixed',
        'z-index': '-1;filter: blur(5px)',
        'background-image': 'linear-gradient(to left,rgba(24, 90, 157, 0.10), rgba(67, 206, 162, 0.10)), url('+ imageUrl +')',
        'pointer-events':'none'
    };
};

var font = function(size){
    return {'font-size':size};
};

var buttonText = function(fontName,size,space,charCase){
    return {
        'letter-spacing': space ||'6px',
        'text-transform': charCase || 'uppercase',
        'font-family': fontName || 'Open Sans Condensed',
        'font-size': size ||'16px'
    }
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