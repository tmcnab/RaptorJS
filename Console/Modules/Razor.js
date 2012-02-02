// Pulled from http://www.fidelitydesign.net/?p=375
// Original Copyright Matthew Abbott
//
// This version has been modified to rename 'jazor' to 'Razor'
// and removing jQuery-related code

var Razor = (function ($) {

    // Represents a block of literal text.
    var literalBlock = function (content) {
        this.content = content;
    };
    literalBlock.prototype = {
        toString: function () { return "Literal"; },

        // Render the block.
        render: function (arrName) {
            var c = this.content
				.replace('\\', '\\\\', 'g')
				.replace('\"', '\\\"', 'g')
				.replace('\'', '\\\'', 'g')
				.replace('\n', '\\n', 'g');

            return (arrName + ".push(\"" + c + "\");");
        }
    };

    // Represents an expression.
    var expressionBlock = function (content) {
        this.content = content;
    };
    expressionBlock.prototype = {
        toString: function () { return "Expression"; },

        // Render the block.
        render: function (arrName) {
            return (arrName + ".push(" + this.content + ");");
        }
    };

    // Represents a code block.
    var codeBlock = function (content) {
        this.content = content;
    };
    codeBlock.prototype = {
        toString: function () { return "Code"; },

        // Render the block.
        render: function (arrName) {
            return this.content;
        }
    };

    // Defines the coordinating parser that manages the code and markup parsers.
    var parser = function (codeParser, markupParser) {
        this.codeParser = codeParser; codeParser.parser = this;
        this.markupParser = markupParser; markupParser.parser = this;

        // Our output array of template blocks
        this.blocks = [];

        // Our array of helper blocks
        this.helpers = [];
    };
    parser.prototype = {
        // Parses the next code block in the stream.
        parseCodeBlock: function (stream) {
            this.codeParser.parseBlock(stream);
        },

        // Parses the next markup block in the stream.
        parseMarkupBlock: function (stream) {
            this.markupParser.parseBlock(stream);
        },

        // Parses a template.
        parse: function (stream) {
            // Start at the markup parser, begin parsing the document (template).
            this.markupParser.parseDocument(stream);

            return { blocks: this.blocks, helpers: this.helpers };
        },

        // Pushes a finalised block (part of template) into the result.
        pushBlock: function (blockType, content) {
            var block = null;
            switch (blockType) {
                case "literal":
                    {
                        block = new literalBlock(content);
                        break;
                    }
                case "expression":
                    {
                        block = new expressionBlock(content);
                        break;
                    }
                case "code":
                    {
                        block = new codeBlock(content);
                        break;
                    }
            }

            if (block == null) throw "Unexpected block type: " + blockType;
            this.blocks.push(block);
        }
    };

    // Defines a markup parser for parsing xml-style markup.
    var markupParser = function () { };
    markupParser.prototype = {
        // Determines if the specified character is a valid for an email address.
        isValidEmailChar: function (chr) {
            var code = chr.charCodeAt(0);
            if (code >= 48 && code <= 57) return true;
            if (code >= 65 && code <= 90) return true;
            if (code >= 97 && code <= 122) return true;
            return false;
        },

        // Determines if the specified index represents a valid transition.
        isValidTransition: function (stream, index) {
            if (index == 0) return true;
            if (index == (stream.length - 1)) return false;

            if (this.isValidEmailChar(stream[index - 1])
				&& this.isValidEmailChar(stream[index + 1])) return false;

            if (stream[index - 1] == "@"
				|| stream[index + 1] == "@") return false;

            return true;
        },

        // Scans forward for the next transition.
        nextTransition: function (stream) {
            for (var i = 0; i < stream.length; i++) {
                if (stream[i] == "@" && this.isValidTransition(stream, i))
                    return i;
            }

            return -1;
        },

        // Parses markup.
        parseBlock: function (stream) {
            if (stream == null || stream.length == 0) return;

            var next = this.nextTransition(stream);
            if (next == -1) {
                this.parser.pushBlock("literal", stream.join(""));
                return;
            }

            var markup = stream.slice(0, next).join("");
            this.parser.pushBlock("literal", markup);
            this.parser.parseCodeBlock(stream.slice(next));
        },

        // Parses a document (template).
        parseDocument: function (doc) {
            var stream = doc.split("");
            this.parseBlock(stream);
        }
    };

    // Defines a code parser for parsing javascript-style code.
    var codeParser = function () {
        this.keywords = ["if", "for", "with", "while", "helper"];
    };
    codeParser.prototype = {
        // Accepts all content up to the end of a set of braces.
        acceptBrace: function (stream, brace) {
            if (stream == null || stream.length == 0) return null;
            var output = [], qchr = 0, sbrace = brace.charCodeAt(0), ebrace = 0;

            if (sbrace == 40) ebrace = 41;
            if (sbrace == 91) ebrace = 93;
            if (stream[0] != brace) return null;

            var scopes = 0;
            for (var i = 0; i < stream.length; i++) {
                var cur = stream[i];
                var cde = cur.charCodeAt(0);

                if (cde == sbrace) {
                    if (qchr == 0) {
                        scopes++;
                    }
                    output.push(cur);
                } else if (cde == ebrace) {
                    if (qchr == 0) {
                        scopes--;
                    }
                    output.push(cur);
                    if (scopes == 0) break;
                } else {
                    if (qchr == cde) {
                        qchr = 0;
                    } else if (cde == 34 || cde == 39) {
                        qchr = cde;
                    }
                    output.push(cur);
                }
            }

            return output.join("");
        },

        // Accepts all content up to the end of an identifier.
        acceptIdentifier: function (stream) {
            if (stream == null || stream.length == 0) return null;
            var output = [];

            var last, lastcde;
            for (var i = 0; i < stream.length; i++) {
                var cur = stream[i];
                var cde = cur.charCodeAt(0);
                if (i == 0) {
                    if (cde == 36 || cde == 95 || (cde >= 65 && cde <= 90) || (cde >= 97 && cde <= 122)) { // $_A-Za-z
                        output.push(cur);
                    } else {
                        return null;
                    }
                } else {
                    if (cde == 36 || cde == 95 || (cde >= 65 && cde <= 90) || (cde >= 97 && cde <= 122) || (cde >= 48 && cde <= 57)) { // $_A-Za-z0-9
                        output.push(cur);
                    } else {
                        break;
                    }
                }
            }

            return output.join("");
        },

        // Scans forward to the end of a block.
        endBlock: function (stream, startChar, endChar) {
            var scope = 0, cur;
            var quoteChar = null;
            for (var i = 0; i < stream.length; i++) {
                cur = stream[i];
                if (cur == "\"" || cur == "\'") {
                    if (quoteChar == null) quoteChar = cur;
                    else if (quoteChar == cur) quoteChar = null;
                }

                if (cur === startChar && quoteChar == null) scope++;
                if (cur === endChar && quoteChar == null) {
                    scope--;
                    if (scope == 0) return i;
                }
            }

            return -1;
        },

        // Scans forward to the end of a code block.
        endCodeBlock: function (stream) {
            return this.endBlock(stream, "{", "}");
        },

        // Scans forward to the end of an explicit block.
        endExplicitBlock: function (stream) {
            return this.endBlock(stream, "(", ")");
        },

        // Determines if the specified identifier is a keyword.
        isKeyword: function (identifier) {
            for (var i = 0; i < this.keywords.length; i++) {
                if (identifier == this.keywords[i]) return true;
            }

            return false;
        },

        // Scans forward to the next instance of the character to find.
        nextChar: function (stream, findChar) {
            for (var i = 0; i < stream.length; i++) {
                if (stream[i] == findChar) return i;
            }

            return -1;
        },

        // Parses code.
        parseBlock: function (stream) {
            if (stream == null || stream.length == 0) return;

            // Make sure we are starting with code.
            if (stream[0] != "@") {
                this.parser.parseMarkupBlock(stream);
                return;
            }

            var next = stream[1];
            if (next == ":") {
                // Parse a line, e.g. @: <div></div>
                this.parseLine(stream);
                return;
            }

            if (next == "(") {
                // Parse an explicit expression, e.g. @(model.name)
                this.parseExplicitExpression(stream);
                return;
            }

            if (next == "{") {
                // Parse a code block, e.g. @{ var age = 27; }
                this.parseCodeBlock(stream);
                return;
            }

            this.parseExpressionBlock(stream);
        },

        // Parses a code block.
        parseCodeBlock: function (stream) {
            if (stream == null || stream.length == -1) return;

            var end = this.endCodeBlock(stream);
            if (end == -1) throw "Unterminated code block.";

            var code = stream.slice(2, end).join("");
            this.parser.pushBlock("code", code);
            this.parser.parseMarkupBlock(stream.slice(end + 1));
        },

        // Parses an expression.
        parseExpression: function (stream) {
            var block = stream.slice(1);
            var expression = this.readExpression(block);
            if (expression == null) {
                this.parser.parseMarkupBlock(block);
            } else {
                if (expression == "helper") {
                    this.parseHelper(stream);
                } else {
                    this.parser.pushBlock("expression", expression);
                    this.parser.parseMarkupBlock(stream.slice(expression.length + 1));
                }
            }
        },

        // Parses an expression block or language construct.
        parseExpressionBlock: function (stream) {
            if (stream == null || stream.length == -1) return;

            var nextBrace = this.nextChar(stream, "("),
				nextScope = this.nextChar(stream, "{");

            var next = (nextBrace < nextScope) ? nextBrace : nextScope;
            if (next > -1) {
                var identifier = this.trim(stream.slice(1, next).join(""));

                if (this.isKeyword(identifier)) {
                    this.parseKeyword(identifier, stream);
                    return;
                }
            }
            this.parseExpression(stream);
        },

        // Parses an explicit expression.
        parseExplicitExpression: function (stream) {
            if (stream == null || stream.length == -1) return;

            var end = this.endExplicitBlock(stream);
            if (end == -1) throw "Untermined explicit expression.";

            var expr = stream.slice(2, end).join("");
            this.parser.pushBlock("expression", expr);
            this.parser.parseMarkupBlock(stream.slice(end + 1));
        },

        // Parses a helper function.
        parseHelper: function (stream) {
            if (stream == null || stream.length == -1) return;

            var end = this.endCodeBlock(stream);
            if (end == -1) throw "Unterminated helper block.";

            var start = this.nextChar(stream, "{");
            var name = stream.slice(7, start + 1),
				len = this.parser.blocks.length;
            this.parser.pushBlock("code", "function" + name.join(""));

            var innerBlock = stream.slice(start + 1, end);
            this.parser.parseMarkupBlock(innerBlock);
            this.parser.pushBlock("code", "}");
            var len2 = this.parser.blocks.length;

            var helper = this.parser.blocks.slice(len, len2);
            this.parser.helpers.push(helper);
            this.parser.blocks = this.parser.blocks.slice(0, len);

            this.parser.parseMarkupBlock(stream.slice(end + 1));
        },

        // Parses an conditional block
        parseIfBlock: function (stream) {
            if (stream == null || stream.length == -1) return;

            var end = this.endCodeBlock(stream);
            if (end == -1) throw "Unterminated code block.";

            var start = this.nextChar(stream, "{");

            var statement = stream.slice(1, start + 1).join("");
            this.parser.pushBlock("code", statement);

            var innerBlock = stream.slice(start + 1, end);
            this.parser.parseMarkupBlock(innerBlock);

            this.parser.pushBlock("code", "}");
            this.parser.parseMarkupBlock(stream.slice(end + 1));
        },

        // Parses a keyword and code block.
        parseKeyword: function (keyword, stream) {
            if (stream == null || stream.length == -1) return;

            switch (keyword) {
                case "if":
                    {
                        this.parseIfBlock(stream);
                        break;
                    }
                case "for":
                case "with":
                case "while":
                    {
                        this.parseSimpleBlock(stream);
                        break;
                    }
                default:
                    {
                        this.parseMarkupBlock(stream.slice(1));
                        break;
                    }
            }
        },

        // Parses a line.
        parseLine: function (stream) {
            if (stream == null || stream.length == -1) return;

            var end = this.nextChar(stream, '\n');
            if (end == -1) end = (stream.length - 1);

            var line = stream.slice(2, end);
            this.parser.parseMarkupBlock(line);
            if (end != -1)
                this.parser.parseMarkupBlock(stream.slice(end));
        },

        // Parses a simple block.
        parseSimpleBlock: function (stream) {
            if (stream == null || stream.length == -1) return;

            var end = this.endCodeBlock(stream);
            if (end == -1) throw "Unterminated code block.";

            var start = this.nextChar(stream, "{");
            var statement = stream.slice(1, start + 1).join("");
            this.parser.pushBlock("code", statement);

            var innerBlock = stream.slice(start + 1, end);
            this.parser.parseMarkupBlock(innerBlock);
            this.parser.pushBlock("code", "}");
            this.parser.parseMarkupBlock(stream.slice(end + 1));
        },

        // Reads an expression from the stream.
        readExpression: function (stream) {
            if (stream == null || stream.length == 0) return null;
            var output = [], state = 1, i = 0;

            while (true) {
                if (state == 1) {
                    var id = this.acceptIdentifier(stream.slice(i));
                    if (id == null) break;

                    output = output.concat(id);
                    i += id.length;
                    state = 2
                } else if (state == 2) {
                    if (stream[i] == "(" || stream[i] == "[") {
                        var brace = this.acceptBrace(stream.slice(i), stream[i]);
                        if (brace == null) break;

                        output = output.concat(brace);
                        i += brace.length;
                    } else {
                        state = 3;
                    }
                } else if (state == 3) {
                    if (stream[i] == ".") {
                        state = 4;
                        i++;
                        continue;
                    }
                    break;
                } else if (state == 4) {
                    var id = this.acceptIdentifier(stream.slice(i));
                    if (id == null) break;

                    output.push(".");
                    state = 1;
                }
            }

            return output.join("");
        },

        // Trims a string.
        trim: function (str) {
            str = str.replace(/^\s+/, "");
            for (var i = str.length - 1; i >= 0; i--) {
                if (/\S/.test(str.charAt(i))) {
                    str = str.substring(0, i + 1);
                    break;
                }
            }
            return str;
        }
    };

    var runner = function (blocks, helpers) {
        this.blocks = blocks;
        this.helpers = helpers;
        this.template = null;
        this.prepare();
    };
    runner.prototype = {
        // Prepares the template runner by evaluating the template.
        prepare: function () {

            var render = [];
            render.push("(function(model) {");

            for (var i in this.helpers) {
                var helper = this.helpers[i];
                render.push(helper[0].render());
                render.push("var hr = [];");

                for (var j = 1; j < (helper.length - 1); j++) {
                    render.push(helper[j].render("hr"));
                }

                render.push("return hr.join('\');");
                render.push(helper[helper.length - 1].render());
            };

            render.push("var r = [];");

            for (var i in this.blocks) {
                render.push(this.blocks[i].render("r"));
            }
            render.push("return r.join('\');");
            render.push("});");

            var tmp = render.join("\n");
            Console.Log('###');
            Console.Log(tmp);
            this.template = eval(tmp);
            Console.Log('###');
        },

        // Runs the template using the specified model.
        run: function (model) {
            return this.template(model);
        }
    };

    // Represents the base Razor object.
    var Razor = {

        // Parses the given template and executes it with the specified model.
        parse: function (template, model) {
            var p = new parser(new codeParser(), new markupParser());
            var result = p.parse(template);

            var r = new runner(result.blocks, result.helpers);
            return r.run(model);
        }
    }

    return Razor;
});

Razor = Razor();