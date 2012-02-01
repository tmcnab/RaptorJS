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
    using Jurassic;
    using Jurassic.Library;

    /// <summary>
    /// 
    /// </summary>
    public class FileSystemInstance : ObjectInstance
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="engine"></param>
        public FileSystemInstance(ScriptEngine engine) : base(engine)
        {
            this.PopulateFunctions();
        }

        #region Functions

        /// <summary>
        /// 
        /// </summary>
        /// <param name="path"></param>
        /// <returns></returns>
        [JSFunction]
        public bool Exists(string path)
        {
            return File.Exists(path);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="path"></param>
        /// <returns></returns>
        [JSFunction]
        public string Load(string path)
        {
            try
            {
                return File.ReadAllText(path);
            }
            catch
            {
                return null;
            }
        }

        #endregion
    }
}