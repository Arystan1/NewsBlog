var express = require('express');
var http = require('http');
//var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var mysql = require('mysql2');
var fs = require('fs');
var builder = require('xmlbuilder');
var DOMParser = require('xmldom').DOMParser;
var xml2js = require('xml2js');
var download = require('download');
var decode = require('ent').decode;

var xml_parser = new xml2js.Parser();


//Conection to database
const connection = mysql.createConnection({
    host: 'linux-pc',
    user: 'root',
    password: 'lossantos99',
    database: 'NewsBlog'
});

const acc_connection = mysql.createConnection({
    host: 'linux-pc',
    user: 'root',
    password: 'lossantos99',
    database: 'accounts'
});


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
app.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({ extended: false });
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function cutImageLink(link) {
    var cuttedLink = link.substring(32, 300);
    var n = cuttedLink.indexOf('\"');

    return cuttedLink.substring(0, n);
}

function fixVideos(text) {
    text = text.replace('<oembed url=', '<iframe src=');
    text = text.replace('watch?v=', 'embed/');
    text = text.replace('></oembed>', ' allow=\"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen=\"\" width=\"560\" height=\"315\" frameborder=\"1\"></iframe>');

    return text;
}

function fixImages(text) {
    let addition = ' style=\"display: block; margin-left: auto; margin-right: auto;\" width=\"60%\"';
    let tmpSize = '<figure class=\"image\"><img src='.length;
    let pos = 0;

    while(pos >= 0) {
      pos = text.indexOf('<figure class=\"image\"><img src=');
      if(pos < 0){
          continue;
      }
      text = text.slice(0, pos + tmpSize - 4) + addition + text.slice(pos + tmpSize - 5);
    }

    return text;
}

function fixContent(text, title, img, params) {
    if(params == 'news')
    {
        text = '<div id=\"single_news_flex_container\">' + '<figure class=\"image\"><img style=\"display: block; margin-left: auto; margin-right: auto;\" src=\"' + img + '\"  width=\"60%\"></figure>' + '<h1>' + title + '</h1>' + text + '</div>';
    }
    else if (params == 'articles') {
        text = '<div id=\"single_articles_flex_container\">' + '<figure class=\"image\"><img style=\"display: block; margin-left: auto; margin-right: auto;\" src=\"' + img + '\"  width=\"60%\"></figure>' + '<h1>' + title + '</h1>' + text + '</div>';
    }
    else if (params == 'video') {
        text = '<div id=\"single_video_flex_container\">' + '<figure class=\"image\"><img style=\"display: block; margin-left: auto; margin-right: auto;\" src=\"' + img + '\"  width=\"60%\"></figure>' + '<h1>' + title + '</h1>' + text + '</div>';
    }

    return text;
}

function fixLength(array){
  let len = array.length;

  if(len < 3){
      len = 0;
  }
  else if(len >= 3){
      len -= 3;
  }
  return len;
}

function getNews(){

    tArrayNews = [];

    connection.query(
        'SELECT * FROM news',
        function(err, results, fields) {
            for(var key = 0; key < Object.size(results); key++){

              index = {
                  id: results[key].id,
                  title: results[key].title,
                  text: results[key].html_text,
                  date: results[key].date,
                  short: results[key].short,
                  img: results[key].img,
                  size: Object.size(results)
              }

              tArrayNews.push(index);

            }

            if(Object.size(results) == 0){
              index = {
                  id: '',
                  title: '',
                  text: '',
                  date: '',
                  short: '',
                  img: '',
                  size: Object.size(results)
              }
              tArrayNews.push(index);
            }

            return tArrayNews;
        }

    );
}

function getArticles(){

  tArrayArticle = [];

  connection.query(
      'SELECT * FROM articles',
      function(err, results, fields) {
          for(var key = 0; key < Object.size(results); key++){

            index = {
                id: results[key].id,
                title: results[key].title,
                text: results[key].html_text,
                date: results[key].date,
                short: results[key].short,
                img: results[key].img,
                size: Object.size(results)
            }

            tArrayArticle.push(index);

          }

          if(Object.size(results) == 0){
            index = {
                id: '',
                title: '',
                text: '',
                date: '',
                short: '',
                img: '',
                size: Object.size(results)
            }
            tArrayArticle.push(index);
          }

          return tArrayArticle;
      }

  );

}

function getVideo(){

    tArrayVideo = [];

    connection.query(
        'SELECT * FROM video',
        function(err, results, fields) {
            for(var key = 0; key < Object.size(results); key++){

              index = {
                  id: results[key].id,
                  title: results[key].title,
                  text: results[key].html_text,
                  date: results[key].date,
                  short: results[key].short,
                  img: results[key].img,
                  size: Object.size(results)
              }

              tArrayVideo.push(index);

            }

            if(Object.size(results) == 0){
              index = {
                  id: '',
                  title: '',
                  text: '',
                  date: '',
                  short: '',
                  img: '',
                  size: Object.size(results)
              }
              tArrayVideo.push(index);
            }

            return tArrayVideo;
        }

    );

}

app.get('/news', function(req, res) {

    ArrayNews = [];

    connection.query(
        'SELECT * FROM news',
        function(err, results, fields) {
            for(var key = 0; key < Object.size(results); key++){

              index = {
                  id: results[key].id,
                  title: results[key].title,
                  text: results[key].html_text,
                  date: results[key].date,
                  short: results[key].short,
                  img: results[key].img,
                  size: Object.size(results)
              }

              ArrayNews.push(index);

            }

            if(Object.size(results) == 0){
              index = {
                  id: '',
                  title: '',
                  text: '',
                  date: '',
                  short: '',
                  img: '',
                  size: Object.size(results)
              }
              ArrayNews.push(index);
            }

            res.render('news', ArrayNews);

            return;
        }

    );


});

app.get('/article', function(req, res){

    ArrayArticle = [];

    connection.query(
        'SELECT * FROM articles',
        function(err, results, fields) {
            for(var key = 0; key < Object.size(results); key++){

              index = {
                  id: results[key].id,
                  title: results[key].title,
                  text: results[key].html_text,
                  date: results[key].date,
                  short: results[key].short,
                  img: results[key].img,
                  size: Object.size(results)
              }

              ArrayArticle.push(index);

            }

            if(Object.size(results) == 0){
              index = {
                  id: '',
                  title: '',
                  text: '',
                  date: '',
                  short: '',
                  img: '',
                  size: Object.size(results)
              }
              ArrayArticle.push(index);
            }

            res.render('article', ArrayArticle);

            return;
        }

    );

});

app.get('/video', function(req, res){

    ArrayVideo = [];

    connection.query(
        'SELECT * FROM video',
        function(err, results, fields) {
            for(var key = 0; key < Object.size(results); key++){

              index = {
                  id: results[key].id,
                  title: results[key].title,
                  text: results[key].html_text,
                  date: results[key].date,
                  short: results[key].short,
                  img: results[key].img,
                  size: Object.size(results)
              }

              ArrayVideo.push(index);

            }

            if(Object.size(results) == 0){
              index = {
                  id: '',
                  title: '',
                  text: '',
                  date: '',
                  short: '',
                  img: '',
                  size: Object.size(results)
              }
              ArrayVideo.push(index);
            }

            res.render('video', ArrayVideo);

            return;
        }

    );

});

app.get('/writenews', function(req, res) {

    res.render('writenews');

});

app.get('/writearticles', function(req, res) {

    res.render('writearticles');

});

app.get('/writevideo', function(req, res) {

    res.render('writevideo');

});

app.post('/writenews', function(req, res) {

    news = {
        title : req.body.main_title.replace(/(<[^>]+>)/ig,""),
        html_text : fixImages(fixVideos(req.body.html)),
        date : new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
        short : req.body.html.replace(/(<[^>]+>)/ig,"").substring(0, 121) + '...',
        img : cutImageLink(req.body.main_img)
    }

    news.html_text = fixContent(news.html_text, news.title, news.img, 'news');

    connection.query(
        'INSERT INTO news(title, html_text, date, short, img) VALUES(?, ?, ?, ?, ?)',
        [news.title, news.html_text, news.date, news.short, news.img], function(err, results, fields) {
            console.log('News was written');

            return;
        }
    )


});

app.post('/writearticles', function(req, res) {

    articles = {
        title : req.body.main_title.replace(/(<[^>]+>)/ig,""),
        html_text : fixImages(fixVideos(req.body.html)),
        date : new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
        short : req.body.html.replace(/(<[^>]+>)/ig,"").substring(0, 121) + '...',
        img : cutImageLink(req.body.main_img)
    }

    articles.html_text = fixContent(articles.html_text, articles.title, articles.img, 'articles');

    connection.query(
        'INSERT INTO articles(title, html_text, date, short, img) VALUES(?, ?, ?, ?, ?)',
        [articles.title, articles.html_text, articles.date, articles.short, articles.img], function(err, results, fields) {
            console.log('Article was written');

            return;
        }
    )

});

app.post('/writevideo', function(req, res) {

    video = {
        title : req.body.main_title.replace(/(<[^>]+>)/ig,""),
        html_text : fixImages(fixVideos(req.body.html)),
        date : new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
        short : req.body.html.replace(/(<[^>]+>)/ig,"").substring(0, 121) + '...',
        img : cutImageLink(req.body.main_img)
    }

    video.html_text = fixContent(video.html_text, video.title, video.img, 'video');

    connection.query(
        'INSERT INTO video(title, html_text, date, short, img) VALUES(?, ?, ?, ?, ?)',
        [video.title, video.html_text, video.date, video.short, video.img], function(err, results, fields) {
            console.log('video was written');

            return;
        }
    )

});
//Main page
app.get('/', function(req, res) {

    ArrayNews = [];

    connection.query(
        'SELECT * FROM news',
        function(err, results, fields) {
            for(var key = 0; key < Object.size(results); key++){

              index = {
                  id: results[key].id,
                  title: results[key].title,
                  text: results[key].html_text,
                  date: results[key].date,
                  short: results[key].short,
                  img: results[key].img,
                  size: Object.size(results)
              }

              ArrayNews.push(index);

            }

            if(Object.size(results) == 0){
              index = {
                  id: '',
                  title: '',
                  text: '',
                  date: '',
                  short: '',
                  img: '',
                  size: Object.size(results)
              }
              ArrayNews.push(index);
            }

            res.render('news', ArrayNews);

            return;
        }

    );



/*
    tArrayNews = [];

    connection.query(
        'SELECT * FROM news',
        function(err, results, fields) {
            for(var key = 0; key < Object.size(results); key++){

              index = {
                  id: results[key].id,
                  title: results[key].title,
                  text: results[key].html_text,
                  date: results[key].date,
                  short: results[key].short,
                  img: results[key].img,
                  size: Object.size(results)
              }

              tArrayNews.push(index);

            }

            if(Object.size(results) == 0){
              index = {
                  id: '',
                  title: '',
                  text: '',
                  date: '',
                  short: '',
                  img: '',
                  size: Object.size(results)
              }
              tArrayNews.push(index);
            }

            //end of news
              tArrayArticle = [];

              connection.query(
                  'SELECT * FROM articles',
                  function(err, results, fields) {
                      for(var key = 0; key < Object.size(results); key++){

                        index = {
                            id: results[key].id,
                            title: results[key].title,
                            text: results[key].html_text,
                            date: results[key].date,
                            short: results[key].short,
                            img: results[key].img,
                            size: Object.size(results)
                        }

                        tArrayArticle.push(index);

                      }

                      if(Object.size(results) == 0){
                        index = {
                            id: '',
                            title: '',
                            text: '',
                            date: '',
                            short: '',
                            img: '',
                            size: Object.size(results)
                        }
                        tArrayArticle.push(index);
                      }

                    //end of articles
                        tArrayVideo = [];

                        connection.query(
                            'SELECT * FROM video',
                            function(err, results, fields) {
                                for(var key = 0; key < Object.size(results); key++){

                                  index = {
                                      id: results[key].id,
                                      title: results[key].title,
                                      text: results[key].html_text,
                                      date: results[key].date,
                                      short: results[key].short,
                                      img: results[key].img,
                                      size: Object.size(results)
                                  }

                                  tArrayVideo.push(index);

                                }

                                if(Object.size(results) == 0){
                                  index = {
                                      id: '',
                                      title: '',
                                      text: '',
                                      date: '',
                                      short: '',
                                      img: '',
                                      size: Object.size(results)
                                  }
                                  tArrayVideo.push(index);
                                }

                                //end of videos

                                //fix news length
                                tArrayNews[0].size = fixLength(tArrayNews);

                                //fix articles length
                                tArrayArticle[0].size = fixLength(tArrayArticle);

                                //fix videos length
                                tArrayVideo[0].size = fixLength(tArrayVideo);
                                console.log(tArrayNews[0].size);
                                console.log(tArrayArticle[0].size);
                                console.log(tArrayVideo[0].size);
                                console.log('--------------');
                                console.log(tArrayNews[1].size);
                                console.log(tArrayArticle[1].size);
                                console.log(tArrayVideo[1].size);
                                res.render('index', tArrayNews, tArrayArticle, tArrayVideo);

                                return;
                            }

                        );

                }

            );
        }

    );




    ArrayNews = getNews();
    ArrayArticle = getArticles();
    ArrayVideo = getVideo();

    //fix news length
    ArrayNews[0].size = fixLength(ArrayNews);

    //fix articles length
    ArrayArticle[0].size = fixLength(ArrayArticle);

    //fix videos length
    ArrayVideo[0].size = fixLength(ArrayVideo);

    res.render('index', ArrayNews, ArrayArticle, ArrayVideo);
*/
});


//Article page
app.get('/news/:id', function(req, res) {

    id = req.params.id;

    connection.query(
        'SELECT * FROM news WHERE id = ?', [id], function(err, results, fields){

        }
    )

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

    acc_connection.query(
        'SELECT * FROM accounts_data WHERE account_email = ?', [req.body.email],
        function(err, results, fields) {
          if(Object.size(results) > 0)
            {
                if(results[0].account_password == req.body.password)
                {
                    console.log("The passwords is equal");

                    res.send({
                        status: 'Вы успешно вошли на сайт'
                    });

                    return;
                }
                else{
                    console.log("The passwords is NOT equal");
                    res.send({
                        status: 'Вы ввели не верный пароль!'
                    });

                    return;
                }
            }
        }
    );


})

app.post('/signin', urlencodedParser, function(req, res) {

    var nickname = req.body.nickname;
    var email = req.body.email;
    var password = req.body.password;

    acc_connection.query(
        'SELECT account_email FROM accounts_data WHERE account_email = ?', [email],
        function(err, results, fields){

            if (results <= 0)
            {
                connection.query(
                    'INSERT INTO accounts_data(account_nickname, account_email, account_password) VALUES(?, ?, ?)',
                    [nickname, email, password], function(err, results, fields) {
                        console.log('account registered');
                        res.send({
                            status: 'Поздравляем! Ваш аккаунт зарегистрирован!'
                        });

                        return;
                    }
                )
            }
            else
            {

                console.log('account dont registered');
                res.send({
                    status: 'Аккаунт с данной почтой уже есть в системе! \nИзмените почту!'
                });

                return;
            }

        }
    );

})

app.listen('3000');
