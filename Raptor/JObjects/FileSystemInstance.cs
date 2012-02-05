//---------------------------------------------------------------------------------------
// File:        JObjects/FileSystemInstance.cs
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
    using System.IO;
    using System.Web;
    using Jurassic;
    using Jurassic.Library;

    public class FileSystemInstance : ObjectInstance
    {
        public FileSystemInstance(ScriptEngine engine) : base(engine)
        {
            this.PopulateFunctions();
        }

        #region Functions

        [JSFunction(Name="exists")]
        public bool Exists(string path)
        {
            return File.Exists(HttpContext.Current.Server.MapPath(path));
        }

        [JSFunction(Name="load")]
        public string Load(string path)
        {
            return File.ReadAllText(HttpContext.Current.Server.MapPath(path));
        }

        #endregion
    }
}