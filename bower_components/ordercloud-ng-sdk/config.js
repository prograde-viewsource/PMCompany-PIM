(function () {
    'use strict';
    var fs = require('fs');

    var src = './src/',
        gen = 'Generated.js',
        makeApiCall = 'MakeApiCall.js',
        dist = './dist/',
        SDK_Name = 'ordercloud-ng-sdk',
        files = GetFiles();

    module.exports = {
        packages: [
            './bower.json',
            './package.json'
        ],
        root: './',
        source: src,
        dist: dist,
        generated: gen,
        sdk_name: SDK_Name,
        func_list: GetFuncList(files),
        file_group: ConcatFiles(files),
        makeApiCall_file: fs.readFileSync(src + makeApiCall),
        wrap: {
            header: "(function() {\n'use strict';\n",
            footer: '}());\n'
        }
    };

    function GetFiles() {
        var files = [];
        var fileNames = fs.readdirSync(src);
        fileNames.splice(fileNames.indexOf(gen), 1);
        fileNames.splice(fileNames.indexOf(makeApiCall), 1);
        fileNames.forEach(function(filename) {
            files.push({name: filename.replace('.js', ''), contents: fs.readFileSync(src + filename)});
        });
        return files;
    }

    function GetFuncList(files) {
        var fileList = '';
        files.forEach(function(fileObj) {
            if (fileObj.name != 'As') {
                fileList = fileList + "'" + fileObj.name + "': " + fileObj.name + "(),\n";
            }
            else fileList = fileList + "'" + fileObj.name + "': " + fileObj.name + ",\n";
        });
        return fileList;
    }

    function ConcatFiles(files) {
        var file = null;
        files.forEach(function(fileObj) {
            if (!file) {
                file = fileObj.contents;
            }
            else {
                file = [file, fileObj.contents].join('\n')
            }
        });
        return file;
    }

}());
