var twilio = require('twilio')
var request = require('request')
var tokens = require('./tokens')
var express = require('express')
var app = express()

var accountSid = tokens.accountSid
var authToken = tokens.authToken
var arcClient = tokens.arcClient
var arcSecret = tokens.arcSecret

var client = new twilio.RestClient(accountSid, authToken)

var twilioNumber = "+15005550006"

var number = "+16512223344"

var location = "160 university street, sf"

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

app.get('/location', function(req, res){
	//location = req.body.location

	var initX, initY, destinationX, destinationY = ""
	var direction = "sadf"

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
		  		console.log("INIT OPTIONS")
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
				    	//console.log(body)
				    	//console.log(JSON.stringify(body, null, 2));
				    	console.log("DESTINATION OPTIONS")
				    	destinationX = body.locations[0].feature.geometry.x
				    	destinationY = body.locations[0].feature.geometry.y

				    	// directions
							var directionsParams = {
								f: 'json',
								token: arcToken,
								stops: initX + ',' + initY + ';' + destinationX + ',' + destinationY
							}

							var uri = 'http://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World/solve?f=json&' +
								'token=' + arcToken + '&' +
								'stops=' + initX + ',' + initY + ';'+ destinationX + ',' + destinationY

							console.log(uri)

							var directionsOptions = {
								url: uri,
								// json: true,
								// form: {
								// 	f: 'json',
								// 	token: arcToken,
								// 	//stops: initX + ',' + initY + ';' + destinationX + ',' + destinationY
								// }
							}

							request.post(directionsOptions, function (error, response, body) {
						  	if (!error && response.statusCode == 200) {
						    	console.log("DIRECTION OPTIONS")
						    	console.log(body)
						    	direction = body
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


	// // find place's x and y
	// var findDesitinationParams = {
	// 	f: 'json',
	// 	token: arcToken,
	// 	text: location
	// }

	// var findDestinationOptions = {
	// 	url: 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/find/',
	// 	json: true,
	// 	form: findInitParams
	// }

	// request.post(findDestinationOptions, function (error, response, body) {
 //  	if (!error && response.statusCode == 200) {
 //    	//console.log(body)
 //    	//console.log(JSON.stringify(body, null, 2));
 //    	console.log("DESTINATION OPTIONS")
 //    	destinationX = body.locations[0].feature.geometry.x
 //    	destinationY = body.locations[0].feature.geometry.y
 //  	} else {
 //  		console.log(error)
 //  		console.log("DESTINATION OPTIONS")
 //  	}
	// })

	// // directions
	// var directionsParams = {
	// 	f: 'json',
	// 	token: arcToken,
	// 	stops: initX + ',' + initY + ';' + destinationX + ',' + destinationY
	// }

	// var directionsOptions = {
	// 	url: 'http://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World/solve/',
	// 	json: true,
	// 	form: directionsParams
	// }


	// var direction = "sadf"
	// request.post(directionsOptions, function (error, response, body) {
 //  	if (!error && response.statusCode == 200) {
 //    	console.log("DIRECTION OPTIONS")
 //    	console.log(body)
 //    	direction = body
 //  	} else {
 //  		console.log("DIRECTION OPTIONS")
 //  		console.log(error)
 //  		direction = error
 //  	}
	// })

	console.log(direction)
	res.send(direction)

})

app.listen(3000, function () {
	console.log('App running on port 3000');
});
