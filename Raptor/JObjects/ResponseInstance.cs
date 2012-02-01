//---------------------------------------------------------------------------------------
// File:        JObjects/ConsoleInstance.cs
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
namespace RaptorJS.JObjects
{
    using System.IO;
    using System.Net;
    using Jurassic;
    using Jurassic.Library;

    public class ResponseInstance : ObjectInstance
    {
        private HttpListenerResponse Response;

        public ResponseInstance(ScriptEngine engine, HttpListenerResponse response) : base(engine)
        {
            this.Response = response;
            this.PopulateFields();
            this.PopulateFunctions();
        }

        #region Functions

        [JSFunction]
        public void Abort()
        {
            this.Response.Abort();
        }

        [JSFunction]
        public void Close()
        {
            this.Response.Close();
        }

        [JSFunction]
        public void Redirect(string url)
        {
            this.Response.Redirect(url);
        }

        #endregion

        #region Properties

        [JSProperty]
        public string Content
        {
            get {
                using (StreamReader reader = new StreamReader(this.Response.OutputStream))
                    return reader.ReadToEnd();
            }
            set {
                using (StreamWriter writer = new StreamWriter(this.Response.OutputStream))
                    writer.Write(value);
            }
        }

        [JSProperty]
        public string RedirectLocation
        {
            get { return this.Response.RedirectLocation; }
            set { this.Response.RedirectLocation = value; }
        }

        [JSProperty]
        public int StatusCode
        {
            get { return Response.StatusCode; }
            set { Response.StatusCode = value; }
        }

        [JSProperty]
        public string StatusDescription
        {
            get { return this.Response.StatusDescription; }
            set { this.Response.StatusDescription = value; }
        }

        #endregion
    }
}
