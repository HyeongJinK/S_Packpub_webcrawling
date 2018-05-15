let replace = (s) => s.replace(/\?/g, "@").replace(/</g, "[").replace(/>/g, "]").replace(/:/g, "-").replace(/\*/g, "+").replace(/\\/g, " ").replace(/\//g, "&");

let d = "tkan?ek/fkjd*d/fkj<?akjf>ad<\\jkf|dg:"

console.log(replace(d));