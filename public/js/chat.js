var socket = io();

function scrollToBottom() {
  // selectors
  var messages = jQuery('#message-list');
  var newMessage = messages.children('li:last-child');

  // hights
  var clientHeight = messages.prop('clientHeight');

  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    console.log('Should scroll');
    messages.scrollTop(scrollHeight);
  }
}


socket.on('connect', function () {
  console.log('connection is on');
  var params = jQuery.deparam(window.location.search);
  socket.emit('join', params, function(error) {
    if(error) {
      alert(error);
      window.location.href = '/';
    } else {
      console.log('No error');
    }
  })

});

socket.on('disconnect', function () {
  console.log('disconnected from server');
});

socket.on('updateUserList', function (users) {
  console.log('Users list', users);
  var ol = jQuery('<ol></ol>');

  users.forEach(function (user) {
    ol.append(jQuery('<li></li>').text(user));
  });

  jQuery('#users').html(ol);
});

socket.on('newMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  jQuery('#message-list').append(html);
  scrollToBottom();
  //console.log('New message back from server', message);
  //var formattedTime = moment(message.createdAt).format('h:mm a');
  //var li = jQuery('<li></li>');
  //li.text(`${message.from} ${formattedTime}: ${message.text}`);
  //jQuery('#message-list').append(li);
});

socket.on('newLocationMessage', function (message) {

  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#location-message-template').html();
  var html = Mustache.render(template, {
    url: message.url,
    from: message.from,
    createdAt: formattedTime
  });
  jQuery('#message-list').append(html);
  scrollToBottom();
  //var li = jQuery('<li></li>');
  //var a = jQuery('<a target="_blank">My current location</a>');
  //var formattedTime = moment(message.createdAt).format('h:mm a');

  //li.text(`${message.from} ${formattedTime}: `);
  //a.attr('href', message.url);

  //li.append(a);
  //jQuery('#message-list').append(li);
});


jQuery('#message-form').on('submit', function(e){
  e.preventDefault();
  var messageTextbox = jQuery('[name=message]');
  socket.emit('createMessage', {
    from: 'User',
    text: messageTextbox.val()
  }, function() {
    messageTextbox.val('')
  });
})

var locationButton = jQuery('#send-location');
locationButton.on('click', function() {
  if(!navigator.geolocation) {
    return alert('Geolocation not supported by your browser');
  }

  locationButton.attr('disabled', 'disabled').text('Sending location ...');

  navigator.geolocation.getCurrentPosition(function(position) {

    locationButton.removeAttr('disabled').text('Send location');
    console.log(position);
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function() {
    locationButton.removeAttr('disabled').text('Send location');
    alert('Unable to fetch location');
  });

});
