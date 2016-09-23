'use strict';

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

templator('./debug/src', './tmp/html', data)
.then(() => {
  console.log('Success!');
})
.catch((err) => {
  console.dir(err.message);
});
