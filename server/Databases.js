var fs = require('fs');
var path = require('path');
var LinvoDB = require("linvodb3");
LinvoDB.dbPath = process.cwd();
var Databases = {};
var UsersDB = new LinvoDB('users',{});
var Folder = require('./libaries/Folder');


Databases = {
    Users: UsersDB
};

//Initialize first user for Users Database:

var adminFolder = new Folder();
adminFolder.setName('admin-'+Date.now());
adminFolder.writeAllToDisk();

var adminUser = {
    username:'admin',
    password:'superSecret',
    loginToken:'',
    userFolder: adminFolder.path.combine()
};

Databases.Users.insert(adminUser, function (err, newDoc) {
    console.log(newDoc);
    console.log('Admin user added.');
});


module.exports = Databases;