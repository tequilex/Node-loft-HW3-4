const createError = require('http-errors')
const express = require('express')
const session = require('express-session')
const path = require('path')
const logger = require('morgan')
const flash = require('connect-flash')
const mainRouter = require('./routes/')
require('dotenv').config()

const app = express()
app.use(flash())
// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

process.env.NODE_ENV === 'development'
  ? app.use(logger('dev'))
  : app.use(logger('short'))

app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: 'world',
    name: 'isAdmin',
    cookie: {
      path: '/',
      httpOnly: true,
      maxAge: 5000000,
    },
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, 'public')))

app.use('/', mainRouter)

// catch 404 and forward to error handler
app.use((req, __, next) => {
  next(
    createError(404, `Ой, извините, но по пути ${req.url} ничего не найдено!`)
  )
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

app.listen(3000, () => console.log('Server listens http://localhost:3000'))
