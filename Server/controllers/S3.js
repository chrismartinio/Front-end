const multer = require('multer');
const multerS3 = require('multer-s3');
const config = require('../config/main')
const Picture = require('../models/picture')
//configure AWS
const aws = require('aws-sdk');
aws.config.update(config.S3);
const s3 = new aws.S3();

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'blindlyapp',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString())
        }
    })
})

exports.postCurrentPicture = function (req, res, next) {
    const singleUpload = upload.single('image')

    singleUpload(req, res, function (err, some) {
        if (err) {
            return res.status(422).send({ errors: [{ title: 'Image Upload Error', detail: err.message }] });
        }

        let picture = new Picture({
            key: req.file.key,
            user: req.params.userId
        });

        return res.json({ 'imageUrl': req.body });
    });
}
exports.getPicture = function (req, res, next) {

}