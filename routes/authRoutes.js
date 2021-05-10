const express = require('express')
const passport = require('passport')
const router = express.Router()

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get('/google/callback', passport.authenticate('google', { failureRedirect: 'http://localhost:3000/login' }),
  function(req, res) {
    res.redirect('http://localhost:3000/chats');
  }
)

router.get('/getUserStatus', async function (req, res) {
  if(!req?.user) {
    console.log('reject, not authorized')
    return res.status(401).send('Not authorized')
  }
  
  console.log('after status', req.user)
  res.status(200).json({ user: req.user.id, picture: req.user.picture})
  // return res.status(200).send()
})

module.exports = router;
