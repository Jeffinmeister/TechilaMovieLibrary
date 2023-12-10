const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    status:{type:String,enum:["incomplete","in-progress","completed"]},
    user_id: { type: String, required: true },
    created_at: { type: Date, default: Date.now() },
    updated_at:{type:Date,default:Date.now()}
});




const Task = mongoose.model('Task', taskSchema);

module.exports = Task