using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Jurassic;
using Jurassic.Library;

namespace Raptor.JS
{
    using System.Net;

    internal static class Factory
    {
        internal static ScriptEngine Construct(HttpListenerContext context)
        {
            ScriptEngine engine = new ScriptEngine();

            engine.SetGlobalValue("Request", new RequestInstance(engine, context.Request));
            engine.SetGlobalValue("Response", new ResponseInstance(engine, context.Response));
            engine.SetGlobalValue("Console", new ConsoleInstance(engine));

            return engine;
        }
    }
}
