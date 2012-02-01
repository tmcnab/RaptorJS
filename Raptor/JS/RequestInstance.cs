namespace Raptor.JS
{
    using System.Net;
    using Jurassic;
    using Jurassic.Library;

    public class RequestInstance : ObjectInstance
    {
        HttpListenerRequest Request;

        public RequestInstance(ScriptEngine engine, HttpListenerRequest request) : base(engine)
        {
            this.Request = request;
        }
    }
}
