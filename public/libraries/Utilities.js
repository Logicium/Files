String.prototype.trunc = String.prototype.trunc ||
    function(n){
        return (this.length > n) ? this.substr(0, n-1) + '&hellip;' : this;
    };

function camelCase(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
        return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
    }).replace(/\s+/g, '');
}

function syncJSON(i_url, data,callback) {
    $.ajax({
        type: "POST",
        async: false,
        url: i_url,
        data:data,
        contentType: "application/json",
        dataType: "json",
        success: function (msg) { callback(msg) },
        error: function (msg) { alert('error : ' + msg.d); }
    });
}
