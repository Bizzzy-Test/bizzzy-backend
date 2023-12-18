const { uploadFile } = require('../aws/aws');

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
    getFileUrl
}