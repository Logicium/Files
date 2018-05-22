var express = require('express');
var fs = require('fs-extra');
var mkdirp = require('mkdirp');
var router = express.Router();
var multer = require('multer');
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

function dataChange(folder,callback){
  var children = folder.children;
  var newChildren = [];
  var count = 0;
  if(children.length === 0){folder.children=newChildren;callback(folder);}
  for (var i = 0; i < children.length; i++) {
    var childId = folder.children[i]+'';
    console.log(childId);
    var id = new require('mongodb').ObjectID(childId);
    Databases.Files.findOne({_id:id},function(err,childDoc){
      if(!(childDoc == null)){
        console.log(childDoc);
        newChildren.push(childDoc);
        count++;
        console.log(count,children.length)
        if (count === children.length) {
          folder.children = newChildren;
          callback(folder);
        }
      }
    });
    Databases.Folders.findOne({_id:id},function(err,childDoc){
      if(!(childDoc == null)){
        console.log(childDoc);
        if(childDoc.children.length>0){
          dataChange(childDoc,function(completeFolder){
            newChildren.push(completeFolder);
            count++;
            console.log(count,children.length);
            if (count === children.length) {
              folder.children = newChildren;
              callback(folder);
            }
          });
        }
        else{
          newChildren.push(childDoc);
          count++;
          console.log(count,children.length);
          if (count === children.length) {
            folder.children = newChildren;
            callback(folder);
          }
        }
      }
    });
  }
}

router.post('/home',function(request,response){
    console.log(request.body);
    Databases.Users.findOne({loginToken: request.body.token},function(err, doc) {
        console.log(doc);
        var id = new require('mongodb').ObjectID(doc.homeFolder);
        Databases.Folders.findOne({_id:id},function(err,folder){
            if(err){return console.log(err)}
            dataChange(folder,function(completeFolder){response.send(completeFolder);});
        });
    });
});

function ucfirst(str) {
    var firstLetter = str.substr(0, 1);
    return firstLetter.toUpperCase() + str.substr(1);
}

router.post('/newFolder',function (request,response) {
    Databases.Users.findOne({loginToken:request.body.token},function (err, doc) {
        if(err){return console.log(err);}
        Databases.Folders.insertOne({name:request.body.name,type:'folder',children:[],user:doc._id,created:Date.now()},function(err,newFolder){
          var newId = new require('mongodb').ObjectID(newFolder.ops[0]._id);
          var parentId = new require('mongodb').ObjectID(request.body.folder);
          Databases.Folders.findOne({_id:parentId},function(err,folder){
            Databases.Folders.findAndModify({_id:parentId},[],
              {$push:{children:newId}},{},function(err,doc){if(err) return console.log(err)}
            );
            response.send({message: 'Folder created', folder:newId, type: 'success'})
          });
        });
    });
});

router.post('/uploadFiles',function(request,response){
        var storage = require('multer-gridfs-storage')({
            url: 'mongodb://admin:superSecret@ds263089.mlab.com:63089/files3d',
            file:function (request, file){
              console.log(request.body);
              var now = Date.now();
              Databases.Users.findOne({loginToken:request.body.token},function (err, doc) {
                var extArray = file.mimetype.split("/");
                var extension = extArray[extArray.length - 1];
                var newFileScheme = {name:file.originalname,type:'file',extension:extension,created:Date.now(),user:doc._id,folder:request.body.folder}
                Databases.Files.insertOne(newFileScheme,function(err,newFile){
                  var id = new require('mongodb').ObjectID(newFile.ops[0].folder);
                  var id2 = new require('mongodb').ObjectID(newFile.ops[0]._id);
                  console.log(id,id2);
                  Databases.Files.findAndModify({_id:id2},[],
                    {$set:{path:now}},{},
                    function(err,doc){if(err) return console.log(err)}
                  );
                  console.log(newFile);
                  var folder = Databases.Folders.findOne({_id:id},function(err,folder){
                    console.log(folder);
                    Databases.Folders.findAndModify({_id:id},[],
                      {$push:{children:id2}},{},function(err,doc){if(err) return console.log(err)}
                    );
                  });
                });
              });
              return now;
            }
        });
        var upload = multer({ storage : storage}).array('file');
        upload(request,response,function(err) {
            if(err) {return response.end(JSON.stringify({message:"Error uploading file.",type:'error',err:err}));}
            //console.log(request.body);
            //console.log(request.files);
            response.end(JSON.stringify({message:"File is Uploaded",filename:request.files.filename,type:'success'}));
        });
    });

router.post('/signup',function(request,response){
    console.log("New user signup request.");
    var incomingUser = JSON.parse(request.body.user);
    console.log(incomingUser['email']);

    Databases.Users.count({email:incomingUser['email']},function(err,count){
      console.log(count);
        if(count>0){
            response.send({message:'Username is taken',type:'warning'});
        }
        else{
            incomingUser.verified = 'false';
            Databases.Users.insertOne(incomingUser,function(err,newUser){
                if(err) return console.log('err');
                var newId = new require('mongodb').ObjectID(newUser.ops[0]._id);
                Databases.Folders.insertOne({name:'Home',type:'folder',created:Date.now(),user:newId,children:[]},function(err,docs){
                    if(err) return console.log('err');
                    var folderId = new require('mongodb').ObjectID(docs.ops[0]._id);
                    Databases.Users.findAndModify({_id:newId},[],
                      {$set:{homeFolder:folderId}},{},function(err,doc){if(err) return console.log(err)}
                    );
                    console.log(docs);
                    response.send({message:'New User Added',doc:newUser,type:'success'});

                    // var mailOptions = {
                    //     from: '"Files3D Team" <webadmin@files3d.herokuapp.com>', // sender address
                    //     to: newUser['email'], // list of receivers as string
                    //     subject: 'Files3D Email Verification',
                    //     html: 'Verify your email for Files3d<br><br><pre>'+JSON.stringify(newUser,null, 2).toString()+'</pre>'
                    // };
                    // transporter.sendMail(mailOptions, function(error, info) {
                    //     if (error) return console.log(error);
                    //     //console.log('Message %s sent: %s', info.messageId, info.response);
                    //
                    // });
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

    var Users = Databases.Users.findOne({$and:[{$or:[{username:incomingUser.username},{email:incomingUser.username}]},{password:incomingUser.password}]},function(err,doc){
        console.log(doc);
        if (doc) {
            var token = jwt.sign({U:incomingUser.username}, 'superSecret', {expiresIn: '24h'});
            Databases.Users.findAndModify(
              {$or:[{username:incomingUser.username},{email:incomingUser.username}]},[],
              {$set:{loginToken:token}},{},
              function(err,doc){if(err) return console.log(err)}
            );
            response.send({message: 'Login Success!', data:doc, success: true, token: token});
        }
        else {
            response.send({message: 'Login Fail', type: 'error'});
        }
    });
});


router.post('/image', function(request, response) {
  // console.log(request.body);
  Databases.Users.findOne({ loginToken: request.body.token }, function(err, doc) {
    //var basepath = doc.userFolder;
    console.log(doc);
    if (doc) { //also check if that file is shared with user
      console.log(request.body.path);
      //var img = fs.readFileSync(request.body.path);

      var mongo = require('mongodb');
      var Grid = require('gridfs-stream');

      // create or use an existing mongodb-native db instance
      var db = Databases.db;
      var gfs = Grid(db, mongo);
      var buffer = [];
      gfs.createReadStream({filename:request.body.path}).on('data', function (chunk) {
        buffer.push(chunk);
      }).on('error', function (err) {
        console.log('An error occurred!', err);
        throw err;
      }).on('end', function () {
        const fbuf = Buffer.concat(buffer);
        const base64 = fbuf.toString('base64');
        //console.log(base64);
        response.writeHead(200, {
          'Content-Type': 'image/' + (request.body.extension).slice(1),
          'Content-Length': base64.length
        });
        response.end(base64);
      });
    } else {
      response.send({
        message: 'User not Found',
        type: 'error'
      });
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

router.post('/findUser',function(request,response){
    console.log("Finding one member: "+(request.body._id || request.body.token ));
    var id='';
    if(request.body._id === undefined){id = 'skip'}
    else{id = new require('mongodb').ObjectID(request.body._id); }
    Databases.Users.findOne({$or:[{'_id':id},{'loginToken':request.body.token}]}, function (err, doc) {
        if(doc.icon === undefined){
          Databases.Users.findAndModify(
            {$or:[{'_id':id},{'loginToken':request.body.token}]},[],
            {$set:{icon:'public/images/user.png'}},{},
            function(err,doc){if(err) return console.log(err)}
          );
        };
        response.send(doc);
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
