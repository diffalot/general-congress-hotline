/* eslint-env node, mocha */

const assert = require('assert');
const request = require('supertest');

const app = require('../cyc_entry.js');


describe('switchboard', () => {
  it('initiates call', (done) => {
    request(app)
      .post('/switchboard')
      .expect(200)
      .expect((res) => {
        console.log(res.text)
        assert.notEqual(
          res.text.indexOf('new_phone_call'), -1,
          'action target is new_phone_call');
      })
      .end(done);
  });
});
