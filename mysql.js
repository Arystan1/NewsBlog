mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'linux-pc',
    user: 'root',
    password: 'lossantos99',
    database: 'accounts'
});

    var nickname = 'qqqq';
    var email = 'aqaa';
    var password = 'vvv';

    connection.query(
        'SELECT account_email FROM accounts_data WHERE account_email = ?', [email],
        function(err, results, fields){

            if (results <= 0)
            {
                connection.query(
                    'INSERT INTO accounts_data(account_nickname, account_email, account_password) VALUES(?, ?, ?)',
                    [nickname, email, password], function(err, results, fields) {
                        console.log('account registered');
                        console.log(results);
                    }
                )
            }
            else
            {
                console.log('account dont registered');
                console.log(results);
            }

        }
    );
