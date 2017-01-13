const path = require('path');
const twilio = require('twilio');

const config = require(path.join(__dirname, '../', process.env.CONFIG));

function switchboard(req, res) {
  console.log('Switchboard', req.body);
  const call = new twilio.TwimlResponse();
  call.gather({
    timeout: 20,
    numDigits: 1,
    action: 'new_phone_call',
    method: 'POST',
  }, function() {
    // Dial 1 for this, dial 2 for that...
    this.play(config.audio.switchboard.intro);
  });
  call.redirect('/error_redirect/switchboard')

  res.status(200);
  res.type('text/xml');
  res.send(call.toString());
}

function getWrapper(fn, req, res) {
  req.body = req.query;
  return fn(req, res);
}

module.exports = {
  switchboard: switchboard,
  switchboardTestGet: getWrapper.bind(this, switchboard),
};
