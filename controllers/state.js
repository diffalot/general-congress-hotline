const path = require('path');

const twilio = require('twilio');
const request = require('request');

const config = require(path.join(__dirname, '../', process.env.CONFIG));

const CONGRESS_API_URL = `https://congress.api.sunlightfoundation.com/legislators/locate?apikey=${
    process.env.SUNLIGHT_FOUNDATION_KEY}`;

function getRepsForLatLong(latLong, cb) {
  const url = `${CONGRESS_API_URL}&zip=${zip}`;
  request(url, (err, resp, body) => {
    const ret = JSON.parse(body).results;
    cachedZipLookups[zip] = ret;
    cb(ret);
  });
}

function getLatLongForAddress(address, cb) {

}

function stateStart(req, res) {
  const call = new twilio.TwimlResponse();

  // TODO(diffalot): play state lookup recording
  // call.play(config.audio.introAndPromptForZip);

  call.say({ voice: 'woman'}, 'Say your full street address with city, state, and zip code.  Then press the pound key');

  call.record({
    timeout: 20,
    finishOnKey: '#',
    action: 'state_lookup_transcription_begin',
    method: 'POST',
    transcribe: true,
  });

  res.status(200);
  res.type('text/xml');
  res.send(call.toString());
}

function stateLookupTranscriptionBegin(req, res) {

}

function stateLookup(req, res) {
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
        call.dial({ hangupOnStar: true }, phone);
      });
      call.play(config.audio.done);
    }

    res.type('text/xml');
    res.status(200);
    res.send(call.toString());
  });
}

module.exports = {
  stateStart,
};
