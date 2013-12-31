var redis  = require('redis');
var config = require('./config.js').config;

this.drop = function(key, callback)
{
    //var client = redis.createClient(config.redis.port, config.redis.ip, { auth_pass: config.redis.pass });
    var client = redis.createClient(config.redis.port, config.redis.ip);
    client.on("error", function (err) {
        console.log("->" + err);
        client.quit();
        callback(err, null);
    });
    client.send_command('DEL', [key], function(err, rp){
        client.quit();
        if (err){
            callback(null, false);
        }else{
            callback(null, true);
        }
    });
};
this.set = function(key, value, callback)
{
    //var client = redis.createClient(config.redis.port, config.redis.ip, { auth_pass: config.redis.pass });
	var client = redis.createClient(config.redis.port, config.redis.ip);
    client.on("error", function (err) {
        console.log("->" + err);
        client.quit();
        callback(err, null);
    });
	client.set(key, value, redis.print);
	client.quit();
	callback(null, true);
};
this.get = function(key, callback)
{
	//var client = redis.createClient(config.redis.port, config.redis.ip, { auth_pass: config.redis.pass });
	var client = redis.createClient(config.redis.port, config.redis.ip);
    client.on("error", function (err) {
        console.log("Error " + err);
        client.quit();
        callback(err, null);
    });
    client.get(key, function (err, replies) {
        client.quit();
        callback(null, replies);
    });
};
this.decode = function(key, callback){
    this.get(key, function(err, res){
        if (err){
            callback(err, null);
        }else{
            try{
                var data = JSON.parse(res);
                callback(null, data);
            }catch(error){
                callback(null, res);
            }
        }
    });
};
//client.hkeys
///usr/local/etc/rc.d/redis start  <--