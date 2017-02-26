var	HTTPlogger = require('mongo-morgan'),
	rid = require('rid'),
	RID = rid();

function StructuredLogging()
{
    return function(tokens, req, res)
	{
        var JSONLine = JSON.stringify(
			{
				'RequestID': tokens['id'](req, res),
				'status': tokens.status(req, res), //1
				'method': tokens.method(req, res), //2
				'Remote-user': tokens['remote-user'](req, res), //3
				'Remote-address': tokens['remote-addr'](req, res), //4
            	'server': tokens['server'](req, res), //4
            	'port': tokens['port'](req, res), //4
				'URL': tokens.url(req, res), //5
				'HTTPversion': 'HTTP/' + tokens['http-version'](req, res), //6
				'Response-time': tokens['response-time'](req, res, 'digits'), //7
				'date': tokens.date(req, res, 'web'), //8
				'Referrer': tokens.referrer(req, res)
			});
        return JSONLine;
	}
}

HTTPlogger.token('id', function getId(req)
	{
		return RID;
	});

function mongoMorganExtendedFormat(db,collectionname,skipfunction)
{
	return HTTPlogger(db, StructuredLogging(), 
		{
			skip: skipfunction,
			collection: collectionname
		});
}

module.exports = mongoMorganExtendedFormat;
module.exports.morgan = HTTPlogger;
