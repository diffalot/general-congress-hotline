/* eslint-env node, mocha */

const assert = require('assert');
const request = require('supertest');

const app = require('../cyc_entry.js');

describe('error redirect', () => {
  it('redirects to /switchboard by default', (done) => {
    request(app)
      .post('/error')
      .expect(200)
      .expect((res) => {
        assert.notEqual(
          res.text.indexOf('switchboard'), -1,
          'redirects contains switchboard');
      })
      .end(done);
  });
  it('redirects to /whatever', (done) => {
    request(app)
      .post('/error?redirect=/whatever')
      .expect(200)
      .expect((res) => {
        assert.notEqual(
          res.text.indexOf('whatever'), -1,
          'redirects contains whatever');
      })
      .end(done);
  });
  it('redirects to /whatever?query=thing', (done) => {
    request(app)
      .post('/error?redirect=/whatever?query=thing')
      .expect(200)
      .expect((res) => {
        assert.notEqual(
          res.text.indexOf('whatever?query=thing'), -1,
          'redirects contains whatever?query=thing');
      })
      .end(done);
  });
});
