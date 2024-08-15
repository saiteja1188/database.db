const express = require('express')
const path = require('path')
const {open} = require('sqlite')
const sqlite3 = require("sqlite3")
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())

const dbPath = path.join(__dirname, 'database.db')

let db = null

const initializeDBAndServer = async () => {
    try{
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        })
        app.listen(3008, () =>{
            console.log("Server is running at http://localhost:3008")
        })
    }catch(e){
        console.log(`DB Error: ${e.message}`)
        process.exit(1)
    }
}

initializeDBAndServer()

app.get('/users', async(req, res)=>{
    const getQuery = `SELECT username FROM user`;
    const userArray = await db.all(getQuery)
    res.send(userArray)
    
})