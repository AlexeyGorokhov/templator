'use strict';

const path = require('path');
const templator = require('../index.js');

const data = {
  global: {
    page_lang: 'en'
  },
  app: {
    page_title: 'Page Title'
  },
  home: {
    page_title: 'Page Title'
  },
  user: {
    name: 'Alexey Gorokhov'
  }
};

templator(
  path.resolve(__dirname, 'src'),
  path.resolve(__dirname, 'html'),
  data
).then(() => {
  console.log('Success!');
}).catch((err) => {
  console.dir(err.message);
});
