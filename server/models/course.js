const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema;

const lessonSchema = new Schema({
    title: {
        type: String,
        trim: true,
        minlength: 3,
        maxlength: 320,
        required: true
    },
    slug: {
        type: String,
        lowercase: true
    },
    content: {
        type: {},
        minlength: 200
    },
    video: {},
    free_preview: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

const courseSchema = new Schema({
    title: {
        type: String,
        trim: true,
        minlength: 3,
        maxlength: 320,
        required: true
    },
    slug: {
        type: String,
        lowercase: true
    },
    description: {
        type: {},
        minlength: 200,
        required: true
    },
    price: {
        type: Number,
        default: 9.99
    },
    image: {},
    category: String,
    publish: {
        type: Boolean,
        default: false
    },
    paid: {
        type: Boolean,
        default: true
    },
    instructor: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    lessons: [lessonSchema]
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;