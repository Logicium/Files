var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var util = require('util');
var path = require('path');
//var formidable = require('express-formidable');

var allowCrossDomain = function(req,res,next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};
app.use(allowCrossDomain);
app.set('port', (process.env.PORT || 5000));

var urlencodedParser = bodyParser.urlencoded({ extended: true });
app.use("/public",  express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(require('./Routes'));
app.use('/files',require('./server/VirtualFilesystem'));

var server = app.listen(app.get('port'), function(){
    console.log("Example app listening at http://localhost:%s", app.get('port'))
});
