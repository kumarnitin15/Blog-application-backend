const Joi = require('joi');
const HttpStatus = require('http-status-codes');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const config = require('../config');
const User = require('../models/user');

module.exports = {
    async CreateUser(req, res){
        const schema = Joi.object().keys({
            username: Joi.string().min(5).max(10).required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(5).required(),
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            aboutMe: Joi.string().min(5).max(200).required()
        });

        const { error, value } = Joi.validate(req.body, schema);
        if(error && error.details)
            return res.status(HttpStatus.BAD_REQUEST).json({msg: error.details});

        const userName = await User.findOne({username: req.body.username});
        if(userName)
            return res.status(HttpStatus.CONFLICT).json({message: 'Username already exist'});

        const userEmail = await User.findOne({email: req.body.email.toLowerCase()});
        if(userEmail)
            return res.status(HttpStatus.CONFLICT).json({message: 'Email already exist'});

        bcrypt.hash(req.body.password, 10, (err, hash) => {
            if(err)
                return res.status(HttpStatus.BAD_REQUEST).json({message: 'Error hashing passord'});

            const body = {
                username: req.body.username,
                email: req.body.email.toLowerCase(),
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                aboutMe: req.body.aboutMe,
                password: hash
            };

            User.create(body).then(user => {
                const tokenData = {
                    _id: user._id,
                    username: user.username,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName
                };
                const token = jwt.sign({data: tokenData}, config.secret, {
                    expiresIn: "1h"
                });
                return res.status(HttpStatus.CREATED).json({message: 'User created successfully', token});
            }).catch(err => {
                console.log(err);
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'})
            });
        }); 
    },

    async LoginUser(req, res){
        if(!req.body.username || !req.body.password)
            return res.status(HttpStatus.BAD_REQUEST).json({message: 'No empty fields allowed'});
        
        await User.findOne({username: req.body.username}).then(user => {
            if(!user)
                return res.status(HttpStatus.NOT_FOUND).json({message: 'Username not found'});
            bcrypt.compare(req.body.password, user.password).then(result => {
                if(!result)
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Password is incorrect'});
                const tokenData = {
                    _id: user._id,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName
                };
                const token = jwt.sign({data: tokenData}, config.secret, {
                    expiresIn: '1h'
                });
                return res.status(HttpStatus.OK).json({message: 'Login successful', token});
            })
        }).catch(err => {
            console.log(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'});
        });
    }
};