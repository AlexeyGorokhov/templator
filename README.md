# templator

Lightweight template engine.

[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/Flet/semistandard)

`templator` is a lightweight template engine featuring the following functionality:

* Replaces `{{property_name_1.property_name_2.etc}}` with the value of the corresponding property `data.property_name_1.property_name_2.etc` of a `data` object passed as a parameter to the module's imported function.

* Replaces `{{> ./relative_path/file_name.ext}}` with recursively rendered content of the target file.

* Recursively renders all files in the `srcFolder`, except files with names starting with the `_` symbol, and places the rendered files in the `destFolder`.

## Installation

```bash
$ npm install templator --save-dev
```

## Usage example

```javascript
const templator = require('templator');
const data = getDataObjectSomehow();

templator(srcFolder, destFolder, data)
.then(() => {
  console.log('Success!');
})
.catch(err => {
  console.error(err);
});
```

## API

### templator(srcFolder, destFolder, data)

`srcFolder {String}` - Absolute or relative (to `process.cwd()`) path to the folder containing the templates.

`destFolder {String}` - Absolute or relative (to `process.cwd()`) path to the folder the rendered files to be saved in.

`data {Object}` - A data object to be used to replace `{{property1.property2}}` placeholders.

Returns `{Promise<Void>}`.
