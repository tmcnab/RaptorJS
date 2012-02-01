/*global Console,Request*/
var HttpRequestDebug = {
    Print: function () {
        var request = "--------------------------------------\n";
        request += "Access:\t" + Request.Method + "\t" + Request.Url + "\n";
        request += "UserAgent:\t" + Request.UserAgent + "\n";
        Console.Log(request);
    }
};