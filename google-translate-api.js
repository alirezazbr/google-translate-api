const translate = require("google-translate-api");
const fs = require("fs");

//  Apply the node to read the seconde & third arg as Address and languages
const jsonAddress = process.argv[2];
const lngArguments = process.argv[3];

//  Read the file from the jsonAddress and make it toString()
//  We use toString to make it string because fs.readFileSync returns us string / buffer

let jsonContent = fs.readFileSync(jsonAddress, "utf-8").toString();
let jsonFile = JSON.parse(jsonContent);

// console.log(jsonFile);

// Try to read the third arguments: languages
const lngAry = [];
lngAry.push(lngArguments);

// To separate the arrays with comma we should first make our array to string.
let strLngAry = lngAry.toString();
// console.log(strLngAry);

// Using comma separation
let temp = new Array();
temp = strLngAry.split(",");
// console.log(temp);


// let readJson = fs.readFileSync("./components/json-file/en.json", "utf-8");
// let jsonFile = JSON.parse(readJson);

// The supported languages
// let lngAry = ["ru", "km", "tl", "ma"];

async function getValues(item, lng) {
  const keys = Object.keys(item);
  for (let i = 0; i < keys.length; i++) {
    if (typeof item[keys[i]] == "object") {
      await getValues(item[keys[i]], lng);
    } else {

      await translate(item[keys[i]], { to: lng })
        .then(res => {
          console.log(keys[i], ` >>> ${lng} : `, res.text);
          item[keys[i]] = res.text;
        })
        .catch(err => {
          console.error(err);
        });
    }
  }
}

function translateJson(json, lng) {
  return new Promise(resolve => {
    getValues({ ...jsonFile }, lng).then(() => {
      resolve(json, lng);
    });
  });
}

async function forLoop() {
  for (let i = 0; i < temp.length; i++) {
    await translateJson(jsonFile, temp[i]).then(res => {
      console.log(res);
      fs.writeFileSync(
        `./components/translated-files/translated${temp[i]}.json`,
        JSON.stringify(res)
      );
    });
  }
}
module.exports = forLoop();
