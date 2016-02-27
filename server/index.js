var twilio = require('twilio')
var tokens = require('./tokens')
var express = require('express')
var app = express()

var accountSid = tokens.accountSid
var authToken = tokens.authToken

var client = new twilio.RestClient(accountSid, authToken)

app.get('/red', function(){
	// twilio send
	client.messages.create({
    to:'+16512223344', // number of sim
    from:'TWILIO_NUMBER',
    body:'red'
	}, function(error, message) {
	    if (error) {
	        console.log(error.message);
	    }
	});
})

app.get('/green', function(){
	// twilio send
	client.messages.create({
    to:'+16512223344', // number of sim
    from:'TWILIO_NUMBER',
    body:'green'
	}, function(error, message) {
	    if (error) {
	        console.log(error.message);
	    }
	});
})

app.listen(3000, function () {
	console.log('App running on port 3000');
});
