// dependencies
const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
// node packages
const path = require('path')
// Models
const Task = require('./models/task')
const { findByIdAndUpdate, findByIdAndDelete } = require('./models/task')

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
app.use(methodOverride('_method'))      // allows to override post method into other methods (put, delete)
// setting some parameters
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))
// input defines the name of parameter for the method to override with


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
app.get('/tasks/:id', async (req, res) => {
    const task = await Task.findById(req.params.id)
    res.render('tasks/show', { task })
})
// form to edit a task
app.get('/tasks/:id/edit', async (req, res) => {
    const task = await Task.findById(req.params.id)
    res.render('tasks/edit', { task })
})
// update the task in the database
app.put('/tasks/:id', async (req, res) => {
    const { title, description } = req.body.task
    await Task.findByIdAndUpdate(req.params.id, { title: title, description: description })
    res.redirect(`/tasks/${req.params.id}`)
})
// delete task from database
app.delete('/tasks/:id/delete', async (req,res) => {
    await Task.findByIdAndDelete(req.params.id)
    res.redirect('/tasks')
})

// page not found
app.all('*', (req, res) => res.send('PAGE NOT FOUND'))

// all in one error handler
app.use((err, req, res, next) => {
    console.log(err)
    res.send(err, err.stack)
})

app.listen(port, () => console.log(`Listening on port: ${port}`))