require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

const checkAuthRoute = require('./routes/checkAuth')

const categoriesRoute = require('./routes/categories')
const postsRoute = require('./routes/posts')
const usersRoute = require('./routes/users')
const rolesRoute = require('./routes/roles')
const path = require('path')
const cors = require('cors')

const app = express()

app.use(cors({
  origin: 'https://whatnew.onrender.com'
}))

app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())

// app.use(express.static(__dirname + '/public'))
// app.use('/uploads', express.static('uploads'))

app.use('/api/checkauth', checkAuthRoute)

app.use('/api/categories', categoriesRoute)
app.use('/api/posts', postsRoute)
app.use('/api/users', usersRoute)
app.use('/api/roles', rolesRoute)

app.use(express.static(path.join(__dirname, "/client/build")));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build', 'index.html'));
});

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500
  const errorMessage = err.message || 'Something went wrong!'
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack
  })
})

// connect to db
mongoose.connect(process.env.MONG0_URI)
  .then(() => {
    console.log('connected to db')
    // listen for requests
    app.listen(process.env.PORT || 5000, () => {
      console.log(`server running on port: ${process.env.PORT}`)
    })
  }).catch((error) => {
    console.log(error)
  })