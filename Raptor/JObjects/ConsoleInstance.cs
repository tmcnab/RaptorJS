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
    using System;
    using System.Diagnostics;
    using Jurassic;
    using Jurassic.Library;

    /// <summary>
    /// A simple static Jurassic object that can be used to log information to an
    /// attached Console
    /// </summary>
    public class ConsoleInstance : ObjectInstance
    {
        /// <summary>
        /// Initializes a new instance of the ConsoleInstance class.
        /// </summary>
        /// <param name="engine">
        /// The Jurassic ScripEngine instance to attach this object to
        /// </param>
        public ConsoleInstance(ScriptEngine engine) : base(engine)
        {
            this.PopulateFunctions();
        }

        /// <summary>
        /// Logs the supplied argument to Console.Error
        /// </summary>
        /// <param name="o">The info to write out to error</param>
        [JSFunction(Name="error")]
        public static void Error(object o)
        {
            Debugger.Log(1, "Error", o.ToString());
            Console.ForegroundColor = ConsoleColor.Red;
            Console.Error.WriteLine(o);
        }

        [JSFunction(Name="info")]
        public static void Info(object o)
        {
            Debugger.Log(4, "Info", o.ToString());
            Console.ForegroundColor = ConsoleColor.Blue;
            Console.WriteLine(o);
        }

        /// <summary>
        /// Logs the supplied argument to the Console
        /// </summary>
        /// <param name="o">The info to write out</param>
        [JSFunction(Name="log")]
        public static void Log(object o)
        {
            Debugger.Log(3, "Log", o.ToString());
            Console.ForegroundColor = ConsoleColor.White;
            Console.WriteLine(o);
        }

        [JSFunction(Name="warn")]
        public static void Warn(object o)
        {
            Debugger.Log(2, "Warning", o.ToString());
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine(o);
        }
    }
}