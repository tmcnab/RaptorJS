namespace Console
{
    using Raptor;
    using System;

    class Program
    {
        static void Main(string[] args)
        {
            var serverUrl = "http://raptorjs.apphb.com";
            var javascript = @"
    Console.Log('Servicing Request');
    Response.StatusCode = 200;
    Response.Content = '<h1>Hello from Raptor!</h1>';
    Response.Close();
";

            using (RaptorServer server = new RaptorServer(new Uri(serverUrl), javascript))
            {
                server.Start();
            }
        }
    }
}
