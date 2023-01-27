const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  if (req.session.isAdmin) {
    res.redirect('/admin')
  }
  res.render('pages/login', {
    title: 'SigIn page',
    msglogin: req.flash('msglogin')[0],
  })
})

router.post('/', (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  const dbEmail = process.env._EMAIL
  const dbPassword = process.env._PASSWORD

  if (dbEmail === email && dbPassword === password) {
    req.session.isAdmin = true
    res.redirect('/admin')
  } else {
    req.flash('msglogin', 'Неправильный логин или пароль')
    res.redirect('/login')
  }
})

module.exports = router
