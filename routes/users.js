var express = require('express')
var router = express.Router()
const User= require('../model/user')
const bcrypt = require('bcrypt')
const Joi = require('joi')
const jwt = require('jsonwebtoken');



/**
 * User Login route
 */
router.post('/login', async function(req, res, next) {
  try {

    const schema = Joi.object({
      username: Joi.string().min(3).max(30).required(),
      password: Joi.string().min(6).max(30).required()
    })
  const {username,password} = await schema.validateAsync(req.body)
  const user = await User.findOne({ username })

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const passwordMatch = await bcrypt.compare(password, user.password)

  if (!passwordMatch) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const secretKey=process.env.SECRETKEY
  console.log(user,'secretKey')
  const user_id=user._id
  const token = jwt.sign({ username,user_id }, secretKey, { expiresIn: '1h' })

  res.json({ token })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })

  }

})


/**
 * User register route
 */
router.post('/register', async (req, res) => {

  try {
    const schema = Joi.object({
      username: Joi.string().min(3).max(30).required(),
      password: Joi.string().min(6).max(30).required()
    })
    const {username,password}=await schema.validateAsync(req.body)

    // if(!(username && password)){
    //   return res.status(400).json({ message: 'username & password Required' })

    // }


    const existingUser = await User.findOne({ username })

    if (existingUser) {
      return res.status(400).json({ message: 'User already registered' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({ username, password: hashedPassword })
    await newUser.save()

    res.status(201).json({ message: 'User registered successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error?.message || 'Internal Server Error' })
  }
})

module.exports = router
