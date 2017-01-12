const path = require('path');

const twilio = require('twilio');
const request = require('request');

const config = require(path.join(__dirname, '../', process.env.CONFIG));

const phoneCall = require('./phone-call');

const CONGRESS_API_URL = `https://congress.api.sunlightfoundation.com/legislators/locate?apikey=${
    process.env.SUNLIGHT_FOUNDATION_KEY}`;

const cachedZipLookups = {};
function getCongressPeople(zip, cb) {
  if (cachedZipLookups[zip]) {
    cb(cachedZipLookups[zip]);
    return;
  }

  const url = `${CONGRESS_API_URL}&zip=${zip}`;
  request(url, (err, resp, body) => {
    const ret = JSON.parse(body).results;
    cachedZipLookups[zip] = ret;
    cb(ret);
  });
}

function newCall(req, res) {
  const call = new twilio.TwimlResponse();

  call.gather({
    timeout: 20,
    finishOnKey: '#',
    numDigits: 5,
    action: 'redir_call_for_zip',
    method: 'POST',
  }, function () {
    this.play(config.audio.introAndPromptForZip);

    if (config.audioOptions.addPromptForZipCode) {
      this.play(config.audio.pleaseEnterZip);
    }
  });

  res.status(200);
  res.type('text/xml');
  res.send(call.toString());
}

function newCallTestGet(req, res) {
  req.body = req.query;
  return newCall(req, res);
}

function redirectCall(req, res) {
  const userZip = req.body.Digits || req.body.FromZip;

  getCongressPeople(userZip, (people) => {

    // Apply settings.
    if (config.target.senatorsOnly) {
      people = people.filter((person) => person.chamber === 'senate');
    }

    // Construct Twilio response.
    const call = new twilio.TwimlResponse();
    if (!people || people.length < 1) {
      call.play(config.audio.errorEncountered);
      call.hangup();
    } else {
      call.play(config.audio.aboutToStart);
      people.sort(config.target.sortFn).forEach((person, idx) => {
        if (idx > 0) {
          call.play(config.audio.nextCallBeginning);
        }

        const name = `${person.first_name} ${person.last_name}`;
        const phone = person.phone;
        if (person.chamber === 'senate') {
          call.play(config.audio.senator);
        } else {
          call.play(config.audio.representative);
        }
        call.say({ voice: 'woman' }, name);

        phoneCall(call, phone);
      });
      call.play(config.audio.done);
    }

    res.type('text/xml');
    res.status(200);
    res.send(call.toString());
  });
}

function redirectCallTest(req, res) {
  req.body = req.query;
  return redirectCall(req, res);
}

module.exports = {
  newCall,
  newCallTestGet,
  redirectCall,
  redirectCallTest,
};
