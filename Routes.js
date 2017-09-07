var express = require('express');
var router = express.Router();
var LinvoDB = require("linvodb3");
LinvoDB.dbPath = process.cwd();
var DirectoryStructureJSON = require('directory-structure-json');
var fs = require('fs');
var path = require('path');
var jwt = require('jsonwebtoken');

var Databases = require('./Databases');
var Folder = require('./libaries/Folder');
var File = require('./libaries/File');

router.get('/',function(request,response){
    response.sendFile('/public/Files.html', {"root": __dirname});
});

router.post('/login', function (request, response) {

    console.log("New user login request.");
    var incomingUser = request.body;
    console.log(incomingUser);

    var Users = Databases.Users.find({username:incomingUser.username,password:incomingUser.password},function(err,docs){
        console.log(docs);
        if (!(docs.length==0)) {
            var token = jwt.sign({U:incomingUser.username}, 'superSecret', {expiresIn: '10h'}); //expires in 24 hours
            //Next, sign user's database record with the token, serves as a unique password for their unique userFolder.
            response.send({message: 'Login Success!', success: true, token: token});
        }
        else {
            response.send({message: 'Login Fail', success: false});
        }
    });
});

router.get('/download',function(request,response){
    console.log("Request for file received.");
    console.log(request);
    console.log(request.query.path);
    var filepath = ( __dirname + String(request.query.path));
    var filename = path.basename(filepath);
    console.log(filepath);
    response.setHeader('Content-disposition','attachment; filename='+filename);
    response.setHeader('Content-type','application/docx');
    var filestream = fs.createReadStream(filepath);
    filestream.pipe(response);
});

router.get('/imports/libraries',function(request,response){
    var basepath = './public/libraries';
    DirectoryStructureJSON.getStructure(fs, basepath, function (err, structure, total) {
        if (err) console.log(err);
        console.log('there are a total of: ', total.folders, ' folders and ', total.files, ' files');
        console.log('the structure looks like: ', JSON.stringify(structure, null, 4));
        response.send(structure);
    });
});


module.exports = router;