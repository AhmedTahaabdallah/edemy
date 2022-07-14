const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema;

const completedSchema = new Schema({
    user: {
        type: ObjectId,
        ref: 'User'
    },
    course: {
        type: ObjectId,
        ref: 'Course'
    },
    lessons: []
}, { timestamps: true });

const Completed = mongoose.model('Completed', completedSchema);
module.exports = Completed;