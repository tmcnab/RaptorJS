//---------------------------------------------------------------------------------------
// File:        JObjects/RequestInstance.cs
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
    using System.Net;
    using Jurassic;
    using Jurassic.Library;
    using System.Web;

    public class HttpRequestInstance : ObjectInstance
    {
        private HttpRequestBase Request;
        
        public HttpRequestInstance(ScriptEngine engine, HttpContextBase context) : base(engine)
        {
            this.Request = context.Request;
            this.PopulateFields();
            this.PopulateFunctions();
        }

        #region Properties

        [JSProperty]
        public ArrayInstance Accept
        {
            get { return this.Engine.Array.Construct(this.Request.AcceptTypes); }
        }

        [JSProperty]
        public string ContentType
        {
            get { return this.Request.ContentType; }
        }

        [JSProperty]
        public string Method
        {
            get { return this.Request.HttpMethod; }
        }

        [JSProperty]
        public string Url
        {
            get { return this.Request.Path; }
        }

        [JSProperty]
        public string UserAgent
        {
            get { return this.Request.UserAgent; }
        }

        #endregion
    }

    
    public class RequestInstance : ObjectInstance
    {

        private HttpListenerRequest Request;
        


        /// <summary>
        /// 
        /// </summary>
        /// <param name="engine"></param>
        /// <param name="request"></param>
        public RequestInstance(ScriptEngine engine, HttpListenerRequest request) : base(engine)
        {
            this.Request = request;
            this.PopulateFields();
            this.PopulateFunctions();
        }


        #region Properties

        [JSProperty]
        public ArrayInstance Accept {
            get { return this.Engine.Array.Construct(this.Request.AcceptTypes); }
        }

        [JSProperty]
        public string ContentType {
            get { return this.Request.ContentType; }
        }

        [JSProperty]
        public bool KeepAlive {
            get { return this.Request.KeepAlive; }
        }

        [JSProperty]
        public string Method {
            get { return this.Request.HttpMethod; }
        }

        [JSProperty]
        public string Url
        {
            get { return this.Request.Url.LocalPath; }
        }

        [JSProperty]
        public string UserAgent {
            get { return this.Request.UserAgent; }
        }

        #endregion
    }
}