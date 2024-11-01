var express = require('express');
var app = express();
var session = require('express-session');
var conn = require('./dbConfig');
app.set('view engine','ejs');
app.use(session({
    secret: 'yoursecret',
    resave: true,
    saveUninitialized: true
}));
app.use('/public',express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', function (req, res){
    res.render("home");
});

app.get('/login', function(req, res) {
    res.render('login.ejs');
});

app.get('/auckland',function (req, res){
    res.render("auckland");
});
app.post('/auth',function(req,res) {
    let name = req.body.username;
    let password = req.body.password;
    if (name && password) {
        conn.query('SELECT * FROM users WHERE name=? AND password=?', [name, password]
            ,function(error, results, fields) {
                if(error) console.error(error);
                if(results.length > 0) {
                    console.log("log")
                    req.session.loggedIn = true;
                    req.session.username = name;
                    res.redirect("/members")
                } else {
                    res.send('Invalid user or wrong password');
                }
                res.end();
            }
        );
    } else {
        res.send('Please provide credentials');
        res.close();
    }
})
//Users can access this if they ar logged in
app.get('/membersOnly', function (req, res, next) {
    if (req.session.loggedin) {
        res.render('membersOnly');
    }
    else {
        res.send('Please login to view this page!');
    }
});

app.get('/auckland', function (req, res){
    res.render("auckland");
});

app.get('/beaches', function (req, res){
    res.render("beaches");
});

app.listen(3000);
console.log('Node app is running on port 3000');