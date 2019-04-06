const cloudinary = require('cloudinary');
const Httpstatus = require('http-status-codes');

const User = require('../models/user');
const config = require('../config');

cloudinary.config({
    cloud_name: config.cloud_name,
    api_key: config.api_key,
    api_secret: config.api_secret
});

module.exports = {
    UploadImage(req, res) {
        cloudinary.uploader.upload(req.body.image, async (result) => {
            if(result.resource_type !== 'image')
                return res.status(Httpstatus.BAD_REQUEST).json({message: 'Please upload an image!'});
            try {
                const user = await User.findOne({_id: req.user._id});
                //user.profilePic = result.secure_url;
                user.images.unshift(result.secure_url);
                user.save();
                return res.status(Httpstatus.OK).json({message: 'Image uploaded successfully', user});
            }
            catch(err) {
                console.log(err);
                return res.status(Httpstatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'});
            }
        });
    }
}