
/*
 * GET home page.
 */
 
 var mongo = require('mongoskin');
 var conn = mongo.db('mongodb://public:public@alex.mongohq.com:10090/HolidayReminder');

exports.index = function(req, res){
  res.render('index');
};

exports.dashboard = function(req, res){
    if(req.session.auth){
        res.render('dashboard', { username: req.session.username });
        return;
    }
    res.render('dashboard', { username: "Your" });    
};

exports.friendlist = function(req, res){
    res.render('friendlist');
};

exports.register = function(req, res){
    var username = req.body.name;
    var email = req.body.email;
    var pass = req.body.pass;
    var data = {
      username: username,
      email: email,
      pass: pass
    };
    if(conn.users){
        var existingUser = conn.users.find({email: data.email});
        if(!existingUser){
            conn.users.save(data);
            req.session.auth = true;
            req.session.username = data.username;
            res.json(['OK']);
        }
    }
    res.json(['FAIL']);
};

exports.signin = function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    if(conn.users){
        var existingUser = conn.suers.find({username: username, password: password});
        if(existingUser){
            req.session.username = username;
            req.session.auth = true;
            res.json(['OK']);
        }
    }
    res.json(['FAIL']);
};