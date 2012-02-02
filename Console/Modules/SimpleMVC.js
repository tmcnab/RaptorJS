//---------------------------------------------------------------------------------------
// File:        Modules/SimpleMVC.js
// Repo:        http://github.com/SeditiousTech/RaptorJS
// Date:        01/02/12
// Author:      Tristan McNab
// Licence:     CC BY-NS-SA (https://creativecommons.org/licenses/by-nc-sa/3.0/)
// Copyright:   Seditious Technologies 2011-2012
//---------------------------------------------------------------------------------------
// This software is licensed "as-is." You bear the risk of using it. The contributors 
// give no express warranties, guarantees or conditions. You may have additional consumer
// rights under your local laws which this license cannot change. To the extent permitted 
// under your local laws, the contributors exclude the implied warranties of 
// merchantability, fitness for a particular purpose and non-infringement.
//---------------------------------------------------------------------------------------
/*global Request,Response,Console,require,Document,FileSystem*/

//require('./Modules/Razor.js');

var SimpleMVC = {

    HandleRequest: function () {

        // Split the incoming URL into discrete components
        var components = Request.Url.substr(1, Request.Url.length - 1).split('/');
        var argsLength = components.length;
        if (components.length === 1 && components[0] === '') {
            argsLength = 0;
        }


        // Handle the request according to the number of path args provided
        switch (argsLength) {

            case 0: this.executeAction(this.DefaultControllerName, 'Index', null);
                break;

            case 1: this.executeAction(components[0], 'Index', null);
                break;

            case 2: this.executeAction(components[0], components[1], null);
                break;

            case 3: this.executeAction(components[0], components[1], Request.Url.substr(1, Request.Url.length - 1).split('/').slice(-1));
                break;

            default:
                if (FileSystem.Exists('.' + Request.Url)) {
                    Response.Content = FileSystem.Load('.' + Request.Url);
                    Response.StatusCode = 200;
                }
                else {
                    this.statusCodeResult(404);
                }
                break;
        }

        Response.Close();
    },

    executeAction: function (controllerName, actionName, paramters) {

        if (this.controllerExists(controllerName)) {
            var controllerObject = require(this.ControllerPath + controllerName + "Controller.js");

            if (this.actionExists(controllerObject, actionName)) {
                var params = Request.Url.substr(1, Request.Url.length - 1).split('/').slice(-1);

                var actionResult = controllerObject[actionName](params);

                if (actionResult instanceof View) {
                    try {
                        Response.Content = actionResult.Render(controllerName, actionName);
                        Response.StatusCode = 200;
                    } catch (e) {
                        Console.Error('>> ' + e);
                        this.statusCodeResult(500);
                    }
                }
                else {
                    this.statusCodeResult(500);
                }
            }
            else {
                this.statusCodeResult(404);
            }
        }
        else if (FileSystem.Exists('.' + Request.Url)) {
            Response.Content = FileSystem.Load('.' + Request.Url);
            Response.StatusCode = 200;
        }
        else {
            this.statusCodeResult(404);
        }
    },

    controllerExists: function (controllerName) {
        return FileSystem.Exists(this.ControllerPath + controllerName + "Controller.js");
    },

    actionExists: function (controllerObject, actionName) {
        return actionName in controllerObject;
    },

    statusCodeResult: function (statusCode) {
        Response.StatusCode = statusCode;
        Response.Content = FileSystem.Load(this.ViewPath + 'Shared/Status/' + statusCode + '.html');
    },

    ControllerPath: './Controllers/',
    ViewPath: './Views/',
    ViewPathShared: './Views/Shared/',
    DefaultControllerName: 'Home'
};

//---------------------------------------------------------------------------//

function View(a, b) {
    
    this._Model = null;
    this._ViewPage = null;

    if (a !== undefined) {
        if (typeof (a) === 'string') {
            this._ViewPage = a;
        }
        else if (typeof (a) === 'object') {
            this._Model = a;
        }
        else {
            throw 'Parameter must be View or Model';
        }
    }

    if (b !== undefined) {
        if (typeof (b) === 'string') {
            this._ViewPage = b;
        }
        else if (typeof (b) === 'object') {
            this._Model = b;
        }
        else {
            throw 'Parameter must be View or Model';
        }
    }
}

View.prototype.Render = function (controllerName, actionName) {

    //
    if (this._ViewPage === null) {
        this._ViewPage = actionName;
    }

    var viewFilePath = SimpleMVC.ViewPath + controllerName + '/' + this._ViewPage + '.jshtml';
    var sharedFilePath = SimpleMVC.ViewPathShared + actionName + '.jshtml';

    var html = '';

    if (FileSystem.Exists(viewFilePath)) {
        html = FileSystem.Load(viewFilePath);
    }
    else if (FileSystem.Exists(sharedFilePath)) {
        html = FileSystem.Load(sharedFilePath);
    }
    else {
        throw "View '" + this._ViewPage + "' not found in controller viewpath or shared viewpath";
    }

    if (this._Model !== null) {
        //html = Razor.parse(html, this._Model);
        html = html.replace('@model', this.Model);
    }

    return html;
};