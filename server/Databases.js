var fs = require('fs');
var mkdirp = require('mkdirp');
var Databases = {};
var mongodb = require("mongodb");
var url = "mongodb+srv://admin:NkA8271o0s1MlIGJ@cluster0.fl9wu.mongodb.net/?retryWrites=true&w=majority";

Databases = {
    Users: [],
    Folders: [],
    Files:[]
};

Databases.initialize = async function(url) {
    try {
        const dbClient = await new mongodb.MongoClient(url,{ useNewUrlParser: true }).connect();
        Databases.db = dbClient.db('database');
        const users = Databases.db.collection('users');
        const folders = Databases.db.collection('folders');
        const files = Databases.db.collection('files');
        Databases.Users = users;
        Databases.Folders = folders;
        Databases.Files = files;

        const docs = await users.find({}).toArray();
        console.log(docs);
        if (docs.length == 0) {
            await createAdminAndHomeFolder(users, folders);
        } else {
            console.log('Admin user not added');
        }
    } catch(err) {
        console.log(err);
    }
    return Databases;
}

async function createAdminAndHomeFolder(users, folders) {
    const now = Date.now();

    const homeFolder = {
        name:'Home',
        type:'folder',
        user:'',
        created: now,
        children: []
    };

    const adminUser = {
        username: 'admin',
        password: 'superSecret',
        loginToken: '',
        created: now,
        homeFolder: ''
    };

    const newDoc = await users.insertOne(adminUser);
    console.log(newDoc);
    console.log('Admin user added.');

    homeFolder.user = newDoc.insertedId;
    const newFolder = await folders.insertOne(homeFolder);

    const result = await users.findOneAndUpdate(
        {_id: newDoc.insertedId},
        {$set: {homeFolder: newFolder.insertedId}}
    );
    console.log('Admin folder created');
    if (result instanceof Error) {
        console.log(result);
    }
}

module.exports = Databases.initialize(url);