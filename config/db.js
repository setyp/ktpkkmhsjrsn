let mysql = require('mysql');

// membuat variable connection yang isinya konfigurasi dari koneksi database MySQL
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hendroexpress'
});

// membuat kondisi untuk melihat apakah koneksi berjalan atau tidak
connection.connect(function (error) {
    if (!!error) {
        console.log(error);
    } else {
        console.log('Koneksi sukses');
    }
});

// kita export module connection agar bisa digunakan di file lain
module.exports = connection;
