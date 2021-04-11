const mysql = require('mysql');

const db = mysql.createConnection({
    host     : process.env.DBHOST,
    user     : process.env.DBUSER,
    password : process.env.DBPWD,
    database : process.env.DB
  });


db.connect((err)=>{
        if (err) return console.log(`Can't connect to Database`,err)
        console.log(`Database connected`)
})




module.exports = db