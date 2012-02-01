using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using RaptorJS;
using System.IO;

namespace RaptorService
{
    public partial class RaptorService : ServiceBase
    {
        public RaptorServer Server { get; private set; }

        public RaptorService()
        {
            InitializeComponent();
            var serverUrl = "http://localhost:54320";
            var javascriptMain = File.ReadAllText("./Main.js");
            Server = new RaptorServer(new Uri(serverUrl), javascriptMain);
        }

        protected override void OnStart(string[] args)
        {
            this.Server.Start();
        }

        protected override void OnStop()
        {
            this.Server.Stop();
        }

        protected override void OnShutdown()
        {
            this.Server.Dispose();
            base.OnShutdown();
        }
    }
}
