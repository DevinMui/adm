var twilio = require('twilio')
var request = require('request')
var tokens = require('./tokens')
var express = require('express')
var app = express()

var accountSid = tokens.accountSid
var authToken = tokens.authToken
var arcToken = tokens.arcToken

var client = new twilio.RestClient(accountSid, authToken)

var twilioNumber = "+15005550006"

var number = "+16512223344"

var location = ""

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

var directionsOptions = {
	url: 'http://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World/solve/',
	json: true,
	form: directionsParams
}

app.post('/location', function(req, res){
	location = req.body.location

	var initX, initY, destinationX, destinationY = 0

	// find place's x and y
	var findInitParams = {
		f: 'json',
		token: arcToken,
		text: location
	}

	var findInitOptions = {
		url: 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/find/',
		json: true,
		form: findInitParams
	}

	request.post(findInitOptions, function (error, response, body) {
  	if (!error && response.statusCode == 200) {
    	console.log(body)
    	initX = body.x
    	initY = body.y
  	}
	})

	// find place's x and y
	var findDesitinationParams = {
		f: 'json',
		token: arcToken,
		text: location
	}

	var findDestinationOptions = {
		url: 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/find/',
		json: true,
		form: findInitParams
	}

	request.post(findDestinationOptions, function (error, response, body) {
  	if (!error && response.statusCode == 200) {
    	console.log(body)
    	destinationX = body.x
    	destinationY = body.y
  	}
	})

	// directions
	var directionsParams = {
		f: 'json',
		token: arcToken,
		stops: initX + ',' + initY + ';' + destinationX + ',' + destinationY
	}

})

app.listen(3000, function () {
	console.log('App running on port 3000');
});
