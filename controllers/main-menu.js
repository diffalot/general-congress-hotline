const twilio = require('twilio');

function mainMenu(req, res) {
  const call = new twilio.TwimlResponse();

  // TODO(diffalot): use audio message for choosing federal or state
  // call.play(config.audio.introAndPromptForZip);
  call.say({ voice: 'woman' }, 'Press 1 for federal or 2 for state');

  call.gather({
    timeout: 20,
    numDigits: 1,
    action: 'main_menu_redirect',
    method: 'POST',
  });

  res.status(200);
  res.type('text/xml');
  res.send(call.toString());
}

function mainMenuRedirect(req, res) {
  const call = new twilio.TwimlResponse();

  switch (req.body.Digits) {
    case '1':
      call.redirect('federal_start');
      break;
    case '2':
      call.redirect('state_start');
      break;
    default:
      call.say({ voice: 'woman' }, 'We did not understand your input, please try again');
      call.redirect('main_menu');
  }

  res.type('text/xml');
  res.status(200);
  res.send(call.toString());
}

module.exports = {
  mainMenu,
  mainMenuRedirect,
};
