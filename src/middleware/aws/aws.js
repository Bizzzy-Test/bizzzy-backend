const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
});

const uploadFile = async (fileBuffer, originalname) => {
  const key = `${uuidv4()}-${originalname}`;
  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Body: fileBuffer,
    Key: key,
  };

  try {
    const command = new PutObjectCommand(uploadParams);
    await s3.send(command);

    // Get the access URL of the uploaded file
    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`;

    console.log("fileUrl:", fileUrl);

    return fileUrl;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw error;
  }
};

module.exports = {
  uploadFile,
};