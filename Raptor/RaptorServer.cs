//---------------------------------------------------------------------------------------
// File:        RaptorServer.cs  
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
namespace RaptorJS
{
    using System;
    using System.Linq;
    using System.Net;
    using System.Threading.Tasks;

    /// <summary>
    /// A simple web server that implements a Jurassic/Raptor HTTP service
    /// </summary>
    public class RaptorServer : IDisposable
    {
        private string mainJavascript = string.Empty;

        private HttpListener httpListener = null;
        
        /// <summary>
        /// Initializes a new instance of the RaptorServer class.
        /// </summary>
        /// <param name="listenerPrefix">The path to listen on</param>
        /// <param name="js">The raw javascript to execute when a request is processed</param>
        public RaptorServer(Uri listenerPrefix, string js)
        {
            if (!HttpListener.IsSupported)
            {
                throw new NotSupportedException();
            }

            if (listenerPrefix == null)
            {
                throw new ArgumentNullException();
            }

            if (string.IsNullOrWhiteSpace(js))
            {
                throw new ArgumentException();
            }

            this.httpListener = new HttpListener();
            this.httpListener.Prefixes.Add(listenerPrefix.AbsoluteUri);
            this.mainJavascript = js;
        }

        /// <summary>
        /// Starts the Server listening for requests.
        /// </summary>
        public void Start()
        {
            Console.WriteLine(string.Format(">> RaptorJS is now listening on [{0}] for requests", this.httpListener.Prefixes.First()));
            this.httpListener.Start();
            while (this.httpListener.IsListening)
            {
                var httpContext = this.httpListener.GetContext();
                Task.Factory.StartNew(() => this.HandleRequest(httpContext));
            }
        }

        /// <summary>
        /// Stops the Server listening for requests. Pending or currently
        /// executing requests will run to completion.
        /// </summary>
        public void Stop()
        {
            this.httpListener.Stop();
            Console.WriteLine(">> RaptorJS is has stopped listening for requests");
        }

        /// <summary>
        /// Implements the IDisposable interface
        /// </summary>
        public void Dispose()
        {
            this.httpListener.Stop();
            this.httpListener.Close();
        }

        /// <summary>
        /// Handles an incoming request and passes it off for execution with a
        /// fresh Jurassic/Raptor runtime.
        /// </summary>
        /// <param name="httpContext">
        /// The context of the request to pass off to the new Jurassic/Raptor
        /// runtime
        /// </param>
        protected void HandleRequest(HttpListenerContext httpContext)
        {
            try
            {
                ScriptEngineFactory.Construct(httpContext).Execute(this.mainJavascript);
            }
            catch (Exception e)
            {
                Console.Error.Write(e);
                httpContext.Response.Abort();
            }
        }
    }

}