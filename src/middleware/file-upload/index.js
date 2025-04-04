const { uploadFile } = require('../aws/aws');

const getFileUrl = async (file, folderName='Default Folder') => {
    return new Promise(async (resolve, reject) => {
        let fileUrl = "";
        if (file) {
            const fileBuffer = file.path;
            const originalFileName = file.originalname;
            const sanitizedFileName = originalFileName.replace(/\s+/g, '_');
            const sanitizedFolderName = folderName.replace(/\s+/g, '_');
            // Upload the file buffer to S3 and get its access URL
            fileUrl = await uploadFile(fileBuffer, sanitizedFileName, file.mimetype, sanitizedFolderName);
        }
        return resolve(fileUrl);
    })
}

// Portfolio Files Upload
const getMultipleFileUrls = async (fileArray, folderName='Default Folder') => {
    return new Promise(async (resolve, reject) => {
        const uploadedFileUrls = [];
        for (const file of fileArray) {
            const fileBuffer = file.path;
            const originalFileName = file.originalname;
            const sanitizedFileName = originalFileName.replace(/\s+/g, '_');
            const sanitizedFolderName = folderName.replace(/\s+/g, '_');
            // Upload the file buffer to S3 and get its access URL
            const fileUrl = await uploadFile(fileBuffer, sanitizedFileName, file.mimetype, sanitizedFolderName);
            uploadedFileUrls.push(fileUrl);
        }
        return resolve(uploadedFileUrls);
    })
};

const uploadVideo = async (videoFile, folderName = 'Default Folder') => {
    return new Promise(async (resolve, reject) => {
        let videoUrl = "";
        if (videoFile) {
            const videoBuffer = videoFile.path;
            const originalVideoName = videoFile.originalname;
            const sanitizedVideoName = originalVideoName.replace(/\s+/g, '_');
            const sanitizedFolderName = folderName.replace(/\s+/g, '_');
            
            // Upload the video buffer to S3 and get its access URL
            videoUrl = await uploadFile(videoBuffer, sanitizedVideoName, videoFile.mimetype, sanitizedFolderName);
        }
        return resolve(videoUrl);
    });
};

module.exports = {
    getFileUrl,
    getMultipleFileUrls,
    uploadVideo
}