
/**
 * Module dependencies.
 */

var express = require('express');
var http    = require('http');
var path    = require('path');
var fs      = require('fs');
var sql     = require('stringformat');
var crpjs  = require('cryptojs').Crypto;
var cache   = require('./cache.js');

var service_url = require('./config.js').config.host;

var app = express();

app.set('port', 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get ( '/lnk.php', function ( req, res ) {
    var url = require('url');
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    var hash = query.mdh;

    console.log('hash : ', hash);
    cache.get ( hash , function ( err, perl ) {
        if ( err ) {
            res.redirect('/500.html');
        } else {
            if ( perl == null ) {
                res.redirect('/404.html');
            } else {
                res.redirect( perl );
            }
        }
    });
});
app.post ( '/app.php', function ( req, res ) {
	var act = req.body.act;

    if ( !act ) {
    	res.send ( { error: { msg: 'recive unknown method for execute' } } );
    } else {
        switch ( act ) {
            case 'get_status':
                res.send ( { response : { status : "OK" } } );
            break;
            case 'save_link':
                if ( !req.body.link ) {
                    res.send ( { error : { msg: "Undefined method" } } );
                } else {
                    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
                    var resp = regexp.test( req.body.link );

                    if ( !resp ) {
                        res.send ( { error : { msg: "Incorrect link" } } );
                    } else {
                        //save link here ;)
                        cache.get ( crpjs.SHA1( req.body.link ), function ( err, perl ) {
                            if ( err ) {
                                res.send ( { error : { msg: "Unknown service error" } } );
                            } else {
                                if ( perl == null ) {
                                    cache.set ( crpjs.SHA1( req.body.link ), req.body.link, function ( err, leo ) {
                                        if ( err ) {
                                            res.send ( { error : { msg: "Unknown service error" } } );
                                        } else {
                                            res.send ( { response : { status : "OK", link: sql ( "{0}/lnk.php?mdh={1}", service_url, crpjs.SHA1( req.body.link ) ) } } );
                                        }
                                    });
                                } else {
                                    res.send ( { response : { status : "OK", link: sql ( "{0}/lnk.php?mdh={1}", service_url, crpjs.SHA1( perl ) ) } } );
                                }
                            }
                        }); 
                        //
                    }
                }
            break;
            default:
                res.send ( { error : { msg: "Undefined method" } } );
            break;
        }
    }
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
