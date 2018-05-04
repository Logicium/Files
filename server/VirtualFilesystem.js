var express = require('express');
var fs = require('fs-extra');
var mkdirp = require('mkdirp');
var router = express.Router();
var multer  =   require('multer');
var path = require('path');
var jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
var DirectoryStructureJSON = require('directory-structure-json');
var Databases = require('./Databases');

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'webadmin@ascensionfactory.com',
        pass: 'superSecret'
    }
});

router.post('/list',function(request,response){
    console.log(request.body);
    Databases.Users.findOne({loginToken: request.body.token},function(err, doc) {
        console.log(doc);
        Databases.Folders.find({user:doc._id},function(err,docs){
            if(err){return console.log(err)}
            response.send(docs);
        });
    });
});

router.post('/home',function(request,response){
    console.log(request.body);
    Databases.Users.findOne({loginToken: request.body.token},function(err, doc) {
        console.log(doc);
        Databases.Folders.findOne({_id:doc.homeFolder},function(err,folder){
            if(err){return console.log(err)}
            response.send(folder);
        });
    });
});

function ucfirst(str) {
    var firstLetter = str.substr(0, 1);
    return firstLetter.toUpperCase() + str.substr(1);
}

router.post('/newFolder',function (request,response) {
    Databases.Users.findOne({loginToken:request.body.token},function (err, doc) {
        if(err){return console.log(err)}

        Databases.Folders.find({user:doc._id});

        mkdirp('./server/folders'+request.body.path, function (err) {
            if (err) console.error(err);
            response.send({message: 'Folder created', type: 'success'})
        });


    });
});

router.post('/uploadFiles',function(request,response){

    Databases.Users.findOne({loginToken:request.body.token},function (err, doc) {
        if(doc){
            var storage = multer.diskStorage({
                destination: function (req, file, callback) {
                    callback(null, './server/temp');
                },
                filename: function (req, file, callback) {
                    callback(null, file.originalname);
                }
            });
            var upload = multer({ storage : storage}).array('file');

            upload(request,response,function(err) {
                if(err) {
                    return response.end(JSON.stringify({message:"Error uploading file.",type:'error',err:err}));
                }

                console.log(request.body);
                console.log(request.files);

                var dir = request.body.path;

                for(var i in request.files){

                    var fileName = request.files[i].filename;
                    console.log('File '+ fileName);

                    fs.move('./server/temp/' + fileName, './server/folders' + dir + '/' + fileName, function (err) {
                        if (err) {
                            return console.error(err);
                        }
                    });
                }
                response.end(JSON.stringify({message:"File is Uploaded",filename:request.files.filename,type:'success'}));
            });
        }
        else{
            response.send({message: 'User not Found', type: 'error'})
        }
    });
});

router.post('/signup',function(request,response){
    console.log("New user signup request.");
    var incomingUser = JSON.parse(request.body.user);
    console.log(incomingUser['email']);

    Databases.Users.count({email:incomingUser['email']},function(err,count){
        if(count>0){
            response.send({message:'Username is taken',type:'warning'});
        }
        else{
            incomingUser.verified = 'false';
            Databases.Users.insert(incomingUser,function(err,newUser){
                if(err) return console.log('err');
                Databases.Folders.insert({user:newUser._id,filesystem:[]},function(err,docs){
                    if(err) return console.log('err');
                    newUser.userFolder = docs._id;
                    newUser.save();
                    console.log(docs);
                    var mailOptions = {
                        from: '"Files3D Team" <webadmin@files3d.herokuapp.com>', // sender address
                        to: newUser['email'], // list of receivers as string
                        subject: 'Files3D Email Verification',
                        html: 'Verify your email for Files3d<br><br><pre>'+JSON.stringify(newUser,null, 2).toString()+'</pre>'
                    };
                    transporter.sendMail(mailOptions, function(error, info) {
                        if (error) return console.log(error);
                        //console.log('Message %s sent: %s', info.messageId, info.response);
                        response.send({message:'New User Added',doc:newUser,type:'success'});
                    });
                });
            });
        }
    });
});

router.post('/verifyEmail',function(request,response){

    //Find user in database with token in email


});

router.post('/login', function (request, response) {

    console.log("New user login request.");
    var incomingUser = request.body;
    console.log(incomingUser);

    var Users = Databases.Users.findOne({username:incomingUser.username,password:incomingUser.password},function(err,doc){
        console.log(doc);
        if (doc) {
            var token = jwt.sign({U:incomingUser.username}, 'superSecret', {expiresIn: '24h'});
            doc.loginToken = token;
            doc.save(function (err) {});
            response.send({message: 'Login Success!', data:doc, success: true, token: token});
        }
        else {
            response.send({message: 'Login Fail', type: 'error'});
        }
    });
});

router.post('/image',function(request,response){
    console.log(request.body);
    Databases.Users.findOne({loginToken: request.body.token},function(err, doc) {
        //var basepath = doc.userFolder;
        console.log(doc);
        if (doc) { //also check if that file is shared with user
            console.log(request.body.path);
            var img = fs.readFileSync(request.body.path);
            var img64 = new Buffer(img).toString('base64');
            //console.log('Img64: '+img64);
            response.writeHead(200, {'Content-Type': 'image/'+(request.body.extension).slice(1),'Content-Length': img64.length});
            response.end(img64);
        }
        else{
            response.send({message: 'User not Found', type: 'error'});
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
        return res.status(403).send({ success: false, message: 'No token provided.' });
    }
});

router.post('/uploadFolder',function(request,response){
    console.log(request.body);

    Databases.Users.findOne({loginToken:request.body.token},function (err, doc) {
        if(doc){
            var parentFolderPath = request.body.path;
            var storage = multer.diskStorage({
                destination: function (req, file, callback) {
                    callback(null, './server'+parentFolderPath);
                },
                filename: function (req, file, callback) {
                    callback(null, file.originalname);
                }
            });
            var upload = multer({ storage : storage}).array('files');

            upload(request,response,function(err) {
                console.log(request.files);
                if(err) {
                    return response.end(JSON.stringify({message:"Error uploading file.",type:'error'}));
                }
                response.end(JSON.stringify({message:"Folder is Uploaded",filename:request.files.filename,type:'success'}));
            });
        }
        else{
            response.send({message: 'User not Found', type: 'error'})
        }
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
