const express = require('express')
const nodemailer = require('nodemailer')
const configMailer = require('../config.json')
const router = express.Router()
const db = require('../db')
const data = {
  skills: db.get('skills').value(),
  products: db.get('products').value(),
}

router.get('/', (req, res, next) => {
  res.render('pages/index', {
    title: 'Main page',
    ...data,
    msgemail: req.flash('mail')[0],
  })
})

router.post('/', (req, res, next) => {
  if (!req.body.name || !req.body.email || !req.body.message) {
    req.flash('mail', 'Необходимо заполнить все поля')

    return res.redirect('/#mail')
  }

  const transporter = nodemailer.createTransport(configMailer.mail.smtp)
  const messageConfig = {
    from: req.body.name,
    to: configMailer.mail.smtp.auth.user,
    subject: configMailer.mail.subject,
    text: req.body.message,
  }

  transporter.sendMail(messageConfig, function (error, info) {
    if (error) {
      req.flash('mail', 'При отправке письма произошла ошибка!')

      return res.redirect('/#mail')
    }
    req.flash('mail', 'Письмо успешно отправлено!')

    return res.redirect('/#mail')
  })
})

module.exports = router
