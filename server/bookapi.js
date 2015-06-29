var restify = require('restify'),
    session = require('restify-memory-session')({
        debug: false,
        ttl: 1000
    });
var mongojs = require('mongojs');
connection_string = '127.0.0.1:27017/bookapi';
db = mongojs(connection_string, ['bookapi']);
accounts = db.collection("account");
var http = require('http')
var https = require('https')
function register(req, res, next) {
    user = {};
    user.username = req.body.username;
    user.password = req.body.password;
    if (user.username === undefined || user.password === undefined) {
        return next(new restify.InvalidArgumentError('Name must be supplied'));
    }
    accounts.findOne({
        username: user.username
    }, function(err, success) {
        if (success) {
            res.send(200, {
                "status": false,
                "message": "username existed"
            });
            next();
        } else {
            accounts.save(user, function(err, success) {
                if (success) {
                    res.send(200, {'status':true, 'message': 'register success'});
                    next();
                } else {
                    next(err);
                }
            })
        }
    })
}

function login(req, res, next) {
    user = {};
    user.username = req.body.username;
    user.password = req.body.password;
    if (user.username === undefined || user.password === undefined) {
        return next(new restify.InvalidArgumentError('Name must be supplied'));
    }
    accounts.findOne({
        username: user.username,
        password: user.password
    }, function(err, success) {
        if (success) {
            session.save(req.session.sid, {'username': user.username}, function(err, status) {
                if (err) {
                    console.log("Session data cannot be saved");
                    return;
                }
            });
            session.load(req.session.sid, function(err, exists) {
                console.log(exists);
            });
            res.send(200, {'status':true, 'message':'success', 'username': user.username, 'session': req.session});
            return next();
        } else {
            res.send(200, {'status':false, 'message':'username or password is incorrected.'})
            next(err);
        }
    })
}

function search(req, res, next) {
    query = req.body.query;
    var googleapi = null;
    if(query.match(/^\d*$/) == undefined) googleapi = 'https://www.googleapis.com/books/v1/volumes?q=';
    else googleapi = 'https://www.googleapis.com/books/v1/volumes?q=isbn:';
    https.get(googleapi + query, function(http_res) {
        var body = '';
        http_res.on('data', function(chunk){
            body += chunk;
        }).on('end', function() {
            console.log('end');
            res.send(200, body);
            return next();
        });
    }).on('error', function(e){console.log(e);});
}

function listItems(req, res, next) {
    session.load(req.session.sid, function(err, data) {
        var username = data.username;
        if(username == undefined) {
            res.send(200, {'status':false, 'message':'please login.'})
            return;
        }
        accounts.findOne({
            username: username
        }, function(err, success) {
            if(success) {
                var reading_list = success.reading_list;
                if(reading_list === undefined) reading_list = []
                reading_list['status'] = true;
                reading_list['message'] = 'success';
                res.send(200, {'status':true, 'message':'success','items':reading_list});
            }else {
                res.send(200, {'status':false, 'message':'account not found.'});
                return next(err);
            }     
        });
    });
    
}

function addItem(req, res, next) {
    var book_data = req.body.book;
    session.load(req.session.sid, function(err, data) {
        var username = data.username;
        if(username == undefined) {
            res.send(200, {'status':false, 'message':'please login.'})
            return;
        }
        accounts.findOne({
            username: username
        }, function(err, success) {
            if (success) {
                var reading_list = success.reading_list;
                if(reading_list === undefined) reading_list = [];
                var is_existed = false;
                for(var i=0; i<reading_list.length; i++) {
                    if(reading_list[i].id == book_data.id) {
                        is_existed = true;
                        break;
                    }
                }
                if(is_existed == false) reading_list.push(book_data);
                accounts.update({'username':username},{'$set':{'reading_list':reading_list}},function(m){console.log(m);});
                res.send(200, {
                    "status": true,
                    "message": "success"
                });
                next();
            } else {
                res.send(200, {'status':false, 'message':'account not found.'});
                return next(err);
            }
        });
    });
    
}

function delItem(req, res, next) {
    session.load(req.session.sid, function(err, data) {
        var username = data.username;
        if(username == undefined) {
            res.send(200, {'status':false, 'message':'please login.'})
            return;
        }
        var book_id = req.body.book;
        accounts.findOne({
            username: username
        }, function(err, success) {
            if (success) {
                var reading_list = success.reading_list;
                if(reading_list === undefined) reading_list = [];
                for(var i=0; i<reading_list.length; i++) {
                    if(reading_list[i].id == book_id) {
                        reading_list.splice(i,1);
                        break;
                    }
                }
                accounts.update({'username':username},{'$set':{'reading_list':reading_list}},function(m){console.log(m);});
                res.send(200, {
                    "status": true,
                    "message": "success"
                });
                next();
            } else {
                res.send(200, {'status':false, 'message':'account not found.'});
                return next(err);
            }
        });
 
    });
 
}

var server = restify.createServer();
server.use(session.sessionManager);
server.use(restify.queryParser());
server.use(restify.bodyParser({
    mapParams: false
}));
server.post('/api/account/register', register);
server.post('/api/account/login', login);
server.post('/api/book/search', search);
server.get('/api/book/list', listItems);
server.post('/api/book/delete', delItem)
server.post('/api/book/add', addItem);
server.get(/\/static(\/.*)*?/, restify.serveStatic({ directory: '../client', default: "index.html" }));  
server.get('/', restify.serveStatic({directory: '../client', default: "index.html"}));
server.listen(4000, function() {
    console.log('%s listening at %s', server.name, server.url);
});
