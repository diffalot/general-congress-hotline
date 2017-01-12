const twilio = require('twilio');

function switchboard(req, res) {
  console.log('Switchboard', req.body);
  const call = new twilio.TwimlResponse();
  call.gather({
    timeout: 20,
    numDigits: 1,
    action: 'new_phone_call',
    method: 'POST',
  }, function() {
    // TODO(ian): Audio
    this.say('press 1 for X press 2 for Y');
  });

  res.status(200);
  res.type('text/xml');
  res.send(call.toString());
}

function switchboardTestGet(req, res) {
  req.body = req.query;
  return switchboard(req, res);
}

module.exports = {
  switchboard,
  switchboardTestGet,
};
