const cloudinary = require('cloudinary');
const Httpstatus = require('http-status-codes');

const User = require('../models/user');

cloudinary.config({
    cloud_name: 'dyanou5zn',
    api_key: '847914655324535',
    api_secret: 'ehTIlScd5gtf1tcd39-Ux9FVtos'
});

module.exports = {
    UploadImage(req, res) {
        cloudinary.uploader.upload(req.body.image, async (result) => {
            if(result.resource_type !== 'image')
                return res.status(Httpstatus.BAD_REQUEST).json({message: 'Please upload an image!'});
            try {
                const user = await User.findOne({_id: req.user._id});
                user.profilePic = result.secure_url;
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