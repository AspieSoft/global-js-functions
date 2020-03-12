var Global = {};
if(typeof global === 'object'){
    Global = global;
}else if(typeof window === 'object'){
    Global = window;
}

Object.map = function(obj, callback){
    let result = {};
    let keys = Object.keys(obj);
    for(let i = 0; i < keys.length; i++){
        let r = callback(obj[keys[i]], keys[i], obj);
        if(r === undefined){
            result[keys[i]] = obj[keys[i]];
        }if(r !== null){
            result[keys[i]] = r;
        }
    }
    return result;
};

Object.forEach = function(obj, callback){
    let keys = Object.keys(obj);
    for(let i = 0; i < keys.length; i++){
        callback(obj[keys[i]], keys[i], obj);
    }
};

Object.forEachAsync = function(obj, callback){
    let keys = Object.keys(obj);
    for(let i = 0; i < keys.length; i++){
        setTimeout(async () => {callback(obj[keys[i]], keys[i], obj);}, 0);
    }
};

Object.forEachSyncAsync = async function(obj, callback, {timeout = 1000, checkInterval = 10}){
    let keys = Object.keys(obj);
    let finishedItems = 0;
    Object.forEachAsync(obj, async (item, key) => {
        await callback(item, key, obj);
        finishedItems++;
    });
    await waitForValue(() => finishedItems >= keys.length, timeout, checkInterval);
    return finishedItems >= keys.length;
};

Object.clone = function(obj){
    return {...obj};
};

Object.toArray = function(obj, keepKeys){
    let result = [];
    let keys = Object.keys(obj);
    if(keepKeys === 'array'){
        for(let i = 0; i < keys.length; i++){result.push([keys[i], obj[keys[i]]]);}
    }else if(keepKeys === 'string'){
        for(let i = 0; i < keys.length; i++){result.push(keys[i]+' => '+obj[keys[i]].toString());}
    }else{
        for(let i = 0; i < keys.length; i++){result.push(obj[keys[i]]);}
    }
    return result;
};

Array.forEach = function(arr, callback){
    for(let i = 0; i < arr.length; i++){
        callback(arr[i], i, arr);
    }
};

Array.forEachAsync = function(arr, callback){
    for(let i = 0; i < arr.length; i++){
        setTimeout(async () => {callback(arr[i], i, arr);}, 0);
    }
};

Array.forEachSyncAsync = async function(arr, callback, {timeout = 1000, checkInterval = 10}){
    let finishedItems = 0;
    Array.forEachAsync(arr, async (item, key) => {
        await callback(item, key, arr);
        finishedItems++;
    });
    await waitForValue(() => finishedItems >= arr.length, timeout, checkInterval);
    return finishedItems >= arr.length;
};

Array.clone = function(arr){
    return [...arr];
};

Array.toObject = function(arr){
    return {...arr};
};

function forEach(arr, callback){
    if(typeof arr === 'object'){
        return Object.forEach(arr, callback);
    }else if(Array.isArray(arr)){
        return Array.forEach(arr, callback);
    }else if(typeof arr === 'string' || typeof arr === 'number' || typeof arr === 'boolean'){
        return Array.forEach([arr], callback);
    }return undefined;
}

async function forEachAsync(arr, callback, options){
    if(typeof arr === 'object'){
        if(options && options.sync){return await Object.forEachSyncAsync(arr, callback, options);}
        return Object.forEachAsync(arr, callback);
    }else if(Array.isArray(arr)){
        if(options && options.sync){return await Array.forEachSyncAsync(arr, callback, options);}
        return Array.forEachAsync(arr, callback);
    }else if(typeof arr === 'string' || typeof arr === 'number' || typeof arr === 'boolean'){
        if(options && options.sync){return await Array.forEachSyncAsync([arr], callback, options);}
        return Array.forEachAsync([arr], callback);
    }return undefined;
}

Global.forEach = forEach;
Global.forEachAsync = forEachAsync;

Function.toFunction = function(func){
    return () => func;
};

Function.clone = function(func){
    let newFunc = new Function('return ' + func.toString())();
    for(let key in func){
        newFunc[key] = func[key];
    }
    return newFunc;
};

function toNumber(str){
    if(typeof str === 'number'){return str;}
    return Number(str.replace(/[^0-9.]/g, '').split('.', 2).join('.'));
}

function toInteger(str){
    if(typeof str === 'number'){return Math.floor(str);}
    return Number(str.replace(/[^0-9.]/g, '').split('.', 1)[0]);
}

function toTimeMillis(str){
    if(typeof str === 'number'){return Number(str);}
    if(!str || typeof str !== 'string' || str.trim() === ''){return NaN;}
    if(str.endsWith('h')){
        return toNumber(str)*3600000;
    }else if(str.endsWith('m')){
        return toNumber(str)*60000;
    }else if(str.endsWith('s')){
        return toNumber(str)*1000;
    }else if(str.endsWith('D')){
        return toNumber(str)*86400000;
    }else if(str.endsWith('M')){
        return toNumber(str)*2628000000;
    }else if(str.endsWith('Y')){
        return toNumber(str)*31536000000;
    }else if(str.endsWith('DE')){
        return toNumber(str)*315360000000;
    }else if(this.endsWith('CE') || str.endsWith('C')){
        return toNumber(str)*3153600000000;
    }else if(str.endsWith('ms')){
        return toNumber(str);
    }else if(str.endsWith('us') || this.endsWith('mic')){
        return toNumber(str)*0.001;
    }else if(str.endsWith('ns')){
        return toNumber(str)*0.000001;
    }
    return toNumber(str);
}

function sNum(number){
    if(toNumber(number) === 1){
        return '';
    }return 's';
}

Global.toNumber = toNumber;
Global.toInteger = toInteger;
Global.toTimeMillis = toTimeMillis;
Global.sNum = sNum;

RegExp.escape = function(str){
    return str.toString().replace(/([^A-Za-z0-9_])/g, '\\$1');
};

String.reverse = function(str, separator = ''){return str.split(separator).reverse().join(separator);};
String.replaceAll = function(str, search, replace){search = RegExp.escape(search); return str.replace(new RegExp('('+RegExp.escape(search)+')', 'g'), replace.toString());};
String.replaceLast = function(str, search, replace){search = RegExp.escape(search); return str.replace(new RegExp('('+search+')(?!.*'+search+')'), replace.toString());};

Math.sum = function(start, end, callback){
    let answer = 0;
    start = start.toInteger(); end = end.toInteger();
    if(start <= end){
        for(let i = start; i <= end; i++){
            answer += callback(i);
        }
    }else{
        for(let i = start; i >= end; i--){
            answer += callback(i);
        }
    }
    return answer;
};

Math.factorial = function(n){
    if(n === 0){return 1;}
    else if(n < 0){return NaN;}
    return n*Math.factorial(n - 1);
};

HTML = {
    escape: function(str){return str.toString().replace(/&(?!(amp|gt|lt|quot|apos|grave|ast|percnt|dollar|cent|euro|pound);)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;').replace(/`/g, '&grave;').replace(/\*/g, '&ast;').replace(/%/g, '&percnt;').replace(/\$/g, '&dollar;').replace(/&dollar;c/g, '&cent;').replace(/&dollar;e/g, '&euro;').replace(/&dollar;p/g, '&pound;').replace(/&lt;\[=\]/g, '&le;').replace(/&gt;\[=\]/g, '&ge;').replace(/=\[!\]/g, '&ne;').replace(/=\[?\]/g, '&asymp;').replace(/&lt;&lt;/g, '&laquo;').replace(/&gt;&gt;/g, '&raquo;').replace(/\+-/g, '&plusmn;');},
    unescape: function(str){return str.toString().replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, '\'').replace(/&grave;/g, '`').replace(/&ast;/g, '*').replace(/&percnt;/g, '%').replace(/&dollar;/g, '$').replace(/&cent;/g, '$c').replace(/&euro;/g, '$e').replace(/&pound;/g, '$p').replace(/&le;/g, '<[=]').replace(/&ge;/g, '>[=]').replace(/&ne;/g, '=[!]').replace(/&asymp;/g, '=[?]').replace(/&laquo;/g, '<<').replace(/&raquo;/g, '>>').replace(/&plusmn;/g, '+-');},
    strip_tags: function(str, keep = false, stripParams = true){if(keep && Array.isArray(keep)){keep = '|'+keep.map(k => RegExp.escape(k)).join('|');}else if(keep && keep.trim !== ''){keep = '|'+RegExp.escape(keep);}else{keep = '';}str = str.replace(new RegExp('<\/?(?![^A-Za-z0-9_\-]'+keep+').*?>', 'g'), '');if(stripParams){str = str.replace(/<((?:[A-Za-z0-9_\-])).*?>/g, '<$1>');}return str;},
    strip_params: function(str){return str.replace(/<((?:[A-Za-z0-9_\-])).*?>/g, '<$1>');},
};
Global.HTML = HTML;

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
Global.sleep = sleep;

async function waitForValue(value, timeout = 3000, checkInterval = 10){
    if(typeof value === 'function'){
        if(value()){value();}
        let loops = 0;
        while(!value()){
            await sleep(checkInterval);
            loops++;
            if(loops >= timeout / checkInterval){break;}
        }
        return value();
    }
    console.error('TypeError: waitForValue expects a function with a return value');
    return false;
}
Global.waitForValue = waitForValue;

function generateRandomToken(){
    return Math.random().toString(36).substr(2)+Math.random().toString(36).substr(2);
}
Global.generateRandomToken = generateRandomToken;
