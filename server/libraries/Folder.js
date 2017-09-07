var fs = require('fs');
var path = require('path');
var Path = require('./Path');
var Folder = function(params){

    if (typeof (params) == 'undefined'){
        params = {
            name:'Genfolder',
            path:new Path(),
            folders:[],
            files:[]
        }
    }

    this.name = params.name;
    this.path = params.path;
    this.path.root = '';
    this.path.endpointName = this.name;
    this.folders = params.folders;
    this.files = params.files;
};

Folder.prototype = {

    setName:function(n){
        this.name = n;
        this.path.endpointName = n;
    },

    setPath: function(p){
        this.path = p;
    },

    prependParentPath:function(p){
        this.path.addParent(p);
        console.log(this.path.combine());
    },

    addFile:function(file){
        console.log('Folder path: '+this.path.combine());
        file.prependParentPath(this.path.combine());
        this.files.push(file);
    },

    addFolder: function(f){
        f.prependParentPath(this.path.combine());
        this.folders.push(f);
    },

    writeTopFiles:function(){
        for(var i =0;i<this.files.length;i++){
            this.files[i].writeToDisk();
        }
    },

    writeAllToDisk: function(){
        this.writeTopFiles();
        console.log('Folders: '+this.folders);
        for(var i =0;i<this.folders.length;i++){
            this.folders[i].writeAllToDisk();
        }
    }

};

module.exports = Folder;