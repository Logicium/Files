var fs = require('fs');
var mkdirp = require('mkdirp');
var Databases = {};
var mongodb = require("mongodb");

Databases = {
    Users: [],
    Folders: [],
    Files:[]
};

Databases.initialize = function(){
    mongodb.MongoClient.connect('mongodb://admin:superSecret@ds263089.mlab.com:63089/files3d', function (err, database) {
      if (err) {
        console.log(err);
        process.exit(1);
      }
        Databases.db = database;
        Databases.Users = database.collection('users');
        Databases.Folders = database.collection('folders');
        Databases.Files = database.collection('files');

        Databases.Users.find({}).toArray(function(err,docs){
            if(docs.length==0){
                var now = Date.now();

                var homeFolder = {
                  name:'Home',
                  type:'folder',
                  user:'',
                  created:now,
                  children:[]
                };

                var adminUser = {
                    username:'admin',
                    password:'superSecret',
                    loginToken:'',
                    created: now,
                    homeFolder: ''
                };

                Databases.Users.insertOne(adminUser, function (err, newDoc) {
                    console.log(newDoc);
                    console.log('Admin user added.');
                    homeFolder.user = newDoc.ops[0]._id;
                    Databases.Folders.insertOne(homeFolder,function(err,newFolder){
                      Databases.Users.findAndModify(
                        {_id:newDoc.ops[0]._id},[],
                        {$set:{homeFolder:newFolder.ops[0]._id}},{},
                        function(err,doc){if(err) return console.log(err)}
                      );
                      console.log('Admin folder created');
                    });
                });
            }else{
                console.log('Admin user not added');
            }
        });
    });
    return Databases;
}

module.exports = Databases.initialize();
