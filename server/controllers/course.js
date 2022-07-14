import User from '../models/user';

const AWS = require('aws-sdk');
const { nanoid } = require('nanoid');
const Course = require('../models/course');
const Completed = require('../models/completed');
const slugify = require('slugify');
const { readFileSync } = require('fs');
const stripe = require('stripe')(process.env.STRIPE_SECRET);

const awsConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    apiVersion: process.env.AWS_API_VERSION,
};

const s3 = new AWS.S3(awsConfig);

export const uploadImage = async(req, res) => {
    try {
        const { image } = req.body;
        if (!image) return res.status(400).send("No Image.");

        const base64Data = new Buffer.from(
            image.replace(/^data:image\/\w+;base64,/, ""),
            'base64'
        );
        const type = image.split(';')[0].split('/')[1];
        const params = {
            Bucket: 'edemy-bucket2022',
            Key: `images/${nanoid()}.${type}`,
            Body: base64Data,
            ACL: 'public-read',
            ContentEncoding: 'base64',
            ContentType: `image/${type}`
        };

        s3.upload(params, (err, data) => {
            if (err) {
                console.log(err.message);
                return res.sendStatus(400);
            }
            //console.log(data);
            return res.status(200).send(data);
        })        
    } catch (error) {
        console.log(error.message);
        return res.status(500).send(`${error.message}.`);
    }    
};

export const removeFile = async(req, res) => {
    try {
        const { file } = req.body;
        if (!file && !file.Key) return res.status(400).send("No File Key.");
        if (!file && !file.Bucket) return res.status(400).send("No File Bucket.");
        
        const params = {
            Bucket: file.Bucket,
            Key: file.Key,
        };
        await s3.deleteObject(params).promise();
        return res.status(200).json({ ok: true });       
    } catch (error) {
        console.log(error.message);
        return res.status(500).send(`${error.message}.`);
    }    
};

export const create = async(req, res) => {
    try {
        const { title, } = req.body;
        console.log(req.body);
        const alreadyExist = await Course.findOne({
            slug: slugify(title).toLowerCase()
        });
        if (alreadyExist) return res.status(400).send('Title is taken.');  
        
        const course = await new Course({
            slug: slugify(title),
            instructor: req.user._id,
            ...req.body
        });
        await course.save();
        console.log(course);
        return res.status(201).json({ ok: true });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send(`${error.message}.`);
    }    
};

export const update = async(req, res) => {
    try {
        console.log(req.body);
        const course = await Course.findById(req.body._id);
        if (!course) return res.status(404).send('Course Not Found.');  
        const { title, } = req.body;
        if (course.title.trim() !== title.trim()) {
            const alreadyExist = await Course.findOne({
                slug: slugify(title).toLowerCase()
            });
            if (alreadyExist) return res.status(400).send('Title is taken.');
        }  
        if (req.user._id != course.instructor) return res.status(400).send("Unauthorized");
        const oldImage = course.image;
        const updated = await Course.findOneAndUpdate(
            { _id: course._id },
            {
                ...req.body,
                slug: slugify(title)
            },
            { new: true }
        );
        
        if (updated && oldImage.Key !== updated.image.Key) {
            const params = {
                Bucket: oldImage.Bucket,
                Key: oldImage.Key,
            };    
            await s3.deleteObject(params).promise();
        }
        return res.status(200).json(updated);        
    } catch (error) {
        console.log(error.message);
        return res.status(500).send(`${error.message}.`);
    }    
};

export const read = async(req, res) => {
    try {
        const course = await Course.findOne({
            slug: req.params.slug
        }).populate('instructor', '_id name').exec();
        return res.status(201).json(course);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send(`${error.message}.`);
    }    
};

export const videoUpload = async(req, res) => {
    try {
        if (req.user._id != req.params.instructorId) return res.status(400).send("Unauthorized");
        const { video } = req.files;
        const { courseId } = req.fields;
        if (!video) return res.status(400).send("No Video.");
        
        const type = video.type.split('/')[1];
        const params = {
            Bucket: 'edemy-bucket2022',
            Key: `videos/${courseId}/${nanoid()}.${type}`,
            Body: readFileSync(video.path),
            ACL: 'public-read',
            ContentType: video.type
        };

        s3.upload(params, (err, data) => {
            if (err) {
                console.log(err.message);
                return res.sendStatus(400);
            }
            //console.log(data);
            return res.status(200).send(data);
        })        
    } catch (error) {
        console.log(error.message);
        return res.status(500).send(`${error.message}.`);
    }    
};

export const addLesson = async(req, res) => {
    try {
        const { slug, instructorId } = req.params;
        if (req.user._id != instructorId) return res.status(400).send("Unauthorized");
        const { values } = req.body;  
        const { title, content, video, free_preview } = values;  
        
        const updated = await Course.findOneAndUpdate(
            { slug },
            {
                $push: { lessons: { title, content, video, free_preview, slug: slugify(title) } }
            },
            { new: true }
        ).exec();
        return res.status(200).json(updated.lessons);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send(`${error.message}.`);
    }    
};

export const updateLesson = async(req, res) => {
    try {
        const { slug } = req.params;
        let course = await Course.findOne({ slug });
        if (!course) return res.status(404).send('Course Not Found.');  
        if (req.user._id != course.instructor) return res.status(400).send("Unauthorized");
        
        const {values} = req.body;  
        const { _id, title, content, video, free_preview } = values; 

        const lessons = course.lessons;
        const index = lessons.findIndex(less => less._id.toString() !== _id.toString() && less.slug === slugify(title).toLowerCase());
        console.log(index);
        if (index >= 0) return res.status(400).send('Title is taken.');

        await Course.updateOne(
            { "lessons._id": _id },
            {
                $set: { 
                    "lessons.$.title": title,
                    "lessons.$.content": content,
                    "lessons.$.slug": slugify(title).toLowerCase(),
                    "lessons.$.video": video,
                    "lessons.$.free_preview": free_preview,
                }
            },
            { new: true }
        ).exec();
        course = await Course.findOne({ slug });
        return res.status(200).json(course.lessons);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send(`${error.message}.`);
    }    
};

export const removeLesson = async(req, res) => {
    try {
        const { slug, lessonId } = req.params;
        const course = await Course.findOne({ slug });
        if (!course) return res.status(404).send('Course Not Found.');  
        if (req.user._id != course.instructor) return res.status(400).send("Unauthorized");
        
        const videoIndex = course.lessons.findIndex(lesson => lesson._id.toString() === lessonId.toString());
        const oldVideo = course.lessons[videoIndex].video;
        const deleteLesson = await Course.findByIdAndUpdate(course._id, {
            $pull: { lessons: { _id: lessonId } }
        }).exec();
        if (deleteLesson && oldVideo) {
            const params = {
                Bucket: oldVideo.Bucket,
                Key: oldVideo.Key,
            };
            await s3.deleteObject(params).promise();
        }
        return res.status(200).json({ ok: true });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send(`${error.message}.`);
    }    
};

export const publishCourse = async(req, res) => {
    try {
        const { courseId } = req.params;        
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).send('Course Not Found.');
        if (req.user._id != course.instructor) return res.status(400).send("Unauthorized");

        const updated = await Course.findByIdAndUpdate(
            courseId,
            { publish: true },
            { new: true }
        ).populate('instructor', '_id name').exec();
        return res.status(200).json(updated);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send(`${error.message}.`);
    }    
};

export const unpublishCourse = async(req, res) => {
    try {
        const { courseId } = req.params;        
        const course = await Course.findById(courseId).select('instructor').exec();
        if (!course) return res.status(404).send('Course Not Found.');
        if (req.user._id != course.instructor) return res.status(400).send("Unauthorized");

        const updated = await Course.findByIdAndUpdate(
            courseId,
            { publish: false },
            { new: true }
        ).populate('instructor', '_id name').exec();
        return res.status(200).json(updated);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send(`${error.message}.`);
    }    
};

export const courses = async(req, res) => {
    try {
        const allCourses = await Course.find({
            publish: true
        }).populate('instructor', '_id name').exec();
        return res.status(200).json(allCourses);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send(`${error.message}.`);
    }    
};

export const checkEnrolment = async(req, res) => {
    try {
        const { courseId } = req.params;
        const user = await User.findById(req.user._id).exec();
        const ids = [];
        const length = user.courses ? user.courses.length : 0;
        for (let i = 0; i < length; i++) {
            ids.push(user.courses[i].toString());
        }
        return res.status(200).json({
            status: ids.includes(courseId),
            course: await Course.findById(courseId).exec()
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send(`${error.message}.`);
    }    
};

export const freeEnrolment = async(req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId).exec();
        if (course.paid) return res.status(400).send('Course Is Not Free.');

        await User.findByIdAndUpdate(
            req.user._id,
            {
                $addToSet: { courses: course._id }
            },
            { new: true }
        ).exec();
        
        return res.status(200).json({
            message: 'Congratulations! You Have Successfully Enrolled.',
            course: course
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send(`${error.message}.`);
    }    
};

export const paidEnrolment = async(req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId)
        .populate('instructor').exec();
        if (!course.paid) return res.status(400).send('Course Is Not Paid.');

        const fee = (course.price * 30) / 100;
        console.log('course.instructor: ', course.instructor);
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    name: course.title,
                    amount: Math.round(course.price.toFixed(2) * 100),
                    currency: 'usd',
                    quantity: 1
                }
            ],
            payment_intent_data: {
                application_fee_amount: Math.round(fee.toFixed(2) * 100),
                transfer_data: {
                    destination: course.instructor.stripe_account_id
                }
            },
            success_url: `${process.env.STRIPE_SUCCESS_URL}/${course._id}`,
            cancel_url: process.env.STRIPE_CANCEL_URL
        });
        console.log('session: ', session);

        await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: { stripeSession: session }
            },
            { new: true }
        ).exec();
        
        return res.send(session.id);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send(`${error.message}.`);
    }    
};

export const stripeSuccess = async(req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId).exec();
        if (!course) return res.status(404).send('Course Is Not Found.');

        const user = await User.findById(req.user._id).exec();
        if (!user) return res.status(404).send('User Is Not Found.');
        //if (!user.stripeSession || !user.stripeSession.id) return res.sendStatus(400);

        // const session = await stripe.checkout.sessions.retrieve(user.stripeSession.id);
        // if (session && session.payment_status && session.payment_status === 'paid') {
        //     await User.findByIdAndUpdate(
        //         user._id,
        //         {
        //             $addToSet: { courses: course._id },
        //             $set: { stripeSession: {} }
        //         },
        //         { new: true } 
        //     ).exec();
        //     return res.json({ course });
        // } else {
        //     return res.sendStatus(400);
        // }

        await User.findByIdAndUpdate(
            user._id,
            {
                $addToSet: { courses: course._id },
                $set: { stripeSession: {} }
            },
            { new: true } 
        ).exec();
        return res.json({ course });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send(`${error.message}.`);
    }    
};

export const userCourses = async(req, res) => {
    try {
        const user = await User.findById(req.user._id).exec();
        if (!user) return res.status(404).send('User Is Not Found.');

        const courses = await Course.find({
            _id: { $in: user.courses }
        }).populate('instructor', '_id name').exec();
        return res.status(200).json(courses);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send(`${error.message}.`);
    }    
};

export const markCompleted = async(req, res) => {
    try {
        const { courseId, lessonId} = req.body;
        const existing = await Completed.findOne({
            user: req.user._id,
            course: courseId
        }).exec();

        if (existing) {
            if (existing.lessons.includes(lessonId)) return res.json([...existing.lessons]);

            await Completed.findOneAndUpdate({
                user: req.user._id,
                course: courseId
            }, {
                $addToSet: { lessons: lessonId }
            }).exec();
            return res.json([...existing.lessons, lessonId]);
        } else {
            await new Completed({
                user: req.user._id,
                course: courseId,
                lessons: [lessonId]
            }).save();
            return res.json([lessonId]);
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).send(`${error.message}.`);
    }    
};

export const markInCompleted = async(req, res) => {
    try {
        const { courseId, lessonId} = req.body;        

        await Completed.findOneAndUpdate({
            user: req.user._id,
            course: courseId
        }, {
            $pull: { lessons: lessonId }
        }).exec();

        const existing = await Completed.findOne({
            user: req.user._id,
            course: courseId
        }).exec();

        return res.json([...existing.lessons]);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send(`${error.message}.`);
    }    
};

export const listCompleted = async(req, res) => {
    try {
        const { courseId} = req.body;
        const list = await Completed.findOne({
            user: req.user._id,
            course: courseId
        }).exec();
        console.log(courseId)
        list && res.json(list.lessons);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send(`${error.message}.`);
    }    
};