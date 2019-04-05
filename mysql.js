mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'linux-pc',
    user: 'root',
    password: 'lossantos99',
    database: 'NewsBlog'
});

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

    var nickname = 'qqqq';
    var email = 'aqaa';
    var password = 'vvv';

    connection.query(
        'SELECT * FROM news',
        function(err, results, fields){

          console.log(Object.size(results));
          /*  if (results <= 0)
            {
                connection.query(
                    'INSERT INTO accounts_data(account_nickname, account_email, account_password) VALUES(?, ?, ?)',
                    [nickname, email, password], function(err, results, fields) {
                        console.log('account registered');
                        console.log(results);
                        console.log(err);
                    }
                )
            }
            else
            {
                console.log('account dont registered');
                console.log(results);
            }*/

        }
    );
