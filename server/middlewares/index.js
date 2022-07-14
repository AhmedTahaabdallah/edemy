//const { expressjwt } = require('express-jwt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Course = require('../models/course');

// export const requireSignIn = expressjwt({
//     getToken: (req) => {        
//         if (req.cookies && req.cookies.token) {
//           return req.cookies.token;
//         }
//         return null;
//     },
//     secret: process.env.JWT_SECRET,
//     algorithms: ['HS256']
// });

export const requireSignIn = (req, res, next) => {
  const token = req.cookies && req.cookies.token ? req.cookies.token : null;

  if (token === null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET , (err, user) => {
    console.log(err)

    if (err) return res.sendStatus(403)

    req.user = user;
    
    next()
  })
};

export const isInstructor = async(req, res, next) => {
  try {
    const user = await User.findById(req.user._id).exec();
    if (!user || !user.role.includes('Instructor')) return res.sendStatus(403);
    next();
  } catch (error) {
    console.log(error.message);
    return res.status(500).send(`${error.message}.`);
  }
};

export const isEnrolled = async(req, res, next) => {
  try {
    const user = await User.findById(req.user._id).exec();
    if (!user) return res.sendStatus(404);
    
    const course = await Course.findOne({ slug: req.params.slug }).exec();
    if (!course) return res.sendStatus(404);

    const ids = [];
    for (let i = 0; i < user.courses.length; i++) {
      ids.push(user.courses[i].toString());
    }
    if (!ids.includes(course._id.toString())) {
      return res.sendStatus(403);
    } else {
      next();
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).send(`${error.message}.`);
  }
};