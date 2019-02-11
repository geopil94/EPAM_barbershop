//dependencies
let mysql = require('mysql');

//container
let db = {};

//creating link with DB
db.connection = mysql.createConnection ({ //@TODO вынести работу с ДБ в отдельную либу
    host : '127.0.0.1',
    port : '3306', 
    user : 'root',
    password : '1234',
    database: 'new_schema'
});


//connection to DB
db.connect = db.connection.connect((err) => { 
    if (err) {
        console.log(err);
    } else {
        console.log('Zyxel connect');
    }
});


//adding new User to DB
db.register = function(name, password, callback) {
    let sql = `INSERT INTO user (login, password) VALUES ('${name}', '${password}')`;  
    db.connection.query(sql, function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            console.log('user added!');
            callback(null, result);
        }
    });   
}

//checking login and password in Users table. 
db._checkLogin = function(arrayOfFields, arrayOfValues, callback) {
    let sql = `SELECT ${arrayOfFields[0]}, ${arrayOfFields[1]} FROM user WHERE ${arrayOfFields[0]} = '${arrayOfValues[0]}' AND ${arrayOfFields[1]} = '${arrayOfValues[1]}'`;
    db.connection.query(sql, function(err, result) {
        if (err || result.length == 0) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
}


//getting array of appointments of current User
db._getAppointments = function(login, callback) {
    let sql = `SELECT date, time, service FROM apps WHERE login = '${login}'`;
    db.connection.query(sql, function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    })
}


//creating new appointment in Apps table
db._createApp = function(currentUser, date, time, service, callback) {
    let sql = `INSERT INTO apps (login, date, time, service) VALUES ('${currentUser}', '${date}', '${time}', '${service}')`;
    db.connection.query(sql, function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    })
}


//deleting appointment of current user in Apps table
db._deleteApp = function(currentUser, date, time, service, callback) {
    let sql = `DELETE FROM apps where login='${currentUser}' and date='${date}' and time='${time}' and service='${service}';`;
    db.connection.query(sql, function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
}

//export
module.exports = db;