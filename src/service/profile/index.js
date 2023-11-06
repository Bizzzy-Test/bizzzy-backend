const { responseData, messageConstants } = require("../../constants");
const UserSchema = require('../../models/users');
const ProfileSchema = require('../../models/profile');
const { logger } = require("../../utils");
const path = require('path');
const fs = require('fs');
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const { uploadFile } = require("../../middleware/aws/aws.js");

const freelencerProfile = async (req, userData, res) => {
    return new Promise(async () => {
        let profile = await ProfileSchema.findOne({ user_id: req.userId });

        if (!profile) {
            profile = new ProfileSchema({ user_id: req.userId });
        }
        if (userData?.firstName && userData?.lastName && userData?.country) {
            profile.firstName = userData.firstName || "null";
            profile.lastName = userData.lastName || "null";
            profile.location = userData.country || "null"
        } else {
            // Handle the case where 'firstName' or 'lastName' is missing
            return responseData.fail(res, 'User is missing required information', 400);
        }
        if (req.body.experience) {
            const experienceData = req.body.experience;
            const company_name = experienceData?.company_name || "null";
            const position = experienceData?.position || "null";
            const job_description = experienceData?.job_description || "null";
            const job_location = experienceData?.job_location || "null";
            const start_date = experienceData?.start_date || "null";
            const end_date = experienceData?.end_date || "null";
            profile.experience.push({
                company_name,
                position,
                job_description,
                job_location,
                start_date,
                end_date
            });
        }

        if (req.body.education) {
            const educationData = req.body?.education;
            const degree_name = educationData?.degree_name || "null";
            const institution = educationData?.institution || "null";
            const start_date = educationData?.start_date || "null";
            const end_date = educationData?.end_date || "null";
            profile.education.push({
                degree_name,
                institution,
                start_date,
                end_date,
            });
        }
        // For Portfolio section
        if (req.body.portfolio || req.file) {
            let fileUrl = '';
            if (req.file) {
                const fileBuffer = req.file.path;
                const folder_name = 'portfolio';
                // Upload the file buffer to S3 and get its access URL
                fileUrl = await uploadFile(fileBuffer, req.file.originalname, req.file.mimetype, folder_name);
            }
            let attachements = fileUrl == '' ? 'null' : fileUrl;
            if (req.body.portfolio) {
                const portfolioData = req.body?.portfolio;
                const project_name = portfolioData.project_name || "null";
                const project_description = portfolioData.project_description || "null";
                const technologies = portfolioData.technologies || [];
                    // If the portfolio array is empty, push a new entry
                    profile.portfolio.push({
                        project_name,
                        project_description,
                        technologies,
                        attachements
                    });
            } else {
                project_name = "null";
                project_description = "null";
                technologies = [];
                profile.portfolio.push({
                    project_name,
                    project_description,
                    attachements
                });
            }
        }


        profile.skills = req.body?.skills ? req.body.skills : [];
        profile.categories = req.body?.categories ? req.body.categories : [];
        profile.professional_role = req.body?.professional_role ? req.body?.professional_role : (profile.professional_role !== 'null' ? profile.professional_role : 'null');
        profile.title = req.body?.title ? req.body?.title : (profile.title !== 'null' ? profile.title : 'null');
        profile.hourly_rate = req.body?.hourly_rate ? req.body?.hourly_rate : (profile.hourly_rate !== 'null' ? profile.hourly_rate : 'null');
        profile.description = req.body?.description ? req.body?.description : (profile.description !== 'null' ? profile.description : 'null');
        await profile.save().then((result) => {
            logger.info(`Freelencer Profile Details ${messageConstants.LIST_FETCHED_SUCCESSFULLY}`);
            return responseData.success(res, result, `Freelencer Profile Details ${messageConstants.LIST_FETCHED_SUCCESSFULLY}`);
        }).catch((err) => {
            logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
            return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
        });
    })
};


const getUserProfile = async (userData, res) => {
    return new Promise(async () => {
        const userId = userData._id.toString();
        let profile = await ProfileSchema.findOne({ user_id: userId });
        if (profile) {
            logger.info(`User details ${messageConstants.LIST_FETCHED_SUCCESSFULLY}`);
            return responseData.success(res, profile, `User details ${messageConstants.LIST_FETCHED_SUCCESSFULLY}`);
        } else {
            logger.info(`User ${messageConstants.PROFILE_DETAILS_NOT_FOUND}`);
            return responseData.fail(res, `User ${messageConstants.PROFILE_DETAILS_NOT_FOUND}`, 200);
        }
    })
}

const getProfileImage = async (req, res) => {
    const profile_image = req.params['profile_image'];

    try {
        const imagePath = path.join('./public/uploads', profile_image);

        console.log(imagePath)
        if (!fs.existsSync(imagePath)) {
            logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. File not exists`);
            return null;
        }

        return imagePath;

        // logger.info(messageConstants.PROFILE_UPDATED_SUCCESSFULLY);
        // return responseData.success(res, result, messageConstants.PROFILE_UPDATED_SUCCESSFULLY);
    } catch (err) {
        logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
        return null;
    }


    // Assuming the image files are stored in a folder named "uploads"

    // Check if the image file exists

}

module.exports = {
    freelencerProfile,
    getUserProfile,
    getProfileImage
}