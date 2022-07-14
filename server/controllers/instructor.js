const User = require('../models/user');
const Course = require('../models/course');
const queryString = require('query-string');
const stripe = require('stripe')(process.env.STRIPE_SECRET);

export const makeInstructor = async(req, res) => {
    try {
        const user = await User.findById(req.user._id).exec();
        if (!user) return res.status(422).send('User Not Exist.');

        if (!user.stripe_account_id) {
            const account = await stripe.accounts.create({ type: 'express' });
            user.stripe_account_id = account.id;
            await user.save({ validateBeforeSave: false });
        }

        let accountLink = await stripe.accountLinks.create({
            account: user.stripe_account_id,
            refresh_url: process.env.STRIPE_REDIRECT_URL,
            return_url: process.env.STRIPE_REDIRECT_URL,
            type: 'account_onboarding',
        });
        console.log(user.email);
        accountLink = Object.assign(accountLink, {
            "stripe_user[email]": user.email
        });
        res.send(`${accountLink.url}?${queryString.stringify(accountLink)}`);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send(`Make Instructor Error : ${error.message}.`);
    }    
};

export const getAccountStatus = async(req, res) => {
    try {
        const user = await User.findById(req.user._id).exec();
        if (!user) return res.status(422).send('User Not Exist.');

        const account = await stripe.accounts.retrieve(user.stripe_account_id);
        if (!account/*.charges_enabled*/) {
            return res.status(404).send('Unauthorized Stripe.');
        } else {
            user.stripe_seller = account;
            user.role = ['Subscriber', 'Instructor'];
            const updatedUser = await user.save({ validateBeforeSave: false });
            if (updatedUser) {
                updatedUser.password = undefined;
                return res.status(200).json(updatedUser);
            } else {
                return res.status(422).send('Not Updated User.');
            }
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).send(`${error.message}.`);
    }    
};

export const currentInstructor = async(req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password').exec();
        if (!user.role.includes('Instructor')) {
            return res.sendStatus(403);
        }
        return res.status(200).json({ ok: true });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send(`${error.message}.`);
    }
};

export const instructorCourses = async(req, res) => {
    try {
        const courses = await Course.find({ instructor: req.user._id })
        .sort({ createdAt: -1 })
        .exec();
        return res.json(courses);     
    } catch (error) {
        console.log(error.message);
        return res.status(500).send(`${error.message}.`);
    }
};

export const studentsCount = async(req, res) => {
    try {
        const users = await User.find({ courses: req.body.courseId })
        .select('_id')
        .exec();
        return res.json(users.length);     
    } catch (error) {
        console.log(error.message);
        return res.status(500).send(`${error.message}.`);
    }
};