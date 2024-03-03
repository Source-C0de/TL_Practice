const mysql = require("mysql");

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "test_db"
});

con.connect((err) => {
    if(err) throw err;
    console.log("Connected!");
    
    // con.query("CREATE DATABASE test_db", function (err, result){
    //     if(err) throw err;
    //     console.log("Database created");

    // });

});

module.exports = con;
