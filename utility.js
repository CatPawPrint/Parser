function Utility () {}

Utility.string = {};

Utility.string.strip = function(input, alpha, omega, from)
{
    var result = {"string":""};
    result.from = input.indexOf(alpha, from);
    if (-1 == result.from) {
        return result;
    }
    result.from += alpha.length;
    //console.log("result.from: " + result.from);

    result.to = input.indexOf(omega, result.from);
    if (-1 == result.to) {
        return result;
    }
    //result.to += omega.length;
    //console.log("result.to: " + result.to);

    result.string = input.substring(result.from, result.to);
    return result;
};

Utility.string.stripLast = function(input, alpha, omega)
{
    var result = {"string":""};
    result.from = input.lastIndexOf(alpha, input.length - 1);
    if (-1 == result.from) {
        return result;
    }
    result.from += alpha.length;
    //console.log("result.from: " + result.from);

    result.to = input.indexOf(omega, result.from);
    if (-1 == result.to) {
        return result;
    }
    //result.to += omega.length;
    //console.log("result.to: " + result.to);

    result.string = input.substring(result.from, result.to);
    return result;
};

Utility.string.find = function(input, alpha, omega, from)
{
    var result = Utility.string.strip(input, alpha, omega, from);
    if ("" == result.string) {
        return result;
    }

    result.string = alpha + result.string + omega;
    result.from -= alpha.length;
    result.to += omega.length;

    return result;
};

Utility.string.remove = function(input, alpha, omega)
{
    var output = input;
    var result = Utility.string.find(output, alpha, omega);
    while ("" != result.string) {
        //console.log("output: " + output);
        output = output.split(result.string).join("");
        result = Utility.string.find(output, alpha, omega);
    }

    return output;
};

Utility.string.parameter = function(input)
{
    var map = {};
    input.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
        map[key] = decodeURIComponent(value);
        //console.log("[" + key + "] = " + value);
    });
    return map;
};

Utility.string.formatJson = function(input) {
    var retval = '';
    var str = input;
    var pos = 0;
    var strLen = str.length;
    var indentStr = '    ';
    var newLine = '\r\n';
    var char = '';

    for (var i = 0; i < strLen; i++) {
        char = str.substring(i, i + 1);

        if (char == '}' || char == ']') {
            retval = retval + newLine;
            pos = pos - 1;

            for (var j = 0; j < pos; j++) {
                retval = retval + indentStr;
            }
        }

        retval = retval + char;

        if (char == '{' || char == '[' || char == ',') {
            retval = retval + newLine;

            if (char == '{' || char == '[') {
                pos = pos + 1;
            }

            for (var k = 0; k < pos; k++) {
                retval = retval + indentStr;
            }
        }
    }

    return retval;
};

Utility.string.padding = function(padChar, length, input)
{
    var output = String(input);
    var count = 0 < (length - output.length) ? (length - output.length) : 0;
    for (var index = 0; count > index; ++index) {
        output = padChar + output;
    }
    return output;
};

Utility.string.replace = function(input, fromAlpha, fromOmega, toAlpha, toOmega)
{
    var result = input;
    var from = result.indexOf(fromAlpha);
    var to = result.indexOf(fromOmega, from + fromAlpha.length);

    while (-1 != from && -1 != to) {
        //console.log("from: " + from + ", to: " + to);

        var part = result.substr(from);
        part = part.replace(fromAlpha, toAlpha);
        //console.log("part: " + part);
        part = part.replace(fromOmega, toOmega);
        //console.log("part: " + part);
        result = result.substring(0, from) + part;
        //console.log("result: " + result);

        from = result.indexOf(fromAlpha);
        to = result.indexOf(fromOmega, from + fromAlpha.length);
    }

    return result;
};

Utility.string.isAscii = function(input)
{
    var ascii = /^[ -~\t\n\r]+$/;
    return ascii.test(input);
};

Utility.string.capitaliseFirstLetter = function(input)
{
    return input.charAt(0).toUpperCase() + input.slice(1);
};

Utility.string.removeTag = function(input)
{
    return Utility.string.remove(input, "<", ">");
};

Utility.string.removeSpecial = function(input)
{
    return Utility.string.remove(input, "&", ";");
};

Utility.string.encodeSpecial = function(input)
{
    return $("<div/>").text(input).html();
};

Utility.string.decodeSpecial = function(input)
{
    return $("<div/>").html(input).text();
};

Utility.string.isNumeric = function(input)
{
    return !isNaN(parseFloat(input)) && isFinite(input);
};

Utility.url = {};

Utility.url.parameterToObject = function(input)
{
    return JSON.parse('{"' + decodeURI(input).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
};

Utility.url.objectToParameter = function(input)
{
    var parameter = "";
    for (var key in input) {
        if (input.hasOwnProperty(key)) {
            var value = input[key];
            parameter += "&" + key + "=" + value;
        }
    }
    if (0 < parameter.length) {
        parameter = parameter.slice(1);
    }
    return parameter;
};

function Definition () {}

Definition.direction = {};

Definition.direction.unknown = "0";
Definition.direction.rightToLeft = "-1";
Definition.direction.leftToRight = "1";

//. ================================================================================
Object.defineProperty(String.prototype, 'capitalize', {
    value() {
        return this.replace(/\b\w/g, l => l.toUpperCase());
    }
});
/*
Object.assign(String.prototype, {
    strip(alpha, omega, from)
    {
        if (from == null) {
            from = 0;
        }
        var result = {"string":""};
        result.from = this.indexOf(alpha, from);
        if (-1 == result.from) {
            return result;
        }
        result.from += alpha.length;
        //console.log("result.from: " + result.from);

        result.to = this.indexOf(omega, result.from);
        if (-1 == result.to) {
            return result;
        }
        //result.to += omega.length;
        //console.log("result.to: " + result.to);

        result.string = this.substring(result.from, result.to);
        return result;
    }
});

Object.assign(String.prototype, {
    stripLast(alpha, omega)
    {
        var result = {"string":""};
        result.from = this.lastIndexOf(alpha, input.length - 1);
        if (-1 == result.from) {
            return result;
        }
        result.from += alpha.length;
        //console.log("result.from: " + result.from);

        result.to = this.indexOf(omega, result.from);
        if (-1 == result.to) {
            return result;
        }
        //result.to += omega.length;
        //console.log("result.to: " + result.to);

        result.string = this.substring(result.from, result.to);
        return result;
    }
});

Object.assign(String.prototype, {
    find(alpha, omega, from)
    {
        var result = this.strip(alpha, omega, from);
        if ("" == result.string) {
            return result;
        }

        result.string = alpha + result.string + omega;
        result.from -= alpha.length;
        result.to += omega.length;

        return result;
    }
});

Object.assign(String.prototype, {
    remove(alpha, omega)
    {
        var output = this;
        var result = output.find(alpha, omega);
        while ("" != result.string) {
            //console.log("output: " + output);
            output = output.split(result.string).join("");
            result = output.find(alpha, omega);
        }

        return output;
    }
});

Object.assign(String.prototype, {
    parameter()
    {
        var map = {};
        this.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
            map[key] = decodeURIComponent(value);
            //console.log("[" + key + "] = " + value);
        });
        return map;
    }
});

Object.assign(String.prototype, {
    formatJson() {
        var retval = '';
        var str = this;
        var pos = 0;
        var strLen = str.length;
        var indentStr = '    ';
        var newLine = '\r\n';
        var char = '';

        for (var i = 0; i < strLen; i++) {
            char = str.substring(i, i + 1);

            if (char == '}' || char == ']') {
                retval = retval + newLine;
                pos = pos - 1;

                for (var j = 0; j < pos; j++) {
                    retval = retval + indentStr;
                }
            }

            retval = retval + char;

            if (char == '{' || char == '[' || char == ',') {
                retval = retval + newLine;

                if (char == '{' || char == '[') {
                    pos = pos + 1;
                }

                for (var k = 0; k < pos; k++) {
                    retval = retval + indentStr;
                }
            }
        }

        return retval;
    }
});

Object.assign(String.prototype, {
    padding(padChar, length)
    {
        var output = String(this);
        var count = 0 < (length - output.length) ? (length - output.length) : 0;
        for (var index = 0; count > index; ++index) {
            output = padChar + output;
        }
        return output;
    }
});

Object.assign(String.prototype, {
    replace(fromAlpha, fromOmega, toAlpha, toOmega)
    {
        var result = String(this);
        var from = result.indexOf(fromAlpha);
        var to = result.indexOf(fromOmega, from + fromAlpha.length);

        while (-1 != from && -1 != to) {
            //console.log("from: " + from + ", to: " + to);

            var part = result.substr(from);
            part = part.replace(fromAlpha, toAlpha);
            //console.log("part: " + part);
            part = part.replace(fromOmega, toOmega);
            //console.log("part: " + part);
            result = result.substring(0, from) + part;
            //console.log("result: " + result);

            from = result.indexOf(fromAlpha);
            to = result.indexOf(fromOmega, from + fromAlpha.length);
        }

        return result;
    }
});

Object.assign(String.prototype, {
    isAscii()
    {
        var ascii = /^[ -~\t\n\r]+$/;
        return ascii.test(this);
    }
});

Object.assign(String.prototype, {
    capitaliseFirstLetter()
    {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }
});

Object.assign(String.prototype, {
    removeTag()
    {
        return this.remove("<", ">");
    }
});

Object.assign(String.prototype, {
    removeSpecial()
    {
        return this.remove("&", ";");
    }
});

Object.assign(String.prototype, {
    encodeSpecial()
    {
        return $("<div/>").text(this).html();
    }
});

Object.assign(String.prototype, {
    decodeSpecial()
    {
        return $("<div/>").html(this).text();
    }
});
*/