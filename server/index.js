var twilio = require('twilio')
var tokens = require('./tokens')
var express = require('express')
var app = express()

var accountSid = tokens.accountSid
var authToken = tokens.authToken

var client = new twilio.RestClient(accountSid, authToken)

var twilioNumber = "+15005550006"

var number = "+16512223344"

app.get('/red', function(req, res){
	// twilio send
	client.messages.create({
    to: number, // number of sim
    from: twilioNumber,
    body: 'red'
	}, function(error, message) {
    if (error) {
      console.log(error.message);
      res.send("ERROR SENDING SMS")
    } else {
    	res.send("RED LIGHT")
    }
	});
})

app.get('/green', function(req, res){
	// twilio send
	client.messages.create({
    to: number, // number of sim
    from: twilioNumber,
    body: 'green'
	}, function(error, message) {
    if (error) {
    	console.log(error.message);
    	res.send("ERROR SENDING SMS")
    } else {
    	res.send("GREEN LIGHT")
    }
	});
})

app.listen(3000, function () {
	console.log('App running on port 3000');
});
