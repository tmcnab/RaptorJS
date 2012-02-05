

namespace RaptorJS
{
    using Jurassic;
    using RaptorJS.JObjects;
    using System.Diagnostics;
    using System.Web;
    using System.Web.Mvc;
    using System.Web.Routing;
    using System.IO;
    using System;

    public class RaptorController : ControllerBase
    {
        public static string VirtualPath { get; set; }

        protected override void ExecuteCore()
        {
            var engine = ScriptEngineFactory.Construct(this.ControllerContext.HttpContext, VirtualPath);
            //ScriptEngine engine = new ScriptEngine();

            /*engine.SetGlobalValue("Request", new HttpRequestInstance(engine, this.ControllerContext.HttpContext));
            engine.SetGlobalValue("Response", new HttpResponseInstance(engine, this.ControllerContext.HttpContext));
            engine.SetGlobalValue("console", new ConsoleInstance(engine));

            engine.SetGlobalFunction("require", new Action<string>((path) => engine.ExecuteFile(VirtualPath + path)));
            engine.SetGlobalFunction("require", new Func<string, object>((path) => engine.Evaluate(new FileScriptSource(VirtualPath + path))));*/

            //this.ControllerContext.HttpContext.Response.Write("FUCK YOU");
            //this.ControllerContext.HttpContext.Response.StatusCode = 200;
            //engine.Execute(this.JavascriptSource);

            //Debug.WriteLine(File.ReadAllText(VirtualPath + "Main.js"));

            //Debug.WriteLine(VirtualPath + "\Views\Shared\Error.cshtml");

            engine.Execute(File.ReadAllText(VirtualPath + "Main.js"));
            

            //var resp = engine.GetGlobalValue<RaptorJS.JObjects.HttpResponseInstance>("Response");

            //this.ControllerContext.HttpContext.Response.StatusCode = resp.Response.StatusCode;
            //this.ControllerContext.HttpContext.Response.Write(resp.Content);
            
            //engine.Execute(@"console.log(Response.Content)");
            //this.ControllerContext.HttpContext.Response.Write("FUCK YOU");
            
            /*

            ScriptEngine engine = ScriptEngineFactory.Construct(this.ControllerContext.HttpContext);
            engine.Execute(this.JavascriptSource);

            

            System.Diagnostics.Debug.WriteLine(engine.GetGlobalValue<RaptorJS.JObjects.HttpResponseInstance>("Response").Response.Output.ToString());

            //this.ControllerContext.HttpContext.Response = response.Response;
            */
        }

        protected override void Execute(System.Web.Routing.RequestContext requestContext)
        {
            

            base.Execute(requestContext);
        }
    }
}
