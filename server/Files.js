var express = require('express');
var fs = require('fs');
var router = express.Router();
var multer  =   require('multer');
var path = require('path');
var jwt = require('jsonwebtoken');
var DirectoryStructureJSON = require('directory-structure-json');

var Databases = require('./Databases');

router.post('/list',function(request,response){
    console.log(request.body);
    Databases.Users.findOne({loginToken: request.body.token},function(err, doc) {
        var basepath = doc.userFolder;
        console.log(doc);
        if (doc) {
            DirectoryStructureJSON.getStructure(fs, basepath, function (err, structure, total) {
                if (err) console.log(err);
                if(structure instanceof Array && structure.length === 0){
                    response.send({type:'folder','name': ucfirst(doc.username)+'\'s Home folder',children:[],totals:{folders:0,files:0}});
                }else{
                    console.log('there are a total of: ', total.folders, ' folders and ', total.files, ' files');
                    console.log('the structure looks like: ', JSON.stringify(structure, null, 4));
                    response.send(structure);
                }
            });
        }
        else{
            response.send({message: 'Folder not found', type: 'error'});
        }
    });

    //var basepath = './server/folders/'+request.body.userFolder;
});

function ucfirst(str) {
    var firstLetter = str.substr(0, 1);
    return firstLetter.toUpperCase() + str.substr(1);
}

router.post('/login', function (request, response) {

    console.log("New user login request.");
    var incomingUser = request.body;
    console.log(incomingUser);

    var Users = Databases.Users.findOne({username:incomingUser.username,password:incomingUser.password},function(err,doc){
        console.log(doc);
        if (doc) {
            var token = jwt.sign({U:incomingUser.username}, 'superSecret', {expiresIn: '10h'});
            doc.loginToken = token;
            doc.save(function (err) {});
            response.send({message: 'Login Success!', data:doc, success: true, token: token});
        }
        else {
            response.send({message: 'Login Fail', success: false});
        }
    });
});


router.use(function(req, res, next) {
    console.log(req.file);

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, 'superSecret', function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});

router.post('/add',function(request,response){
    console.log("Add settings request: ");
    console.log(request.body);
    Databases.Users.insert(request.body, function (err, newDoc) {
        console.log(newDoc);
        response.send({message:"New settings added",data:newDoc});
    });
});

router.post('/update',function(request,response){
    console.log(request.body);
    var parentName = request.body.parentTitle;
    console.log(parentName);
    var parentIndex = request.body.parentIndex;
    var newConfig = JSON.parse(request.body.newConfig);
    console.log(newConfig);

    Databases.Users.findOne({name:parentName},function (err, doc) {

        console.log(JSON.stringify(doc));
        doc.data = newConfig[parentIndex].data;
        console.log('Logging doc');
        doc.save(function (err) {});
        response.send({message:'Successfully Updated',doc:doc});
    });

});

router.post('/find',function(request,response){
    console.log(request.body);
    Databases.Users.find({ id: request.body._id }, {}, function(err, doc) {
        response.send({message:"Updated successfully.",newDoc:doc})
    });
});

router.post('/delete',function(request,response){
    //Delete
});

module.exports = router;
