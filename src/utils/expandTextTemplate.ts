/**
 * a template expansion script I made some time ago. not perfect, and with some feature a bit weird, but it should do.
 * 
 * usage :
 * send an object an a string template.
 * 
 * all value in {{...}} will be expended by searching value in the obj.
 * if the name of the variable containt ".", the expansion search subValue of obj.
 * if no value of obj is found, the expansion give an empty string.
 * 
 * the "||" work in template, meaning the template will expand in the first non empty string
 * by testing each variable between the "||";
 * 
 * a literal empty template "{{}}" will be replaced with the full object.toString()
 * 
 * a template with ? (like "{{? variable ? text ?}}" can be used for conditional text. the text will be added if the variable is truthy
 * 
 * example :
 * 
 * expandTemplate("testing {{var1}}", {var1 : "template"}) === "testing template".
 * 
 * expandTemplate("testing {{var2 || var1}}", {var2 : false, var1 : "OR template"}) === "testing OR template".
 * 
 * expandTemplate("testing {{var1.subprop}}", {var1 : {subprop : "subprop template"}}) === "testing subprop template".
 * 
 * expandTemplate("testing {{}}", {test : "foo"}) === "testing [object Object]".
 * 
 * expandTemplate("testing with {{? var1 ? a {{var1}} var  ?}}{{? var2 ? another variable ?}}", {var1 : "conditional"}) === "testing with a conditional variable"
 */
export const expandTemplate = (function () {
    function expandTemplate(text : string, obj : {[key : string] : any}) {
        const exprExpand = exprExec(obj);
        
        return exprExpansion(conditionnalExpansion(text.replace(/{{}}/g, function() {
            return obj.toString();
        }), exprExpand), exprExpand);
    }

    function conditionnalExpansion(text : string, exprExpand : (str : string) => string) {
        const regex = /{{\?.*?\?}}/g;
        return text.replace(regex, function(match) {
            const resultArr = match.slice(3, -3).split("?");
            return exprExpand(resultArr[0]) ? resultArr.slice(1).join("?") : "";
        });
    }
    
    function exprExpansion(text : string, exprExpand : (str : string) => string) {
        const regex = /{{.*?}}/g;
        return text.replace(regex, function(match) {
            //warning : no short circuit. (but null propagation operator by default)
            return exprExpand(match.slice(2, -2));
        });
    }
    
    function exprExec(obj : {[key : string] : any}) {
        return function(str : string) {
            const valArr = str.split("||").map(s => s.trim().split(".").reduce(function(value, sub : string) {
                return value && value[sub] || "";
            }, obj));
            return valArr.find(<T>(a : T):T => a) || "";
        };
    }
    return expandTemplate;
})();