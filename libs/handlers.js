//dependencies
let db = require('./db');

//container
let handlers = {};

//creating new User and checking login uniqueness.
handlers.register = function(data, callback) {
    let sql = `SELECT login FROM user WHERE login = '${data.payload.name}'`;  
    db.connection.query(sql, function(err, result) {
        if (err) {
            callback(400, {'error' : 'error while DB query'});
        } else {
            if (result.length === 0) {
                db.register(data.payload.name, data.payload.password, function(err, result) {
                    if (err) {
                        callback(444, {'error': 'cant add user into DB'});
                    } else {
                        callback(200, false, {login : data.payload.name});
                    }
                });
            } else { 
                callback(404, {'error' : 'user already exists!'});
            }
        }
    });  
}

//checking login and password. if correct - returning current username to client side.
handlers.login = function(data, callback) {
    db._checkLogin(['login', 'password'], [data.payload.name, data.payload.password], function(err, result) {
        if (err) { 
            callback(500, {'ERROR': 'cant read login and password'});
        } else {
            if (result) {
                callback(200, false, {login : data.payload.name});
            } else {
                callback(404, {'ERROR': 'wrong login or password!'});
            }
        }
    });
}


//returning array of appointments of current user to client side
handlers.getAppointments = function(data, callback) {
    db._getAppointments(data.payload.login, function(err, result) {
        if (err) {
            callback(400, {'ERROR': 'cant reach user\'s appointments!'});
        } else { 
            callback(200, false, result); 
        }
    })
}


//creating new appointment
handlers.createApp = function(data, callback) {
    db._createApp(data.payload.login, data.payload.date, data.payload.time, data.payload.service, function(err, result) {
        if (err) {
            callback(400, {'ERROR': 'cant create appointment!'});
        } else {
            callback(200, false);
        }
    })
}


//deleting existing appointment 
//@TODO удаляет все одинаковые записи - исправить!
handlers.deleteApp = function(data, callback) {
    db._deleteApp(data.payload.login, data.payload.date, data.payload.time, data.payload.service, function(err, result) {
        if (err) {
            callback(400, {'ERROR': 'cant delete appointment!'})
        } else {
            callback(200, false);
        }
    });
}


//export
module.exports = handlers;