/* eslint-env node, mocha */

const assert = require('assert');
const path = require('path');
const request = require('supertest');

const app = require('../cyc_entry.js');

describe('state lookup', () => {
  it('state start', (done) => {
    request(app)
      .post('/state_start')
      .expect(200)
      .expect('<?xml version="1.0" encoding="UTF-8"?><Response><Say voice="woman">Say your full street address with city, state, and zip code.  Then press the pound key</Say><Record timeout="20" finishOnKey="#" action="state_lookup_transcription_begin" method="POST" transcribe="true"></Record></Response>')
      .end(done);
  });

  describe('state address lookup', () => {
    it('waits for transcription', (done) => {
      request(app)
        .post('/state_lookup_transcription_begin')
        .send({ Digits: '10583' })
        .expect(200)
        .end(done);
    });
    it('looks up representatives', (done) => {
      request(app)
        .post('/state_lookup')
        .send({ Digits: '10583' })
        .expect(200)
        .end(done);
    });
  });
});
