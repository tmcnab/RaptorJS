//---------------------------------------------------------------------------------------
// File:        Modules/HttpRequestDebug.js
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
/*global Console,Request*/

var HttpRequestDebug = {
    Print: function () {
        var request = "--------------------------------------\n";
        request += "Access:\t" + Request.Method + "\t" + Request.Url + "\n";
        request += "UserAgent:\t" + Request.UserAgent + "\n";
        console.log(request);
    }
};