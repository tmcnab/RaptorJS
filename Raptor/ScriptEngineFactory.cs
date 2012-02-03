//---------------------------------------------------------------------------------------
// File:        ScriptEngineFactory.cs  
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
    using System.Net;
    using Jurassic;
    using RaptorJS.JObjects;

    /// <summary>
    /// Creates and configures a Jurassic ScriptEngine for use as a HTTP request processor
    /// </summary>
    internal static class ScriptEngineFactory
    {
        /// <summary>
        /// Creates and configures a Jurassic ScriptEngine
        /// </summary>
        /// <param name="context">The request/response context to process</param>
        /// <returns>A RaptorJS-configured Jurassic ScriptEngine instance</returns>
        internal static ScriptEngine Construct(HttpListenerContext context)
        {
            ScriptEngine engine = new ScriptEngine();

            engine.SetGlobalValue("Request", new RequestInstance(engine, context.Request));
            engine.SetGlobalValue("Response", new ResponseInstance(engine, context.Response));
            engine.SetGlobalValue("console", new ConsoleInstance(engine));
            engine.SetGlobalValue("FileSystem", new FileSystemInstance(engine));

            engine.SetGlobalFunction("require", new Action<string>((path) => engine.ExecuteFile(path)));
            engine.SetGlobalFunction("require", new Func<string, object>((path) => engine.Evaluate(new FileScriptSource(path))));

            return engine;
        }
    }
}
