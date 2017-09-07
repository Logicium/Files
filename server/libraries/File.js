var fs = require('fs');
var path = require('path');
var write = require('write');
var beautify = require('js-beautify').js_beautify;
var Path = require('./Path');

var File = function(params){

    if (typeof (params) == 'undefined'){
        params = {
            name:'Genfile',
            type:'',
            path: new Path(),
            lines:['']
        }
    }

    this.lines = [];
    this.name = params.name;

    this.type = params.type;
    this.path = params.path;
    this.path.setType(this.type);
    this.path.setEndpoint(params.name);
    this.addLines(params.lines);
};

File.prototype = {

    concatLines: function(){
        var concatLine = '';
        for(var i=0;i<this.lines.length;i++){
            concatLine += (this.lines[i]);
        }
        return concatLine;
    },

    prependLine:function(l){
        this.lines.unshift(l);
    },

    setName: function(n){
        this.name = n;
        this.path.endpointName = n;
    },

    setType: function(t){
        this.type = t;
        this.path.setType(t);
    },

    setPath: function(p){
        this.path = p;
    },

    prependParentPath:function(p){
        this.path.addParent(p);
    },

    addLines:function(lines){
        for(var i=0;i<lines.length;i++){
            this.lines.push(lines[i]);
        }
    },

    addLine: function(line){
        this.lines.push(line);
    },

    prettyFormat: function(){
        return JSON.parse(this.string);
    },

    writeToDisk: function(){
        console.log('File path: '+this.path.combine());
        write(this.path.combine(),this.concatLines(),function(err){
            if(err) {
                return console.log(err);
            }
            console.log("File written!");
        });
    }
};

module.exports = File;
