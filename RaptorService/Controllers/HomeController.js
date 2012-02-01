/*global Console, FileSystem*/
HomeController = {
    Index: function (params) {
        return FileSystem.Load('./Views/Home/Index.jshtml');
    }
}