var express = require('express');
var router = express.Router();
var multer  =   require('multer');
var path = require('path');
var jwt = require('jsonwebtoken');

var Databases = require('./Databases');

router.get('/folder/list',function(request,response){

    //First, find the user in the database whose stored logintoken looks like the logintoken.

    var basepath = './server/folders/'+request.body.userFolder;

    DirectoryStructureJSON.getStructure(fs, basepath, function (err, structure, total) {
        if (err) console.log(err);
        console.log('there are a total of: ', total.folders, ' folders and ', total.files, ' files');
        console.log('the structure looks like: ', JSON.stringify(structure, null, 4));
        response.send(structure);
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
    Databases.Settings.insert(request.body, function (err, newDoc) {
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

    Databases.Settings.findOne({name:parentName},function (err, doc) {

        console.log(JSON.stringify(doc));
        doc.data = newConfig[parentIndex].data;
        console.log('Logging doc');
        doc.save(function (err) {});
        response.send({message:'Successfully Updated',doc:doc});
    });

});

router.post('/find',function(request,response){
    console.log(request.body);
    Databases.Settings.find({ id: request.body._id }, {}, function(err, doc) {
        response.send({message:"Updated successfully.",newDoc:doc})
    });
});

router.post('/delete',function(request,response){
    //Delete
});

module.exports = router;
