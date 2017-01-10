/* eslint-env node, mocha */

const assert = require('assert');
const request = require('supertest');

const app = require('../cyc_entry.js');

describe('federal lookup', () => {
  it('federal start', (done) => {
    request(app)
      .post('/federal_start')
      .expect(200)
      .expect((res) => {
        assert.notEqual(
          res.text.indexOf('audio/v2/zip_prompt.mp3'), -1,
          '/federal_start should play audio/v2/zip_prompt.mp3');
      })
      .end(done);
  });

  describe('federal zip lookup', () => {
    it('enforces zip code', (done) => {
      request(app)
        .post('/federal_lookup')
        .expect(200)
        .expect((res) => {
          assert.notEqual(
            res.text.indexOf('audio/v2/error.mp3'), -1,
            '/redir_call_for_zip should reject callers without a zip code');
        })
        .end(done);
    });

    it('looks up senators', (done) => {
      request(app)
        .post('/federal_lookup')
        .send({ Digits: '10583' })
        .expect((res) => {
          assert(res.text.indexOf('audio/v2/senator.mp3') > -1,
                 'Response contains a senator recording');
        })
        .end(done);
    });

    // TODO(thosakwe): Add a test for auto-finding the zip code of a repeat caller
    // Note from thosakwe: I'll be able to add such a test once we have some kind of persistence
    // set up.

    // TODO(bfaloona): Add test for invalid zip code
    // TODO(bfaloona): Add test for timout
    // TODO(bfaloona): Add tests for priority feature
  });
});
