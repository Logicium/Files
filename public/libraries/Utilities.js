String.prototype.trunc = String.prototype.trunc ||
    function(n){
        return (this.length > n) ? this.substr(0, n-1) + '&hellip;' : this;
    };

function camelCase(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
        return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
    }).replace(/\s+/g, '');
}

var searchForMatches = function searchForMatches(){

    $('.card').show();
    var searchKey = $('.search').find('input').val().toLowerCase();
    var providerCards = $('.card');
    console.log(searchKey);

    if(searchKey.length > 0) {

        for (var i = 0; i < providerCards.length; i++) {
            console.log($(providerCards[i]).attr('data-info'));
            var cardData = JSON.parse($(providerCards[i]).attr('data-info'));
            if(
                (String(cardData["name"]).toLowerCase().indexOf(searchKey) >= 0 ) ||
                (String(cardData["description"]).toLowerCase().indexOf(searchKey) >= 0) ||
                (String(cardData["email"]).toLowerCase().indexOf(searchKey) >= 0) ||
                (String(cardData["firstName"]).toLowerCase().indexOf(searchKey) >= 0) ||
                (String(cardData["lastName"]).toLowerCase().indexOf(searchKey) >= 0)
            ){ console.log('Adding search Result: ',cardData); }
            else {
                console.log('Not Matched: ',cardData);
                $(providerCards[i]).hide();
            }
        }
    }
};
$('body').on('keyup', '.search', searchForMatches);

function syncJSON(i_url,data,callback) {
    $.ajax({
        type: "POST",
        async: false,
        data:data,
        url: i_url,
        //contentType: "application/json",
        dataType: "json",
        success: function (msg) { callback(msg) },
        error: function (msg) { alert('error : ' + msg.d); }
      });
}
