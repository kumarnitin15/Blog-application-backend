const Joi = require('joi');
const HttpStatus = require('http-status-codes');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const config = require('../config');
const User = require('../models/user');
const helper = require('../helpers/helper');

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

        const userEmail = await User.findOne({email: helper.lowerCase(req.body.email)});
        if(userEmail)
            return res.status(HttpStatus.CONFLICT).json({message: 'Email already exist'});

        bcrypt.hash(req.body.password, 10, (err, hash) => {
            if(err)
                return res.status(HttpStatus.BAD_REQUEST).json({message: 'Error hashing passord'});

            const body = {
                username: req.body.username,
                email: req.body.email.toLowerCase(),
                firstName: helper.firstUpper(req.body.firstName),
                lastName: helper.firstUpper(req.body.lastName),
                aboutMe: req.body.aboutMe,
                images: ['http://profilepicturesdp.com/wp-content/uploads/2018/06/default-dp-6.png'],
                password: hash,
                createAt: new Date()
            };

            User.create(body).then(user => {
                const tokenData = {
                    _id: user._id,
                    username: user.username,
                    firstName: helper.firstUpper(req.body.firstName),
                    lastName: helper.firstUpper(req.body.lastName)
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
                    firstName: helper.firstUpper(user.firstName),
                    lastName: helper.firstUpper(user.lastName)
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
    },

    async ChangePassword(req, res) {
        try {
            const user = await User.findOne({_id: req.user._id});
            bcrypt.compare(req.body.currentPassword, user.password).then(result => {
                if(!result)
                    return res.status(HttpStatus.BAD_REQUEST).json({message: 'Password is incorrect'});
                if(req.body.newPassword !== req.body.confirmPassword)
                    return res.status(HttpStatus.BAD_REQUEST).json({message: "The new password and confirm password don't match"});
                if(req.body.newPassword.length < 5)
                    return res.status(HttpStatus.BAD_REQUEST).json({message: "Password must be atleast 5 characters"});
                if(req.body.newPassword.length > 20)
                    return res.status(HttpStatus.BAD_REQUEST).json({message: "Password cannot be more than 20 characters"});
                bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
                    if(err)
                        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error hashing password'});
                    user.password = hash;
                    user.save();
                    return res.status(HttpStatus.OK).json({message: 'Changed password successfully', user});
                });
            });
        }
        catch(err) {
            console.log(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'});
        }
    }
};