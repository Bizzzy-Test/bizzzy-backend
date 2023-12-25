const { uploadFile } = require('../aws/aws');

const getFileUrl = async (req) => {
    return new Promise(async (resolve, reject) => {
        let fileUrl = "";
        if (req.file) {
            const fileBuffer = req.file.path;
            const folderName = "job_files";
            const originalFileName = req.file.originalname;
            const sanitizedFileName = originalFileName.replace(/\s+/g, '_'); // Replaces spaces with underscores
            // Upload the file buffer to S3 and get its access URL
            fileUrl = await uploadFile(fileBuffer, sanitizedFileName, req.file.mimetype, folderName);
        }
        return resolve(fileUrl);
    })
}

module.exports = {
    getFileUrl
}