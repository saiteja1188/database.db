const express = require('express')
const path = require('path')
const {open} = require('sqlite')
const sqlite3 = require("sqlite3")
const cors = require('cors')
const bcrypt = require('bcrypt')


const app = express()
app.use(cors())
app.use(express.json())

const dbPath = path.join(__dirname, 'database.db')

let db = null

const initializeDBAndServer = async () => {
    try{
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        })
        app.listen(3007, () =>{
            console.log("Server is running at http://localhost:3007")
        })
    }catch(e){
        console.log(`DB Error: ${e.message}`)
        process.exit(1)
    }
}

initializeDBAndServer()

app.get('/users', async(req, res)=>{
    const getQuery = `SELECT * FROM user`;
    const userArray = await db.all(getQuery)
    res.send(userArray)
    
})

app.get('/foods', async(req, res)=>{
    const getQuery = `SELECT * FROM food`;
    const userArray = await db.all(getQuery)
    res.send(userArray)
    
})

app.get('/empl', async(req, res)=>{
    const getQuery = `SELECT * FROM Employee`;
    const userArray = await db.all(getQuery)
    res.send(userArray)
    
})

app.post('/users/', async (request, response) => {
    const {id, username,  password, } = request.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const selectUserQuery = ` SELECT * FROM user WHERE username = '${username}'; `
    const dbUser = await db.get(selectUserQuery)
  
    if (dbUser === undefined) {
      const createUserQuery = `
      INSERT INTO user (id, username,  password)
      VALUES ( '${id}', '${username}', '${hashedPassword}' )
       ;`
      await db.run(createUserQuery)
      response.send('User created successfully')
    } else {
      response.status(400)
      response.send('user already exists')
    }
  })