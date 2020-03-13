// In God We Trust

const fs = require('fs');
const path = require('path');
const url = require('url');
require('./static/functions');

function addStaticPath(staticPath, app){
    if(!staticPath || typeof staticPath !== 'string'){
        try{
            const express = require('express');
            return express.static(path.join(__dirname, 'static'), {index: ['functions.js'], redirect: true});
        }catch(e){
            let staticFile = fs.readFileSync(path.join(__dirname, 'static/functions.js')).toString();
            if(!staticFile || staticFile.trim() === ''){return Function.toFunction(false);}
            return function(){return staticFile;};
        }
    }
    staticPath = staticPath.toString();
    staticPath = String.replaceAll(staticPath, '\\', '/');
    if(staticPath.endsWith('/')){staticPath = String.replaceLast(staticPath, '/', '');}
    if(!staticPath.startsWith('/')){staticPath = '/'+staticPath;}
    if(app){
        try{
            const express = require('express');
            app.use(staticPath, express.static(path.join(__dirname, 'static'), {index: ['functions.js'], redirect: true}));
            return true;
        }catch(e){return false;}
    }
    let staticFile = fs.readFileSync(path.join(__dirname, 'static/functions.js')).toString();
    if(!staticFile || staticFile.trim() === ''){return Function.toFunction(false);}
    return function(req, res){
        let urlPath = url.parse(req.url).pathname;
        urlPath = String.replaceAll(urlPath, '\\', '/');
        if(urlPath.endsWith('/')){urlPath = String.replaceLast(urlPath, '/', '');}
        if(!urlPath.startsWith('/')){urlPath = '/'+urlPath;}
        if(urlPath === staticPath){
            res.writeHead(200, {'Content-Type': 'text/javascript'});
            res.write(staticFile);
            return res.end();
        }
        return false;
    };
}

module.exports = addStaticPath;
