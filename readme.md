## Global JS Functions

![npm](https://img.shields.io/npm/v/global-js-functions)
![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/global-js-functions)
![GitHub top language](https://img.shields.io/github/languages/top/aspiesoft/global-js-functions)
![NPM](https://img.shields.io/npm/l/global-js-functions)

![npm](https://img.shields.io/npm/dw/global-js-functions)
![npm](https://img.shields.io/npm/dm/global-js-functions)
![GitHub last commit](https://img.shields.io/github/last-commit/aspiesoft/global-js-functions)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/aspiesoft/global-js-functions)

[![paypal](https://img.shields.io/badge/buy%20me%20a%20coffee-paypal-blue)](https://buymeacoffee.aspiesoft.com/)

This adds some extra global functions to node.js and javascript.
The same file will run both server side and client side.

### Installation

```shell script
npm install global-js-functions
```

### Setup

```js
// express

const express = require('express');
const jsFunctions = require('global-js-functions');

const app = express();

// add express static file
jsFunctions('/cdn/functions.js', app); // returns true on success


// basic http

const http = require('http');
const jsFunctions = require('./index')('/cdn/functions.js');

server = http.createServer(function(req, res){
    // send static file on /functions.js url
    if(jsFunctions(req, res)) return;

    // do other stuff
    res.statusCode = 200;
    res.write('Hello, World!');
    return res.end();
});

server.listen(3000);


// other methods

const jsFunctions = require('./index');

// when all parameters left blank
// if express module exists, this will return the express.static(); function with paths filled
// else, this will return a function which returns a reference to the javascript string
jsFunctions();

// other method express example
const jsFunctions = require('./index');

app.use('/cdn/functions.js', jsFunctions());

// other method http example
const jsFunctions = require('./index')();

if('/cdn/functions.js' === url.parse(req.url).pathname){
    res.writeHead(200, {'Content-Type': 'text/javascript'});
    res.write(jsFunctions());
    return res.end();
}
```

```html
<!-- to use the static functions.js client side -->
<script src="/cdn/functions.js"></script>
<!-- all above js examples return the same static url -->
```

### Usage

```js
forEach(obj || arr || str, function(value, index, array){
    // this function automatically runs Object.keys() on an object, and returns the object key as the index
    // an array works like normal
    // a string, number, or boolean is added as a single index of an array
});

forEachAsync(obj || arr || str, function(value, index, array){
    // same as forEach, except each callback runs async
    // if you set the option {sync: true} than you can await the loop, and it will return when all callbacks are finished
    // if {sync: true}, you can also set {timeout: 1000, checkInterval: 10}
    // timeout option says when the waiting should cancel
    // checkInterval option tells the function how often it should check to see when the loop is done
    // both options are in milliseconds
}, options);

await sleep(ms); // allows you to make an async function sleep for a number of milliseconds


// the waitForValue function can be a very useful one
async function logAsyncGrabbedValue(){
    let result = false;
    myLongProcess().then(data => {
        result = data;
    });
    
    // do some stuff during async operations
    
    // this function will wait for callback to return true
    // we are waiting until result is set by the myLongProcess async function
    await waitForValue(() => result);
    
    // now that we have the result, we can return it
    return result;
}
async function myLongProcess(){
    let result = 'test';
    await sleep(1000);
    return result;
}
// the waitForValue function is also what the forEachAsync function uses when the sync option is true


// returns milliseconds from string time
toTimeMillis('10m'); // 10 minutes
// any number passes back as if already in milliseconds
toTimeMillis(toTimeMillis(toTimeMillis('10m'))); // still 10 minutes
// you can use one of many time values
us || mic = microsecond
ns = nanosecond
ms = millisecond
s = second
m = minute
h = hour
D = Day
M = Month
Y = Year
DE = Decade
CE || C = Century


// toNumber function sets a string to a number, and removes invalid characters
toNumber('10 and letters that get removed');
// toInteger function does the same as toNumber, but also floors the decimal
toInteger('10.5 and letters and decimal removed');

// sNum function returns an 's' string if a number !== 1
sNum(1); // result = '';
sNum(2); // result = 's';
// this is helpful if you want to display a string that shows a time frame
let loops = 3;
while(loops--){
    console.log('This will loop '+loops+' more time'+sNum(loops));
}
// output:
// This will loop 3 more times
// This will loop 2 more times
// This will loop 1 more time

// notice the last "time" does not say "1 more time(s)"


// this function escapes regex by adding a "\" in front of every non alphabetic or numeric character
RegExp.escape(str);

// replaces all occurrences in a string
String.replaceAll(str, search, replace);
// replaces the last occurrence in a string
String.replaceLast(str, search, replace);

// reverses the characters in a string, or by a separator
String.reverse(str, separator);

// fixes json string to proper format
JSON.normalizeStr(`{test1: "1", test2: "test 2",}`); // output: {"test1":1,"test2":"test 2"}

// the math sum operator. Basically a for loop
// answer += callback(n);
let result = Math.sum(1, 5, (n) => 2*n);

// the math factorial operator
Math.factorial(n);


// sets html characters to htmlentities
// also does Not set &amp; to &amp;amp;
HTML.escape(str);
// unsets html characters from htmlentities
HTML.unescape(str);
// strips html tags (unless that tag is mentioned in keep parameter)
// stripParams can be set to true || false to strip params from kept html tags
// stripParams default = true
HTML.strip_tags(str, keep, stripParams);
// removes the parameters from all html tags
HTML.strip_params(str);

// Array has .map and .forEach, so why not put this on Object
Object.map(obj, callback); && Object.forEach(obj, callback);

// sets an object to an array
keepKeys = 'array' || 'string' || false;
Object.toArray(obj, keepKeys);
// keepKeys = 'array' output: [[key, value], [key, value]]
// keepKeys = 'string' output: ['key => value', 'key => value']
// keepKeys = false output: [value, value]

// returns an array as an object
Array.toObject(arr);

// returns a clone of a function
Function.clone(func);

// returns a clone of an object
Object.clone(obj);

// returns a clone of an array
Array.clone(arr);
```
