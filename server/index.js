var twilio = require('twilio')
var request = require('request')
var tokens = require('./tokens')
var express = require('express')
var bodyParser = require('body-parser')

var app = express()

app.use(bodyParser.json())

var accountSid = tokens.accountSid
var authToken = tokens.authToken
var arcClient = tokens.arcClient
var arcSecret = tokens.arcSecret

var client = new twilio.RestClient(accountSid, authToken)

var twilioNumber = "+15005550006"

var number = "+14159667621"

var location = "160 university street, sf"

app.post('/trigger', twilio.webhook(), function(request, response) {
    var twiml = new twilio.TwimlResponse();

    var params = {
			f: 'json',
			text: req.body.Body
		}
		var findOptions = {
			url: 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/find/',
			json: true,
			form: params
		}

		request.post(findOptions, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				x = body.locations[0].feature.geometry.x
		    y = body.locations[0].feature.geometry.y
	  		twiml.message(x + ', ' + y);
    		response.send(twiml);
	  	} else {
	  		console.log(error)
	  	}
	  })

});

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

app.post('/location', function(req, res){
	var initLocation = req.body.initLocation
	var destinationLocation = req.body.destinationLocation
	var direction = ""

	var initX, initY, destinationX, destinationY = ""

	var params = {
		f: 'json',
		client_id: arcClient,
		client_secret: arcSecret,
		grant_type: 'client_credentials',
		expiration: '1440'
	}
	var arcTokenOptions = {
		url: 'https://www.arcgis.com/sharing/rest/oauth2/token/',
		json: true,
		form: params
	}

	request.post(arcTokenOptions, function (error, response, body) {
		if (!error && response.statusCode == 200) {
	  	var arcToken = body.access_token

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
		    	initX = body.locations[0].feature.geometry.x
		    	initY = body.locations[0].feature.geometry.y

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
				    	destinationX = body.locations[0].feature.geometry.x
				    	destinationY = body.locations[0].feature.geometry.y

				    	// directions
							var directionsParams = {
								f: 'json',
								token: arcToken,
								stops: initX + ',' + initY + ';' + destinationX + ',' + destinationY
							}

							var directionsOptions = {
								url: 'http://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World/solve/',
								json: true,
								form: directionsParams
							}

							request.post(directionsOptions, function (error, response, body) {
						  	if (!error && response.statusCode == 200) {
						    	direction = body
						    	res.send(direction)
						  	} else {
						  		console.log("DIRECTION OPTIONS")
						  		console.log(error)
						  		direction = error
						  	}
							})

				  	} else {
				  		console.log(error)
				  		console.log("DESTINATION OPTIONS")
				  	}
					})

		  	} else {
		  		console.log(error)
		  		console.log("INIT OPTIONS")
		  	}
			})

		}
	})

})

app.listen(3000, function () {
	console.log('App running on port 3000');
});
