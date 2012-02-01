var Document = {
    AddHead: function (str) {
        this.head += str;
    },
    AddBody: function (str) {
        this.body += str;
    },
    ToHtml: function () {
        return "<!DOCTYPE html><html>" +
               "<head>" + this.head + "</head>" +
               "<body>" + this.body + "</body>" +
               "</html>";
    },

    head: '',
    body: ''
};