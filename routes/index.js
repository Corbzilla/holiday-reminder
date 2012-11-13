/*
 * GET home page.
 */
 
 //var http = require('http');
 var http = require('../app');
 var https = require('https');
 var mongo = require('mongoskin');
 var conn = mongo.db('mongodb://public:public@alex.mongohq.com:10090/HolidayReminder');
 var keys = require('../keys');
 //var util = require('util');
 
 var OAuth= require('oauth').OAuth;
 var OperationHelper = require('apac').OperationHelper;

 var opHelper = new OperationHelper({
     awsId:     'AKIAIAWGTQ3Z7N5WUHPQ',
     awsSecret: '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',
     assocId:   ' aztag-20'
 });

var oa = new OAuth(
    "https://api.twitter.com/oauth/request_token",
	"https://api.twitter.com/oauth/access_token",
	keys.twitterConsumerKey,
	keys.twitterConsumerSecret,
	"1.0",
	"http://holidayreminder.challetwoods.c9.io/twitterdashboard",
	"HMAC-SHA1"
);

/*var fbOa = new OAuth(
    "",
    "",
    "368684593212563",
    "d6f7ad1fd7ae1fb90aed27981cc23aa2",
    "2.0",
    "http://holidayreminder.challetwoods.c9.io/dashboard",
    "HMAC-SHA1"
);*/

exports.index = function(req, res){
  res.render('index');
};

exports.dashboard = function(req, res){
    var itemList = []
        , friendList = []
        , userId;
    if(req.body.friends){
        friendList = req.body.friends;
    }
    if(req.session.auth){
        console.log(req.session);
        console.log("req.sessionID "  + req.sessionID);
        userId = req.session.user._id.toString();
        conn.collection('items').find({userId: userId}).toArray(function(err, list){
            itemList = list;
            conn.collection('friends').find({userId: userId}).toArray(function(err, friends){
                if(friends.length){
                    friends.forEach(function(friend){ friendList.push(friend); });
                    //console.log(friendList[0]);
                }
                 conn.collection('lists').find({userId: userId}).toArray(function(err, lists){
                    if(!err && lists){
                        res.render('dashboard', { username: req.session.user.username, myList: itemList, friendList: friendList, shoppingLists: lists });
                    } else {
                        //err
                    }
                 });
            });            
        });
    } else {
        res.redirect("/");
    }
};

exports.addListItem = function(req, res){
    var userId = req.session.user._id;
    var name = req.body.name;
    var desc = req.body.desc;
    var link = req.body.link;
    var item = {
      name: name,
      desc: desc,
      link: link
    };
    conn.collection('items').save({userId: userId, item: item});
};

exports.addlink = function(req, res){
    var link = req.body.link;
    var itemId = req.body.itemId;
    conn.collection('items').update({_id: conn.ObjectID.createFromHexString(itemId)},{ $set: {"item.link": link }}, function(err,  item){
        if(item && !err ){
             res.json(['OK']);
        } else {
            res.json([]);
        }
    });
};

exports.friendlist = function(req, res){
    var email = req.params.email
        , existingUser
        , id
        , list = []
        , auth = false
        , friend = "";
    if(req.session.auth){
        auth = true;
        friend = email;
    }
    conn.collection('users').findOne({email: email}, function(err, user){
        existingUser = user;
        if(existingUser){
            id = existingUser._id;
            conn.collection('items').find({userId: id.toString()}).toArray(function(err, userlist){
                res.render('friendlist', { friendList: userlist, auth: auth, friend: friend });
            });            
        }else{
            res.render('friendlist', { friendList: list, auth: auth, friend: friend });
        }
    });
};

exports.getFriendList = function(req, res){
    var list, existingUser;
    //var email = req.body.email
    var friendId = req.body.friend.toString();
    
    conn.collection('friends').findOne({_id:  conn.ObjectID.createFromHexString(friendId)}, function(err, friend){
        if(!err && friend){
            conn.collection('users').findOne({_id: conn.ObjectID.createFromHexString(friend.friendId.toString())}, function(err, user){
                existingUser = user;
                if(!err && existingUser){
                    conn.collection('items').find({userId: existingUser._id.toString()}).toArray(function(err, userList){
                        if(!err && userList){
                            list = userList;
                            res.json(list);
                        } else {
                            res.json([]);
                        }
                    });                    
                } else {
                    res.json([]);
                }
            });
        } else {
            res.json([]);
        }
    });
};

exports.getfbfriendlist = function(req, res){
    var matchId = req.body.matchId;
    var matchList = req.session.friendMatch;
    var userId = matchList[matchId].id;
    var existingUser, list;
     conn.collection('friends').findOne({_id:  conn.ObjectID.createFromHexString(userId)}, function(err, friend){
        if(!err && friend){
            conn.collection('users').findOne({_id: conn.ObjectID.createFromHexString(friend.friendId.toString())}, function(err, user){
                existingUser = user;
                if(!err && existingUser){
                    conn.collection('items').find({userId: existingUser._id.toString()}).toArray(function(err, userList){
                        if(!err && userList){
                            list = userList;
                            res.json(list);
                        } else {
                            res.json([]);
                        }
                    });                    
                } else {
                    res.json([]);
                }
            });
        } else {
            res.json([]);
        }
    });
};

exports.fbfriendlist = function(req, res){
    var fbIds = req.body.friends
        ,i = 0;
    //var redirect = req.body.redirect;
    conn.collection('users').find({fbId: {$in: fbIds}}).toArray(function(err, users){
        if(!err && users){
            var newUsers = [];
            var matches = [];
            req.session.friends = users.forEach(function(user){
                var newUser ={
                    matchId: i,
                    name: user.username
                };
                var matchItem ={
                    id: user._id,
                    matchId: i
                };
                matches.push(matchItem);
                i++;
                newUsers.push(newUser); 
            });
            req.session.friendMatch = matches;
            res.json(newUsers);   
        } else {
            res.json([]);
        }
    });
};

exports.twitterfriendlist = function(req, res){
    if(req.session.oauth && req.session.user){
        oa.getProtectedResource("https://api.twitter.com/1.1/friends/ids.json?cursor=-1&user_id=" + req.session.user.twitId + " ", "GET", req.session.oauth.token, req.session.oauth.token_secret, function (error, data, response) {
              //util.puts(data);
              res.json([data]);
        });
    }
};

exports.addFriendList = function(req, res){
    var friend = req.body.friend;
    var userId = req.session.user._id.toString();
    conn.collection('users').findOne({email: friend}, function(err, user){
        if(!err && user){
            conn.collection('friends').save({userId: userId, friendId: user._id, friendName: user.username, friendEmail: user.email}, function(err, rec){
                if(err){
                    res.json([]);
                } else {
                    res.json(["OK"]);
                }
            });
        } else {
            res.json([]);
        }
    });
};

exports.addfbfriendlist = function(req, res){
    var matchId = req.body.matchId;
    var friendId = req.session.friends[matchId];
    var userId = req.session.user._id.toString();
    conn.collection('users').findOne({_id: conn.ObjectID.createFromHexString(friendId)}, function(err, user){
        if(!err && user){
            conn.collection('friends').save({userId: userId, friendId: user._id, friendName: user.username, friendEmail: user.email}, function(err, rec){
                if(err){
                    res.json([]);
                } else {
                    res.json(["OK"]);
                }
            });
        } else {
            res.json([]);
        }
    });
};

exports.markitempurchased = function(req, res){
    var itemId = req.body.itemId.toString();
    conn.collection('items').update({_id: conn.ObjectID.createFromHexString(itemId)}, {$set: {purchased:true}}, function(err, count){
        if(err){
            res.json([]);
        } else {
            res.json(["OK"]);
        }
    });
};

exports.createlist = function(req, res){
    var listName = req.body.listName;
    conn.collection('lists').save({name: listName, userId: req.session.user._id, items: []}, function(err, list){
        if(!err && list){
            res.json(list._id);
        } else {
            res.json([]);
        }
    });
};

exports.getshoppinglist = function(req, res){
    var listId = req.body.listId.toString();
    var ids = [];
    conn.collection('lists').findOne({_id: conn.ObjectID.createFromHexString(listId)}, function(err, list){
        list.items.forEach(function(item){ ids.push(conn.ObjectID.createFromHexString(item.id)); });
        conn.collection('items').find({_id: {$in: ids}}).toArray(function(err, items){
            if(!err && items){
                items.forEach(function(item){
                    list.items.forEach(function(listItem){
                        if(item._id.toString() == listItem.id.toString()){
                            item.friendLink = listItem.link;
                        }
                    });
                });
                res.json(items);
            } else {
                res.json([]);
            }
        });
        
    });
};

exports.posttoshoppinglist = function(req, res){
    var item = req.body.itemId;
    var listId = req.body.listId.toString();
    var data = {
        id: item,
        link: ""
    };
    conn.collection('lists').update({_id: conn.ObjectID.createFromHexString(listId)}, {$push: {items: data}}, function(err, list){
        if(!err && list){
            res.json(['OK']);
        } else {
            res.json([]);
        }
    });
};

exports.addlistlink = function(req, res){
    var itemId = req.body.itemId;
    var listId = req.body.listId;
    var link = req.body.link;
    conn.collection('lists').update({_id: conn.ObjectID.createFromHexString(listId), "items.id": itemId}, {$set: {"items.$.link": link }}, function(err, list){
        if(!err && list){
            res.json(['OK']);
        } else {
            res.json([]);
        }
    });
};

exports.register = function(req, res){
    var existingUser;
    var username = req.body.name;
    var email = req.body.email;
    var pass = req.body.pass;
    var data = {
      username: username,
      email: email,
      pass: pass
    };
    
    conn.collection('users').findOne({email: data.email}, function(err, user){ 
        existingUser = user;
        if(!existingUser){
            conn.collection('users').save(data, function(err, user){
                if(!err && user){
                    req.session.auth = true;
                    req.session.user = user;
                    req.session.username = data.username;
                    req.session.userId = user._id;
                    res.json(['OK']);
                } else {
                    res.json([]);
                }
            });            
        }
        res.json([]);
    });    
    //res.json([]);
};

exports.signin = function(req, res){
    var existingUser;
    var email = req.body.username;
    var password = req.body.password;
    if(req.form.isValid){
        //todo: this is wrong, all assignments should be done in callback function
        conn.collection('users').findOne({username: email, pass: password}, function(err, user){ 
                existingUser = user;
                if(existingUser){
                    req.session.user = user;
                    req.session.username = email;
                    req.session.userId = existingUser._id;
                    req.session.auth = true;
                    res.json(['OK']);
                    return;
                }
                res.json([]);
                //console.log(user);
        });
    } else {
        res.json({errors: req.form.errors});
    }
};

exports.fbsignin = function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    var friends = req.body.friends;
    var data = {
      username: username,
      email: email,
      pass: password
    };
    conn.collection('users').findOne({email: email}, function(err, user){
        if(!err){
            if(user){
                req.session.user = user;
                conn.collection('users').find({fbId: {$in: friends}}).toArray(function(err, users){
                    if(!err && users){
                        req.session.friends = users;
                        req.session.auth = true;
                        res.json(["OK"]);
                    } else {
                        //res.json([]);
                    }
                });
            } else {
                conn.collection('users').save(data, function(err, user){
                    if(!err && user){
                        req.session.user = user;
                        conn.collection('users').find({fbId: {$in: friends}}).toArray(function(err, users){
                            if(!err && users){
                                req.session.friends = users;
                                res.json(["OK"]);
                            } else {
                                //res.json([]);
                            }
                        });
                    } else {
                        //err saving
                    }
                });
            }
        } else {
            //err on lookup
        }
    });
};

exports.facebook = function(req, res){
    var output = '';
    var friends = [];
    var authInfo = req.getAuthDetails();
    req.session.user = {};
    req.session.oauth = {};
    req.session.oauth.facebook_oauth_token = req.session.access_token;
    var options = {
        host: "graph.facebook.com",
        path: "/me/friends?access_token=" + req.session.access_token + "",
        method: 'GET'
    };
    var fbreq = https.request(options, function(response){
        response.setEncoding('utf8');
        response.on('data', function (chunk) {
            //res.json(chunk);
            output += chunk;
        });
        
        response.on('end', function(){
            var data = output;
            var userData = {
              username: authInfo.user.first_name + " " + authInfo.user.last_name,
              email: authInfo.user.email,
              pass: 'fb_user'
            };
            if(data){
                /**** new ****/
                for(var friend in data){
                    friends.push(data[friend].id);
                }
                conn.collection('users').findOne({email: userData.email}, function(err, user){
                    if(!err){
                        //console.log(user._id);
                        //console.log(req.session);
                        //console.log("req.sessionID "  + req.sessionID);
                        if(user){
                            req.session.user = user;
                            conn.collection('users').find({fbId: {$in: friends}}).toArray(function(err, users){
                                if(!err && users){
                                    req.session.friends = users;
                                    req.session.auth = true;
                                    exports.dashboard(req, res);
                                } else {
                                    //res.json([]);
                                }
                            });
                        } else {
                            conn.collection('users').save(userData, function(err, user){
                                if(!err && user){
                                    req.session.user = user;
                                    conn.collection('users').find({fbId: {$in: friends}}).toArray(function(err, users){
                                        if(!err && users){
                                            req.session.friends = users;
                                            exports.dashboard(req, res);
                                        } else {
                                            //res.json([]);
                                        }
                                    });
                                } else {
                                    //err saving
                                }
                            });
                        }
                    } else {
                        //err on lookup
                    }
                });
                /**** end ****/
                //res.write(data);
                //res.end();
            } else {
                res.write('');
            }
        });
    });
    
    fbreq.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });
    fbreq.write('');
    fbreq.end();
};

exports.signedfb = function(req, res){
    res.send("success" );
};

exports.twittersignin = function(req, res){
   
};

exports.twitterdashboard = function(req, res){
    var authInfo = req.getAuthDetails();
    req.session.oauth = {};
    req.session.oauth.twitter_oauth_token = authInfo.twitter_oauth_token;
    req.session.oauth.twitter_oauth_token_secret = authInfo.twitter_oauth_token_secret;
    res.send( JSON.stringify( req.getAuthDetails()) );
};

exports.searchamazon = function(req, res){
    var keywords = req.body.keywords;
    opHelper.execute('ItemSearch', {
    'SearchIndex': 'Blended',
    'Keywords': keywords,
    'ResponseGroup': 'ItemAttributes,Offers'
    }, function(error, results) {
        if (error) { console.log('Error: ' + error + "\n"); }
        //console.log("Results:\n" + util.inspect(results) + "\n");
        res.json(results);
    });
};

exports.searchretailigence = function(req, res){
    var output = "";
    var location, range, keywords;
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;
    keywords = req.body.keywords;
    location = latitude.toString() + "," + longitude.toString();
    range = 50;
    var retailigence = "apitest.retailigence.com"; 
    var requestorid = "3e52c040-067f-11e2-892e-0800200c9a66";
    var path="/v1.2/products?format=json&apikey=S5t304750JKlOlfE6rCWRjveavEPuBzF&requestorid={0}";
    path = path.replace("{0}", requestorid);
    var query="&location={0}&Range={1}&keywords={2}";
    query = query.replace("{0}", location).replace("{1}", range).replace("{2}", keywords);
    var options = {
          host: retailigence,
          path: path + query,
          method: 'GET'
        };
    console.log(options);
    var retailreq = http.server.request(options, function(response){
        //console.log("res " + res);
        response.setEncoding('utf8');
        response.on('data', function (chunk) {
            //res.json(chunk);
            output += chunk;
        });
        
        response.on('end', function(){
            var data = JSON.parse(output);
            res.json(data); 
        });
        //response.end();
    });
    
    retailreq.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });
    
    retailreq.write('');
    retailreq.end();
};