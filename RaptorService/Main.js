/*global require,SimpleMVC,HttpRequestDebug*/

require('./Modules/HttpRequestDebug.js');
HttpRequestDebug.Print();

require('./Modules/SimpleMVC.js');
SimpleMVC.HandleRequest();