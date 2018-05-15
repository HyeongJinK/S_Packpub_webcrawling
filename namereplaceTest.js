let replace = (s) => s.replace("?", "@").replace("<", "[").replace(">", "]").replace(":", "-").replace("*", "+");

let d = "tkan?ek/fkjd*dfkj<akjf>adjkf|dg:"

console.log(replace(d));