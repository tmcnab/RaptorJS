namespace Raptor
{
    using System;
    using System.Net;
    using System.Threading.Tasks;
    using Raptor.JS;

    public class RaptorServer : IDisposable
    {
        protected string JavaScriptSource = string.Empty;
        protected HttpListener _HttpListener;
        
        public RaptorServer(Uri listenerPrefix, string js)
        {
            if (!HttpListener.IsSupported) {
                throw new NotSupportedException();
            }

            if (listenerPrefix == null) {
                throw new ArgumentNullException();
            }

            if (string.IsNullOrWhiteSpace(js))
            {
                throw new ArgumentException();
            }

            this._HttpListener = new HttpListener();
            this._HttpListener.Prefixes.Add(listenerPrefix.AbsoluteUri);
            this.JavaScriptSource = js;
        }

        public void Start()
        {
            this._HttpListener.Start();
            while (true)
            {
                var httpContext = this._HttpListener.GetContext();
                //HandleRequest(httpContext);
                Task.Factory.StartNew(() => this.HandleRequest(httpContext));
            }
        }

        public void HandleRequest(HttpListenerContext httpContext)
        {
            var engine = Factory.Construct(httpContext);
            engine.Execute(this.JavaScriptSource);
        }

        public void Stop()
        {
            this._HttpListener.Stop();
        }

        ~RaptorServer()
        {
            this.Dispose();
        }

        public void Dispose()
        {
            this._HttpListener.Stop();
            this._HttpListener.Close();
        }
    }
}
