var express = require('express');
var http = require('http');
//var io = require('socket.io')(http);
//var bodyParser = require('body-parser');
//var mysql = require('mysql2');
var fs = require('fs');
var xml2js = require('xml2js');
var download = require('download');

var xml_parser = new xml2js.Parser();

/*
//Conection to database
const connection = mysql.createConnection({
    host: 'linux-pc',
    user: 'root',
    password: 'lossantos99',
    database: 'accounts'
});
*/


//Initialize settings
var app = express();

app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));

/*app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Credentials", 'true');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});*/
//app.use(bodyParser.json());
//var urlencodedParser = bodyParser.urlencoded({ extended: false });
//download('https://rss.stopgame.ru/rss_news.xml').pipe(fs.createWriteStream('rss_news.xml'));
fs.readFile(__dirname + '/rss_news.xml', function(err, data) {
    
    xml_parser.parseString(data, function(err, result) {
       
        var items = result['rss']['channel']['0']['item'];
        ArrayNews = [];

        for(var i = 0; i < 30; i++) {

            index = String(i);
            index = {
                img: items[i]['enclosure']['0']['$']['url'],
                title: items[i]['title']['0'], 
                text_without_symbol: items[i]['description']['0'].replace(/(<[^>]+>)/ig,""),
                short: items[i]['description']['0'].replace(/(<[^>]+>)/ig,"").substring(0, 121) + '...',
                text: items[i]['description']['0'],
                date: items[i]['pubDate']['0']
            }

            ArrayNews.push(index);
            

        }
        //console.log(ArrayNews);
        console.log(ArrayNews[0]);
        console.log('Done');

    });

});

app.get('/news', function(req, res) {

    res.render('news', ArrayNews);

});

app.get('/writenews', function(req, res) {

    res.render('writenews');

});

//Main page
app.get('/', function(req, res) {
    
    res.render('index');

});


//Article page
app.get('/news/:id', function(req, res) {
    
    /*id = req.params.id;

    console.log(typeof id);
    console.log(typeof 2);

    if(typeof id == typeof "2" && id > 0 && id < 30) {

        main_news = {
            img: ArrayNews[id].img,
            title: ArrayNews[id].title,
            short: ArrayNews[id].label,
            text: ArrayNews[id].text,
            date: ArrayNews[id].date
        }
    
        res.render('single_news', main_news);

    } else if(id == 'news') {
        res.redirect('news');
    } else {
        res.redirect('index');
    }*/

});

app.post('/news/:id', function(req, res) {
    
    id = req.params.id;

    main_news = {
        img: ArrayNews[id].img,
        title: ArrayNews[id].title,
        short: ArrayNews[id].label,
        text: ArrayNews[id].text,
        date: ArrayNews[id].date
    }

    res.redirect('single_news', main_news);

});



















//-------------------------------------------------------------------------------------------//
//--------------------------------------OLD CODE Here----------------------------------------//
//-------------------------------------------------------------------------------------------//
/*
//Sign in page
app.get('/signin', function(req, res) {
    
    res.render('signin');

})

//Login page
app.get('/login', function(req, res) {
    
    res.render('login');

});

//On log in
app.post('/login', urlencodedParser, function(req, res) {
    
    connection.query(
        'SELECT * FROM accounts_data WHERE account_email = ?', [req.body.email],
        function(err, results, fields) {
            if(results.length > 0)
            {
                if(results[0].account_password == req.body.password)
                {
                    console.log("The passwords is equal");

                    res.send({
                        status: 'Success log in'
                    });

                    res.redirect('/');
                } 
                else{
                    console.log("The passwords is NOT equal");
                    res.send({
                        status: 'You entered wrong password'
                    });
                }
            }
        }
    );


})

app.post('/signin', urlencodedParser, function(req, res) {
   
    var nickname = req.body.nickname;
    var email = req.body.email;
    var password = req.body.password;

    connection.query(
        'SELECT account_email FROM accounts_data WHERE account_email = ?', [email],
        function(err, results, fields){

            if (results <= 0)
            {
                connection.query(
                    'INSERT INTO accounts_data(account_nickname, account_email, account_password) VALUES(?, ?, ?)',
                    [nickname, email, password], function(err, results, fields) {
                        console.log('account registered');
                        res.send({
                            status: 'Congratulations! Your account registered!'
                        });
                    }
                )
            }
            else
            {
                
                console.log('account dont registered');
                res.send({
                    status: 'Account with this account already registered! \nChange account email!'
                });

            }

        }
    );

})
*/
app.listen('3000');