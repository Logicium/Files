var fs = require('fs');
var mkdirp = require('mkdirp');
var LinvoDB = require("linvodb3");
LinvoDB.dbPath = process.cwd();
var Databases = {};
var UsersDB = new LinvoDB('users',{});
var FoldersDB = new LinvoDB('folders',{});
var FilesDB = new LinvoDB('files',{});
var Folder = require('./libraries/Folder');

Databases = {
    Users: UsersDB,
    Folders: FoldersDB,
    Files:FilesDB
};

//Initialize first user for Users Database

var allUsers = Databases.Users.find({},function(err,docs){
    if(docs.length==0){
        var now = Date.now();

        var homeFolder = {
          name:'Home',
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

        Databases.Users.insert(adminUser, function (err, newDoc) {

            console.log('Admin user added.');
            homeFolder.user = newDoc._id;
            Databases.Folders.insert(homeFolder,function(err,newFolder){
              newDoc.homeFolder = newFolder._id;
              console.log('Admin folder created');
              newDoc.save(function(err){});
              console.log(newDoc);
            });
        });

    }else{
        console.log('Admin user not added');
    }
});

module.exports = Databases;
