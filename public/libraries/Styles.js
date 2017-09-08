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
