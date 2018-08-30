let test = `
adsf 

sadf     `;
test = test.replace(/^\n/g, "");
console.log(test.replace(/\s/g, ""));
console.log(test);