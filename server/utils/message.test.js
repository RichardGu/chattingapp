var expect = require('expect');

var {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
  it('should generate correct message object', () => {

    var from = 'Richard';
    var text = 'Hello';

    var res = generateMessage(from, text);

    expect(res.createdAt).toBeA('number');
    expect(res).toInclude({from, text});

  })
});


describe('generateLocationMessage', () => {
  it('should generate correct location object', () => {

    var from = 'Deb';
    var latitude = 15;
    var longitude = 19;
    var url = 'https://www.google.com/maps?q=15,19';
    var message = generateLocationMessage(from, latitude, longitude);

    expect(message.createdAt).toBeA('number');
    expect(message).toInclude({from, url}); 

  })

});
