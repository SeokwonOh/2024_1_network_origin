const express = require('express');
const bodyParser = require('body-parser');
const CryptoJS = require('crypto-js');

const app = express();
const port = 3000;
const token_list = [16384];
const mode = 0; // 0: existing method, 1: new method

// Middleware to parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: true }));

// Handle POST requests to /login
app.post('/login', (req, res) => {
	//console.log('processing private information');	
	const id = req.body.id;
	const password = req.body.password;
	const sequence = req.body.sequence;

	// Existing logic to decrypt values
	if (mode == 0) {
		const secretKey = 'secret key value from DNSSEC TLSA record';
		const decryptedId = CryptoJS.AES.decrypt(id, secretKey).toString(CryptoJS.enc.Utf8);
		const decryptedPassword = CryptoJS.AES.decrypt(password, secretKey).toString(CryptoJS.enc.Utf8);
	}

	// New logic to validate with token without decryption
	if (mode == 1) {	
		var isMatched = 0;
		var token = req.body.token;
	
		for (var i = 0; i < 16384; i++) {
			if (token_list[i%10] == token) {
				// console.log("token found");
				isMatched = 1;
			}
		}
	}

	const time = Date.now();

	if (mode == 0) {
		console.log("[encryption in encryption method][log] elapsed time : " + (time - req.body.time));
	} else {
		console.log("[token method][log] elapsed time : " + (time - req.body.time));
	}

});

app.listen(port, () => {
	// initialize the values of the token list	
	for (var i = 0; i < 16384; i++) {
		token_list[i] = 'token value which is to be used for validation in the server ' + i;
	}

	console.log(`Server running`);
});

