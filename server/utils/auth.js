const bcrypt = require('bcrypt');

export const hashPassword = password => {
    return new Promise((resolver, reject) => {
        bcrypt.genSalt(12, (err, salt) => {
            if (err) reject(err);
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) reject(err);
                resolver(hash);
            })
        })
    });
};

export const comparePassword = (password, hashed) => {
    return bcrypt.compare(password, hashed);
};