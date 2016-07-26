
// imports.
var request = require('request');


exports.requestApi = function (url, params, method, callback) {
    result = {
        'success': true,
        'valid': false
    };

    if(method == 'GET') {
        paramString = "";
        for (var param in params) {
            paramString += param + '=' + params[param] + '&'; 
        }

        url += '?' + paramString;

        request.get({
	        url: url,
            proxy: process.env.PROXY,
            agentOptions: {
                    secureProtocol: 'SSLv3_method'
                }
            }, function(error, response, body) {
                if(!error && response.statusCode == 200) {
                    console.log("No error");
                    result['body'] = body;
                    result['valid'] = true;
                    callback(result);
                    return result;
                }
                else {
                    result['error'] = error;
                }
            });
    }
    else if(method == 'POST') {
        request.post({
            url: url,
            form: params,
            proxy: process.env.PROXY,
            agentOptions: {
                    secureProtocol: 'SSLv3_method'
                }
            }, function(error, response, body) {
                if(!error && response.statusCode == 200) {
                    result['body'] = body;
                    result['valid'] = true;
                    return result;
                }
        });
    }
    return result;
}