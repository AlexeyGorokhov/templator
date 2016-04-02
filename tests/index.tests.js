'use strict';

const test = require('tape');
const proxyquire = require('proxyquire');
const sinon = require('sinon');

const pathStub = {
  join () { return 'a'; }
};

const globbyStub = {
  sync () { return ['a']; }
};

test('index main An_Error_Occurred', t => {
  const renderFileStub = function () {
    return new Promise((resolve, reject) => {
      reject('a');
    });
  };

  const delStub = {
    sync: function (a) {}
  };
  const spy = sinon.spy(delStub, 'sync');

  const indexStub = proxyquire('../index', {
    'path': pathStub,
    'globby': globbyStub,
    'del': delStub,
    './lib/render-file': renderFileStub
  });

  indexStub('a', 'b', {})
  .then(() => {
    t.end(new Error());
  })
  .catch(e => {
    t.ok(spy.calledTwice, 'Dest folder deletion happens twice');
    t.end();
  });
});

test('index main No_Error_Occurred', t => {
  const renderFileStub = function () {
    return new Promise((resolve, reject) => {
      resolve();
    });
  };

  const delStub = {
    sync: function (a) {}
  };
  const spy = sinon.spy(delStub, 'sync');

  const indexStub = proxyquire('../index', {
    'path': pathStub,
    'globby': globbyStub,
    'del': delStub,
    './lib/render-file': renderFileStub
  });

  indexStub('a', 'b', {})
  .then(() => {
    t.ok(spy.calledOnce, 'Dest folder deletion happens only once');
    t.end();
  })
  .catch(e => {
    t.end(new Error());
  });
});
