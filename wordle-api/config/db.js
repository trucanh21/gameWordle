const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Jiyeon12345!', // Thay đổi mật khẩu MySQL của bạn
    database: 'wordle_game',
});

module.exports = pool.promise(); 