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

            case 0:
                {
                    // execute default controller and default action 'index'
                    if (this.controllerExists(this.DefaultController)) {
                        var controllerObj = require(this.ControllerPath + this.DefaultController + "Controller.js");
                        if ('Index' in controllerObj) {
                            Response.Content = controllerObj.Index();
                            Response.StatusCode = 200;
                        }
                        else {
                            this.statusCodeResult(404);
                        }
                    }
                    else {
                        this.statusCodeResult(500);
                    }
                    break;
                }

            case 1:
                {
                    // execute named controller, default action 'index'
                    if (this.controllerExists(components[0])) {
                        var controllerObj = require(this.ControllerPath + components[0] + "Controller.js");
                        if ('Index' in controllerObj) {
                            Response.Content = controllerObj.Index();
                            Response.StatusCode = 200;
                        }
                        else {
                            this.statusCodeResult(404);
                        }
                    }
                    else {
                        this.statusCodeResult(404);
                    }
                    break;
                }

            case 2:
                {
                    // must be controller/action without paramters
                    if (this.controllerExists(components[0])) {
                        var controllerObj = require(this.ControllerPath + components[0] + "Controller.js");
                        if (components[1] in controllerObj) {
                            Response.Content = controllerObj[components[1]]();
                            Response.StatusCode = 200;
                        }
                        else {
                            this.statusCodeResult(404);
                        }
                    }
                    else {
                        this.statusCodeResult(404);
                    }
                    break;
                }

            case 3: // must be controller/action/param
                {
                    // must be controller/action without paramters
                    if (this.controllerExists(components[0])) {
                        var controllerObj = require(this.ControllerPath + components[0] + "Controller.js");
                        if (components[1] in controllerObj) {
                            var params = Request.Url.substr(1, Request.Url.length - 1).split('/').slice(-1);
                            Response.Content = controllerObj[components[1]](params);
                            Response.StatusCode = 200;
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
                    break;
                }

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

    controllerExists: function (controllerName) {
        return FileSystem.Exists(this.ControllerPath + controllerName + "Controller.js");
    },

    statusCodeResult: function (statusCode) {
        Response.StatusCode = statusCode;
        Response.Content = FileSystem.Load(this.ViewPath + 'Shared/Status/' + statusCode + '.html');
    },

    ControllerPath: './Controllers/',
    ViewPath: './Views/',
    DefaultController: 'Home'
};