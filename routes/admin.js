const express = require('express')
const router = express.Router()
const db = require('../db')
const formidable = require('formidable')
const fs = require('fs')
const path = require('path')

router.get('/', (req, res, next) => {
  if (!req.session.isAdmin) {
    res.redirect('/login')
  }

  res.render('pages/admin', {
    title: 'Admin page',
    msgskill: req.flash('msgskill')[0],
    msgfile: req.flash('msgfile')[0],
    skills: db.get('skills').value(),
  })
  
})

router.post('/skills', (req, res, next) => {
  const { age, concerts, cities, years } = req.body
  db.set('skills[0]', {
    number: age,
    text: 'Возраст начала занятий на скрипке',
  }).write()
  db.set('skills[1]', { number: concerts, text: 'Концертов отыграл' }).write()
  db.set('skills[2]', {
    number: cities,
    text: 'Максимальное число городов в туре',
  }).write()
  db.set('skills[3]', {
    number: years,
    text: 'Лет на сцене в качестве скрипача',
  }).write()

  req.flash('msgskill', 'Счетчики успешно обновлены!')
  return res.redirect('/admin')
})

router.post('/upload', (req, res, next) => {
  const form = new formidable.IncomingForm()
  // const upload = path.join('./public', './assets/img/products')
  const uploadDir = path.join(process.cwd(), './upload')

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir)
  }

  form.parse(req, (err, fields, files) => {
    if (err) {
      req.flash('msgfile', 'При загрузке произошла ошибка!')
      res.redirect('/admin')
    }

    const { name, price } = fields
    const originalExt = path.extname(files.photo.originalFilename)
    const fileName = path.join(uploadDir, `${files.photo.newFilename}${originalExt}`)
    const dirPhoto = files.photo.newFilename

    fs.renameSync(files.photo.filepath, fileName)
    db.defaults({ products: [] })
      .get('products')
      .push({
        src: `${dirPhoto}${originalExt}`,
        name: name,
        price: Number(price),
      })
      .write()
    req.flash('msgfile', 'Товар успешно добавлен!')
    res.redirect('/admin')
  })
})

module.exports = router
