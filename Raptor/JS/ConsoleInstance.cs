namespace Raptor.JS
{
    using System;
    using Jurassic;
    using Jurassic.Library;

    public class ConsoleInstance : ObjectInstance
    {
        public ConsoleInstance(ScriptEngine engine) : base(engine)
        {
            this.PopulateFunctions();
        }

        [JSFunction]
        public static void Log(object o)
        {
            Console.WriteLine(o);
        }

    }
}
