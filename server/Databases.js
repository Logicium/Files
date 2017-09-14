var fs = require('fs');
var mkdirp = require('mkdirp');
var LinvoDB = require("linvodb3");
LinvoDB.dbPath = process.cwd();
var Databases = {};
var UsersDB = new LinvoDB('users',{});
var Folder = require('./libraries/Folder');

Databases = {
    Users: UsersDB
};

//Initialize first user for Users Database:


var now = Date.now();
var adminFolder = './server/folders/'+'admin-'+now;
var adminUser = {
    username:'admin',
    password:'superSecret',
    loginToken:'',
    created: now,
    userFolder: adminFolder
};

mkdirp(adminFolder, function (err) {
    if (err) console.error(err);
    else{
        console.log('Admin folder created');
        Databases.Users.insert(adminUser, function (err, newDoc) {
            console.log(newDoc);
            console.log('Admin user added.');
        });
    }
});

module.exports = Databases;