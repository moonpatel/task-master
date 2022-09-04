// dependencies
const express = require('express')
const mongoose = require('mongoose')
// node packages
const path = require('path')
// Models
const Task = require('./models/task')

const app = express()   // express app object
const port = 4000       // port number

// connect to MongoDB
mongoose.connect('mongodb://localhost:27017/todo')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err))

// MIDDLEWARE
// parse the req body (req.body will be undefined if case this middleware is absent)
// set extended to true to avoid deprecated error
app.use(express.urlencoded({ extended: true }))
// setting some parameters
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

// ROUTES
// home page
app.get('/', (req, res) => {
    console.log('APP IS WORKING')
    res.send('APP IS WORKING')
})

// task list
app.get('/tasks', async (req, res) => {
    const tasks = await Task.find({})
    res.render('tasks/index', { tasks })
})

// form to add a task
app.get('/tasks/new', (req, res) => {
    res.render('tasks/new')
})
// add task in database
app.post('/tasks', async (req, res) => {
    const task = new Task(req.body.task)
    console.log(task)
    await task.save()
    res.redirect('/tasks')
})
// show individual task
app.get('/tasks/:id', async (req,res) => {
    const task = await Task.findById(req.params.id)
    res.render('tasks/show', {task})
})

// page not found
app.all('*', (req, res) => res.send('PAGE NOT FOUND'))

// all in one error handler
app.use((err, req, res, next) => {
    console.log(err)
    res.send(err, err.stack)
})


app.listen(port, () => console.log(`Listening on port: ${port}`))