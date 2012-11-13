
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , form = require('express-form')
  , field = form.field
  , auth = require('connect-auth')
  , keys = require('./keys');

var app = express();

var MemStore = express.session.MemoryStore;

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('facebook', {
      appId: keys.fbId,
      appSecret: keys.fbSecret,
      scope: 'email',
      callback: keys.fbCallbackAddress
  });

  app.set('twitter', {
    consumerKey:  keys.twitterConsumerKey,
    consumerSecret: keys.twitterConsumerSecret
  });
  
  //app.register('.html', require('jade'));
  //app.use(function(req, res, next) {
    //if(!req._parsedUrl.pathname.match(/^[a-z0-9\/]+$/i)) return res.send(403);
    //next();
  //});
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());  
  app.use(express.cookieParser());
  app.use(express.session({secret: "spock the cat", store: MemStore({reapInterval: 60000 * 10})}));
  app.use(auth( { strategies: [
    auth.Facebook(app.settings.facebook),
    auth.Twitter(app.settings.twitter)
  ],
  logoutHandler: require('connect-auth/lib/events').redirectOnLogout("/")}) );
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/channel.html', function(req, res){
    res.render('channel');
});
app.get('/dashboard', routes.dashboard);
app.get('/friendlist/:email', routes.friendlist);
app.get('/facebook', checkAuth, routes.facebook);
app.post('/facebook', routes.signedfb);
app.get('/twittersignin', checkAuth, routes.twittersignin);
app.get('/twitterdashboard', routes.twitterdashboard);
app.post('/fbfriendlist', routes.fbfriendlist);
app.post('/addfbfriendlist', routes.addfbfriendlist);
app.post('/getfbfriendlist', routes.getfbfriendlist);
app.get('/friends', routes.friends);
app.post('/register', routes.register);
app.post(
    '/signin', 
    form(
        field("username").trim().required("Username Required"),
        field("password").trim().required("Password Required")
      ),
    routes.signin
);
app.post('/fbsignin', routes.fbsignin);
app.post('/additem', routes.addListItem);
app.post('/addfriendlist', routes.addFriendList);
app.post('/getfriendlist', routes.getFriendList);
app.post('/markitempurchased', routes.markitempurchased);
app.post('/amazonsearch', routes.searchamazon);
app.post('/createlist', routes.createlist);
app.post('/getshoppinglist', routes.getshoppinglist);
app.post('/posttoshoppinglist', routes.posttoshoppinglist);
app.post('/addlistlink', routes.addlistlink);
app.post('/searchretailigence', routes.searchretailigence);
app.post('/addlink', routes.addlink);

function checkAuth(req, res, next){
    console.log("sessionID " + req.sessionID);
    if(req.isAuthenticated()) next();
    else {
        req.authenticate(function(error, authenticated) {
            if( error ) next(new Error("Problem authenticating"));
             else {
                if( authenticated === true) next();
                else if( authenticated === false ) next(new Error("Access Denied!"));
                else {
                  // Abort processing, browser interaction was required (and has happened/is happening)
                }
            }
        });
    }
}

var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

exports.server = http;