var express = require('express')
var router = express.Router()
const User = require('../model/user')
const bcrypt = require('bcrypt')
const Joi = require('joi')
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/authenticate')
const Task = require('../model/task')
const { ObjectId } = require('mongodb');
const _=require('loadsh')


/**
 * Create task for logined user
 */
router.post('/create', authenticateToken, async function (req, res, next) {
  try {
    const schema = Joi.object({
      title: Joi.string().min(3).max(30).required(),
      description: Joi.string(),

    })
    const { title, description } = await schema.validateAsync(req.body)

    const user = req.user
    const createTask = new Task({
      title: title,
      description: description,
      user_id: user.user_id,
      status: description ? "in-progress" : "incomplete"
    })

    const saveData = await createTask.save()
    console.log(saveData, 'save dataa')
    res.status(201).json({ data: saveData, message: 'Task created successfully' })



  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error?.message || 'Internal Server Error' })
  }
})
router.get('/filter', authenticateToken, async function (req, res, next) {
  try {

    const user = req.user
    const schema = Joi.object({
      status: Joi.string().valid('incomplete', 'in-progress', 'completed'),
    });

    // Validate the query parameters
    const { error, value } = await schema.validate(req.query);
    console.log(value,'statusstatus')
    if (error) {
      throw Error(error.message);
    }
    let query={
      user_id: user.user_id
    }
    if(value?.status){
      query.status=value.status
    }
    const taskData = await Task.find(query).sort({ created_at: -1 })
    if (!taskData) {
      throw Error('No tasks found')
    }

    console.log(taskData, 'taskData dataa')
    res.status(201).json({ data: taskData, message: "Tasks fetched successfully" })



  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error?.message || 'Internal Server Error' })
  }
})



/**
 * Get single task information under the user
 */
router.get('/:task_id', authenticateToken, async function (req, res, next) {
  try {
    const schema = Joi.object({
      task_id: Joi.string(),

    })
    console.log(req.params)
    const { task_id } = await schema.validateAsync(req.params)
    console.log(task_id)
    const user = req.user
    const taskData = await Task.findOne({ _id: ObjectId(task_id), user_id: user.user_id })
    if (!taskData) {
      throw Error('No task found')
    }

    console.log(taskData, 'taskData dataa')
    res.status(200).json({ data: taskData, message: "Task fetched successfully" })



  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error?.message || 'Internal Server Error' })
  }
})



/**
 * Edit A task
 */
router.put('/:task_id', authenticateToken, async function (req, res, next) {
  try {
    const { task_id } = req.params;
    const user = req.user
    const { title, description, status } = req.body;


    if (!task_id) {
      throw Error('Task Id required')

    }

    if (status && !(["incomplete", "in-progress", "completed"].includes(status))) {
      throw Error("Task status should be either in incomplete ,in-progress , completed")
    }
    const taskData = await Task.findOne({ _id: ObjectId(task_id), user_id: user.user_id })
    if (!taskData) {
      throw Error('No tasks found')
    }

    let updateData={title,description,status}
    updateData = _.pickBy(updateData, _.identity);

    const updateTask = await Task.findOneAndUpdate({user_id:user.user_id,_id: ObjectId(task_id)},updateData,{new:true})


    console.log(updateTask, 'updateTask dataa')
    res.status(201).json({ data: updateTask, message: "Task updated successfully" })



  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error?.message || 'Internal Server Error' })
  }
})

module.exports = router
