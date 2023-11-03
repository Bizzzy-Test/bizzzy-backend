const { responseData, messageConstants } = require("../../constants");
const UserSchema = require('../../models/users');
const ProfileSchema = require('../../models/profile');
const { logger } = require("../../utils");
const path = require('path');
const fs = require('fs');
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const { uploadFile } = require("../../middleware/aws/aws.js");

const freelencerProfile = async (req, res) => {
    return new Promise(async () => {
        let profile = await ProfileSchema.findOne({ user_id : req.userId });
        if (!profile) {
            profile = new ProfileSchema({ user_id: req.userId });
        }
        // Experience section
        if (req.body.experience) {
            const experienceData = JSON.parse(req.body.experience);
            const company_name = educationData?.company_name || "null";
            const years_experience = educationData?.years_experience || "null";
            const start_date = educationData?.start_date || "null";
            const end_date = educationData?.end_date || "null";
            if (profile.experience && profile.experience.length > 0) {
                profile.experience[0] = { ...profile.experience[0], ...experienceData };
                profile.markModified('experience');
            } else {
                profile.experience.push({
                    company_name,
                    years_experience,
                    start_date,
                    end_date
                });
            }
        }
        // Eductaion section
        if (req.body.education) {
            const educationData = JSON.parse(req.body?.education);
            const degree_name = educationData?.degree_name || "null";
            const institution = educationData?.institution || "null";
            const starting_date = educationData?.start_date || "null";
            const ending_date = educationData?.end_date || "null";
            if (profile.education && profile.education.length > 0) {
                profile.education[0] = { ...profile.education[0], ...educationData };
                profile.markModified('education');
            } else {
                profile.education.push({
                    degree_name,
                    institution,
                    starting_date,
                    ending_date
                });
            }
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
            // Check if there is already an attachment in the database
            const existingAttachment = profile.portfolio[0] && profile.portfolio[0].attachements && profile.portfolio[0].attachements!='null';      
            // Add the file URL to the jobData object if it's not already there
            let headline;
            let description;
            let attachements = fileUrl == '' ? 'null' : fileUrl;
            if (req.body.portfolio) {
              const portfolioData = JSON.parse(req.body?.portfolio);
              headline = portfolioData.headline || "null";
              description = portfolioData.description || "null";
            if (profile.portfolio && profile.portfolio.length > 0) {
                if(existingAttachment){
                    attachements=profile.portfolio[0].attachements;
                }
                // Update the portfolio
                profile.portfolio[0] = { ...profile.portfolio[0], ...portfolioData, attachements };
                profile.markModified('portfolio');
              } else {
                // If the portfolio array is empty, push a new entry
                profile.portfolio.push({
                  headline,
                  description,
                  attachements
                });
              }
            } else {
              headline = "null";
              description = "null";
              if (existingAttachment) {
                // If an attachment already exists, don't make changes to the "attachments" field
                attachements = existingAttachment;
              }
              profile.portfolio.push({
                headline,
                description,
                attachements
              });
            }
        }
        if( profile.skills.length > 0){
            profile.skills = profile.skills;
        }else{
            profile.skills = req.body.skills ? JSON.parse(req.body.skills) : [];
        }   
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
        let profile = await ProfileSchema.findOne({ user_id : userId });
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