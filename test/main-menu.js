/* eslint-env node, mocha */

const request = require('supertest');

const app = require('../cyc_entry.js');

describe('main menu', () => {
  it('initiates call', (done) => {
    request(app)
      .post('/main_menu')
      .expect(200)
      .expect('<?xml version="1.0" encoding="UTF-8"?><Response><Say voice="woman">Press 1 for federal or 2 for state</Say><Gather timeout="20" numDigits="1" action="main_menu_redirect" method="POST"></Gather></Response>')
      .end(done);
  });

  describe('processes input', () => {
    it('redirects to federal menu', (done) => {
      request(app)
        .post('/main_menu_redirect')
        .send({ Digits: 1 })
        .expect(200)
        .expect('<?xml version="1.0" encoding="UTF-8"?><Response><Redirect>federal_start</Redirect></Response>')
        .end(done);
    });

    it('redirects to state menu', (done) => {
      request(app)
        .post('/main_menu_redirect')
        .send({ Digits: 2 })
        .expect('<?xml version="1.0" encoding="UTF-8"?><Response><Redirect>state_start</Redirect></Response>')
        .end(done);
    });

    it('tries again on bad input', (done) => {
      request(app)
        .post('/main_menu_redirect')
        .send({ Digits: '123' })
        .expect('<?xml version="1.0" encoding="UTF-8"?><Response><Say voice="woman">We did not understand your input, please try again</Say><Redirect>main_menu</Redirect></Response>')
        .end(done);
    });
  });
});
