const mysql = require('mysql');
const util = require('util') 

const db = mysql.createConnection({
    host     : process.env.DBHOST,
    user     : process.env.DBUSER,
    password : process.env.DBPWD,
    database : process.env.DB
  });


db.connect((err)=>{
        if (err) return console.log(`Can't connect to Database`)
        console.log(`Database connected`)
})

const query = util.promisify(db.query).bind(db)



module.exports = query

