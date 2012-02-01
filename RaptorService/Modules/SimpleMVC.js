/*global Request,Response,Console,require,Document,FileSystem*/

var SimpleMVC = {

    HandleRequest: function () {
        // Split the incoming URL into discrete components
        var components = Request.Url.substr(1, Request.Url.length - 1).split('/');

        // Handle the request according to the number of path args provided
        switch (components.length) {
            case 0: // execute default controller and default action 'index'
                break;

            case 1:         // execute named controller, default action 'index'
                if (this.controllerExists(components[0])) {
                    var controllerObj = require('./Controllers/' + components[0] + "Controller.js");
                    if ('Index' in controllerObj) {
                        Response.Content = controllerObj.Index();
                        Response.StatusCode = 200;
                    }
                    else {
                        Response.StatusCode = 404;
                    }
                }
                else {
                    Response.StatusCode = 404;
                }
                break;

            case 2: // must be controller/action without paramters
                // (fall through for now)

            case 3: // must be controller/action/param
                // (fall through for now)

            default:
                if (FileSystem.Exists('.' + Request.Url)) {
                    Response.Content = FileSystem.Load('.' + Request.Url);
                    Response.StatusCode = 200;
                }
                else {
                    Response.Content = this.htmlForStatusCode(404);
                    Response.StatusCode = 404;
                }
                break;
        }

        Response.Close();
    },

    controllerExists: function (controllerName) {
        return FileSystem.Exists('./Controllers/' + controllerName + "Controller.js");
    },

    htmlForStatusCode: function(statusCode) {
        return FileSystem.Load('./Views/Shared/Status/' + statusCode + '.html');
    },

    ControllerPath: './Controllers',
    ViewPath: './Views',
    DefaultController: 'Home'
};