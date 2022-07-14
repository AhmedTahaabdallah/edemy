const User = require('../models/user');
const { hashPassword, comparePassword } = require('../utils/auth');
const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');
const { nanoid } = require('nanoid');

const awsConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    apiVersion: process.env.AWS_API_VERSION,
};

const SES = new AWS.SES(awsConfig);

export const register = async(req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name) return res.status(422).send('Name is required.');
        if (!password || password.length < 6) {
            return res.status(422).send('Password is required and should me min 6 characters long.');
        }

        const userExist = await User.findOne({ email }).exec();
        if (userExist) return res.status(422).send('Email is taken.');

        const hashedPassword = await hashPassword(password);
        const user = new User({
            email,
            name,
            password: hashedPassword
        });
        await user.save();
        console.log(user);
        return res.status(201).json({ ok: true });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send(`Register Error : ${error.message}.`);
    }
};

export const login = async(req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).exec();
        if (!user) return res.status(422).send('No User Found.');

        const match = await comparePassword(password, user.password);
        if (!match) return res.status(422).send('Email Or Password was Wrong.');

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '365d' });
        user.password = undefined;

        res.cookie('token', token, { httpOnly: true, secure: true });
        return res.status(200).json({ ok: true, user });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send(`Login Error : ${error.message}.`);
    }
};

export const logout = async(req, res) => {
    try {
        res.clearCookie('token');
        return res.status(200).json({ ok: true, message: 'SignOut Successful' });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send(`Logout Error : ${error.message}.`);
    }
};

export const currentUser = async(req, res) => {
    try {
        //console.log('req.user : ', req.user);
        const user = await User.findById(req.user._id).select('-password').exec();
        //console.log('Current user : ', user);
        return res.status(200).json({ ok: true });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send(`Current User Error : ${error.message}.`);
    }
};

export const forgotPassword = async(req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email }).exec();
        if (!user) return res.status(422).send('No Registered Email Found.');

        const shortCode = nanoid(6).toUpperCase();
        user.passwordResetCode = shortCode;
        const updatedUser = await user.save({ validateBeforeSave: false });
        if (!updatedUser) return res.status(422).send('Not sent Code.');

        const params = {
            Source: process.env.EMAIL_FROM,
            Destination: {
                ToAddresses: [email]
            },
            ReplyToAddresses: [process.env.EMAIL_FROM],
            Message: {
                Body: {
                    Html: {
                        Charset: 'UTF-8',
                        Data: `
                            <html>
                                <h1>Reset Password</h1>
                                <p>Please use this code to reset your password.</p>
                                <h2 style="color: red;">${shortCode}</h2>
                                <i>edemy.com</i>
                            </html>
                        `
                    }
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: 'Password Reset'
                }
            }
        };
        const emailSent = SES.sendEmail(params).promise();
        emailSent.then(data => {
            //console.log(data);
            return res.status(200).json({ ok: true });
        }).catch(err => {
            console.log(err.message);
            return res.status(500).send(`emailSent err : ${err.message}.`);
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send(`Forgot Password Error : ${error.message}.`);
    }
};

export const resetPassword = async(req, res) => {
    try{
        const { email, code, newPassword } = req.body;

        const hashedPassword = await hashPassword(newPassword);
        const user = await User.findOne({ email }).exec();
        if (!user) return res.status(422).send('No Registered Email Found.');
        if (user.passwordResetCode !== code) return res.status(422).send('Wrong Code.');
        user.passwordResetCode = '';
        user.password = hashedPassword;
        const updatedUser = user.save({ validateBeforeSave: false });
        if (!updatedUser) return res.status(422).send('Not Reset Password.');
        return res.status(200).json({ ok: true });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send(`Reset Password Error : ${error.message}.`);
    }
};