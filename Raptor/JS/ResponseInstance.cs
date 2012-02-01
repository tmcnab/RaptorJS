namespace Raptor.JS
{
    using System.Net;
    using System.IO;
    using Jurassic;
    using Jurassic.Library;

    public class ResponseInstance : ObjectInstance
    {
        HttpListenerResponse Response;

        public ResponseInstance(ScriptEngine engine, HttpListenerResponse response)
            : base(engine)
        {
            this.Response = response;
            this.PopulateFields();
            this.PopulateFunctions();
        }

        [JSProperty]
        public int StatusCode
        {
            get { return Response.StatusCode; }
            set { Response.StatusCode = value; }
        }

        [JSProperty]
        public string Content
        {
            get
            {
                using (StreamReader reader = new StreamReader(this.Response.OutputStream))
                {
                    return reader.ReadToEnd();
                }
            }
            set
            {
                using (StreamWriter writer = new StreamWriter(this.Response.OutputStream))
                {
                    writer.Write(value);
                }
            }
        }

        [JSFunction]
        public void Close()
        {
            this.Response.Close();
        }
    }
}
