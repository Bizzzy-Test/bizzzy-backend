const UserSchema = require('../../models/users');
const { logger } = require('../../utils');
const { responseData, messageConstants } = require('../../constants');
const { uploadFile } = require('../aws/aws');

const getUserData = async (req, res) => {
    return new Promise(async (resolve, reject) => {
        await UserSchema.find({ _id: req.userId }).then(async (result) => {
            if (result.length !== 0) {
                logger.info(`User ${result[0]['firstName']} fetched successfully`);
                return resolve(result[0]);
            } else {
                logger.error(messageConstants.TOKEN_EXPIRED);
                res.status(401).send(responseData.unauthorized);
            }
        }).catch((err) => {
            logger.error(`${messageConstants.USER_NOT_FOUND} ${err}`);
            return reject(messageConstants.USER_NOT_FOUND);
        })
    })
}

const getFileUrl = async (req) => {
    return new Promise(async (resolve, reject) => {
        let fileUrl = "";
        if (req.file) {
            const fileBuffer = req.file.path;
            const folderName = "job_files";
            // Upload the file buffer to S3 and get its access URL
            fileUrl = await uploadFile(fileBuffer, req.file.originalname, req.file.mimetype, folderName);
        }
        return resolve(fileUrl);
    })
}

module.exports = {
    getUserData,
    getFileUrl
}