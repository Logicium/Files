var path = require('path');
var util = require('util');

function getStructure (fs, dir, callback) {
    var results = [];
    var total = { files: 0, folders: 0 };

    fs.readdir(dir, function (err, list) {
        if (err) return callback(err);

        var itemsLeft = list.length;

        if (!itemsLeft) return callback(null, results, total);

        list.forEach(function (file) {
            file = path.resolve(dir, file);
            fs.stat(file, function (err, stat) {
                if (stat && stat.isDirectory()) {
                    getStructure(fs, file, function (err, res, tot) {
                        total.folders = total.folders + tot.folders + 1;
                        total.files = total.files + tot.files;

                        var resTotals = res.totals;
                        if(res instanceof Array == false){
                            res = res.children;
                        }
                        results.push({ name: path.basename(file), type: 'folder', totals:resTotals, children: res });

                        if(!--itemsLeft){
                            callback(null, {name: path.basename(dir), type: 'folder', totals:total, children: results}, total);
                        }
                    });
                }
                else {
                    results.push({ type: 'file',path:file,extension:path.extname(file),data:stat, name: path.basename(file) });
                    total.files++;
                    if (!--itemsLeft) callback(null, {name: path.basename(dir), type: 'folder', totals:total, children: results}, total);
                }
            });
        });
    });
}

function traverseStructure (structure, basepath, onFolderFound, onFileFound) {
    structure.forEach(function (object) {
        if (object.type === 'folder' && object.children.length > 0) {
            onFolderFound(object, basepath);
            traverseStructure(object.children, basepath ? basepath + '/' + object.name : object.name, onFolderFound, onFileFound);
        }

        if (object.type === 'file') {
            onFileFound(object, basepath);
        }
    });
}

module.exports.getStructure = getStructure;
module.exports.traverseStructure = traverseStructure;
