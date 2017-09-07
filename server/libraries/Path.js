var Path = function(){
    this.params = {
        root: './',
        parents:[],
        endpointName:'Genfile'
    };
    this.type = '';
    this.root = this.params.root;
    this.parents = this.params.parents;
    this.endpointName = this.params.endpointName

};

Path.prototype = {
    setType: function(t){
        this.type = t;
    },

    setEndpoint: function(n){
        this.endpointName = n;
    },

    addParent:function(p){
        this.parents.push((p+'/'));
    },

    combine:function(){
        var path = this.root;
        for(var i=this.parents.length-1;i>=0;i--){
            path = path+this.parents[i];
        }
        path = path + this.endpointName + this.type;
        return path;
    }

};

module.exports = Path;