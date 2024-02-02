const { responseData, messageConstants } = require("../../constants");
const UserSchema = require("../../models/users");
const JobSchema = require("../../models/job");
const OfferSchema = require("../../models/offers");
const HiredFreelancersSchema = require("../../models/hiredFreelancers");
const ProfileSchema = require("../../models/profile");
const ClientProfileSchema = require("../../models/clientProfile");
const InvitationSchema = require("../../models/invite");
const { logger } = require("../../utils");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const { uploadFile } = require("../../middleware/aws/aws.js");

const freelancerProfile = async (req, userData, res) => {
    return new Promise(async () => {
        let profile = await ProfileSchema.findOne({ user_id: req.userId });

        if (!profile) {
            profile = new ProfileSchema({ user_id: req.userId });
        }
        if (userData?.firstName && userData?.lastName && userData?.country) {
            profile.firstName = userData.firstName;
            profile.lastName = userData.lastName;
            profile.location = userData.country;
        } else {
            // Handle the case where 'firstName' or 'lastName' is missing
            return responseData.fail(
                res,
                "User is missing required information",
                400
            );
        }
        if (req.body.experience) {
            const experienceData = req.body.experience;
            const company_name = experienceData?.company_name;
            const position = experienceData?.position;
            const job_description = experienceData?.job_description;
            const job_location = experienceData?.job_location;
            const start_date = experienceData?.start_date;
            const end_date = experienceData?.end_date;
            profile.experience.push({
                company_name,
                position,
                job_description,
                job_location,
                start_date,
                end_date,
            });
        }

        if (req.body.education) {
            const educationData = req.body?.education;
            const degree_name = educationData?.degree_name || null;
            const institution = educationData?.institution || null;
            const start_date = educationData?.start_date || null;
            const end_date = educationData?.end_date || null;
            profile.education.push({
                degree_name,
                institution,
                start_date,
                end_date,
            });
        }

        // For Portfolio section
        if (req.body.portfolio || req.files) {
            let fileUrls = [];
            if (req.files?.length > 3) {
                logger.error(`You can only upload three images at a time`);
                return responseData.fail(
                    res,
                    `You can only upload three images at a time`,
                    400
                );
            } else {
                if (req.files && req.files.length > 0) {
                    // Upload multiple files to S3 and get their access URLs
                    fileUrls = await uploadMultipleFiles(req.files);
                }
                let attachements = fileUrls == "" ? null : fileUrls;
                if (req.body.portfolio) {
                    const portfolioData = req.body?.portfolio;
                    const project_name = portfolioData.project_name || null;
                    const project_description = portfolioData.project_description || null;
                    const technologies = portfolioData.technologies || [];
                    // If the portfolio array is empty, push a new entry
                    profile.portfolio.push({
                        project_name,
                        project_description,
                        technologies,
                        attachements, // Store the array of file URLs in the 'attachments' field
                    });
                }
            }
        }
        profile.skills =
            req.body && req.body.skills !== undefined
                ? req.body.skills
                : profile.skills;
        profile.categories =
            req.body && req.body.categories !== undefined
                ? req.body.categories
                : profile.categories;
        profile.sub_categories =
            req.body && req.body.sub_categories !== undefined
                ? req.body.sub_categories
                : profile.sub_categories;
        profile.professional_role =
            req.body?.professional_role !== undefined
                ? req.body?.professional_role
                : profile.professional_role || null;
        profile.title =
            req.body?.title !== undefined ? req.body?.title : profile.title || null;
        profile.hourly_rate =
            req.body?.hourly_rate !== undefined
                ? req.body?.hourly_rate
                : profile.hourly_rate || null;
        profile.description =
            req.body?.description !== undefined
                ? req.body?.description
                : profile.description || null;
        await profile
            .save()
            .then((result) => {
                logger.info(
                    `Freelancer Profile Details ${messageConstants.PROFILE_CREATED_SUCCESSFULLY}`
                );
                if (req.files) {
                    const portfolio_length = result.portfolio.length - 1;
                    return responseData.success(
                        res,
                        profile.portfolio[portfolio_length],
                        `Freelancer Profile Details ${messageConstants.PROFILE_CREATED_SUCCESSFULLY}`
                    );
                } else {
                    return responseData.success(
                        res,
                        req.body,
                        `Freelancer Profile Details ${messageConstants.PROFILE_CREATED_SUCCESSFULLY}`
                    );
                }
            })
            .catch((err) => {
                logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
                return responseData.fail(
                    res,
                    `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`,
                    500
                );
            });
    });
};

// Portfolio Files Upload
const uploadMultipleFiles = async (fileArray) => {
    console.log(fileArray);
    const uploadedFileUrls = [];
    for (const file of fileArray) {
        const fileBuffer = file.path;
        const folder_name = "portfolio";
        // Upload the file buffer to S3 and get its access URL
        const fileUrl = await uploadFile(
            fileBuffer,
            file.originalname,
            file.mimetype,
            folder_name
        );
        uploadedFileUrls.push(fileUrl);
    }
    return uploadedFileUrls;
};

const clientProfile = async (req, userData, res) => {
    return new Promise(async () => {
        let profile = await ClientProfileSchema.findOne({
            user_id: new ObjectId(req.userId),
        });
        if (!profile) {
            profile = new ClientProfileSchema({ user_id: req.userId });
        }
        profile.firstName = userData.firstName || null;
        profile.lastName = userData.lastName || null;
        profile.location = userData.country || null;
        profile.businessName = req.body?.business_name || null;
        profile.briefDescription = req.body?.brief_description || null;
        await profile
            .save()
            .then((result) => {
                logger.info(
                    `Client Profile Details ${messageConstants.PROFILE_CREATED_SUCCESSFULLY}`
                );
                return responseData.success(
                    res,
                    result,
                    `Client Profile Details ${messageConstants.PROFILE_CREATED_SUCCESSFULLY}`
                );
            })
            .catch((err) => {
                logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
                return responseData.fail(
                    res,
                    `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`,
                    500
                );
            });
    });
};

const getUserProfile = async (userData, res) => {
    return new Promise(async () => {
        const query = [
            {
                $match: {
                    user_id: userData._id,
                },
            },
            {
                $lookup: {
                    from: "feedbacks",
                    localField: "user_id",
                    foreignField: "reciever_id",
                    pipeline: [
                        {
                            $lookup: {
                                from: "freelancer_profiles",
                                localField: "sender_id",
                                foreignField: "user_id",
                                pipeline: [
                                    {
                                        $project: {
                                            _id: 0,
                                            firstName: 1,
                                            lastName: 1,
                                            location: 1,
                                            professional_role: 1,
                                            profile_image: 1,
                                        },
                                    },
                                ],
                                as: "freelancer_details",
                            },
                        },
                        {
                            $lookup: {
                                from: "client_profiles",
                                localField: "sender_id",
                                foreignField: "user_id",
                                pipeline: [
                                    {
                                        $project: {
                                            _id: 0,
                                            firstName: 1,
                                            lastName: 1,
                                            businessName: 1,
                                            profile_image: 1,
                                            location: 1,
                                        },
                                    },
                                ],
                                as: "client_details",
                            },
                        },
                        {
                            $lookup: {
                                from: "jobs",
                                localField: "job_id",
                                foreignField: "_id",
                                pipeline: [
                                    {
                                        $project: {
                                            _id: 0,
                                            title: 1,
                                            description: 1,
                                            job_type: 1,
                                            status: 1,
                                        },
                                    },
                                ],
                                as: "job_details",
                            },
                        },
                        {
                            $addFields: {
                                sender_details: {
                                    $ifNull: [
                                        { $arrayElemAt: ["$freelancer_details", 0] },
                                        { $arrayElemAt: ["$client_details", 0] },
                                    ],
                                },
                                job_details: {
                                    $ifNull: [{ $arrayElemAt: ["$job_details", 0] }, null],
                                },
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                                feedback_details: "$public_feedback",
                                sender_details: 1,
                                job_details: 1,
                            },
                        },
                    ],
                    as: "work_history",
                },
            },
        ];

        const userSchema =
            userData.role === 1 ? ProfileSchema : ClientProfileSchema;
        await userSchema
            .aggregate(query)
            .then(async (result) => {
                if (result?.length) {
                    result = result[0];
                    if (userData?.role === 2) {
                        await getClientDetails(result, result?.user_id);
                    }
                    logger.info(
                        `User details ${messageConstants.LIST_FETCHED_SUCCESSFULLY}`
                    );
                    return responseData.success(
                        res,
                        result,
                        `User details ${messageConstants.LIST_FETCHED_SUCCESSFULLY}`
                    );
                } else {
                    logger.info(`User ${messageConstants.PROFILE_DETAILS_NOT_FOUND}`);
                    return responseData.fail(
                        res,
                        `User ${messageConstants.PROFILE_DETAILS_NOT_FOUND}`,
                        200
                    );
                }
            })
            .catch((err) => {
                logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
                return responseData.fail(
                    res,
                    `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`,
                    500
                );
            });
    });
};

const profileImageUpload = async (req, userData, res) => {
    try {
        let profile;
        if (userData.role == 2) {
            profile = await ClientProfileSchema.findOne({
                user_id: new ObjectId(req.userId),
            });
        } else {
            profile = await ProfileSchema.findOne({
                user_id: new ObjectId(req.userId),
            });
        }
        if (!profile) {
            // Create a new profile if it doesn't exist
            profile = new profileSchema({ userId: req.userId });
        }
        if (req.file) {
            const fileBuffer = req.file.path;
            const folder_name = userData.role == 1 ? "freelancers" : "clients";
            // Assuming uploadFile is a function you've defined to handle file uploads
            const fileUrl = await uploadFile(
                fileBuffer,
                req.file.originalname,
                req.file.mimetype,
                folder_name
            );
            profile.profile_image = fileUrl || null; // Use the URL or null if the upload failed
        }
        const result = await profile.save();
        logger.info(`Profile Image ${messageConstants.PROFILE_IMAGE_UPLOADED}`);
        responseData.success(
            res,
            result,
            `Profile Image ${messageConstants.PROFILE_IMAGE_UPLOADED}`
        );
    } catch (err) {
        logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
        responseData.fail(
            res,
            `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`,
            500
        );
    }
};

const getProfileImage = async (req, res) => {
    const profile_image = req.params["profile_image"];
    try {
        const imagePath = path.join("./public/uploads", profile_image);

        if (!fs.existsSync(imagePath)) {
            logger.error(
                `${messageConstants.INTERNAL_SERVER_ERROR}. File not exists`
            );
            return null;
        }
        return imagePath;
    } catch (err) {
        logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
        return null;
    }
};

const editFreelancerProfile = async (req, userData, res) => {
    return new Promise(async () => {
        const find_profile = await ProfileSchema.findOne({
            user_id: new ObjectId(userData._id),
        });
        if (find_profile) {
            const updateObject = {};
            let update_condition = {};
            // For update experience section
            if (req.body?.experience) {
                updateObject["experience.$.company_name"] =
                    req.body?.experience?.company_name;
                updateObject["experience.$.position"] = req.body?.experience?.position;
                updateObject["experience.$.job_description"] =
                    req.body?.experience?.job_description;
                updateObject["experience.$.job_location"] =
                    req.body?.experience?.job_location;
                updateObject["experience.$.start_date"] =
                    req.body?.experience?.start_date;
                updateObject["experience.$.end_date"] = req.body?.experience?.end_date;
                update_condition = {
                    _id: new ObjectId(find_profile._id),
                    "experience._id": new ObjectId(req.body?.experience?.experienceId),
                };
            }
            // For update education section
            if (req.body?.education) {
                updateObject["education.$.degree_name"] =
                    req.body?.education?.degree_name;
                updateObject["education.$.institution"] =
                    req.body?.education?.institution;
                updateObject["education.$.start_date"] =
                    req.body?.education?.start_date;
                updateObject["education.$.end_date"] = req.body?.education?.end_date;
                update_condition = {
                    _id: new ObjectId(find_profile._id),
                    "education._id": new ObjectId(req.body?.education?.educationId),
                };
            }
            // For edit portfolio section
            if (req.body?.portfolio || req.files) {
                let fileUrls = [];
                if (req.files) {
                    if (req.files?.length > 3) {
                        logger.error(`You can only upload three images at a time`);
                        return responseData.fail(
                            res,
                            `You can only upload three images at a time`,
                            400
                        );
                    } else {
                        if (req.files && req.files?.length > 0) {
                            fileUrls = await uploadMultipleFiles(req.files);
                        }
                        updateObject["portfolio.$.attachements"] = fileUrls;
                        update_condition = {
                            _id: new ObjectId(find_profile._id),
                            "portfolio._id": new ObjectId(req.body?.portfolioId),
                        };
                    }
                } else {
                    updateObject["portfolio.$.project_name"] =
                        req.body?.portfolio?.project_name;
                    updateObject["portfolio.$.project_description"] =
                        req.body?.portfolio?.project_description;
                    updateObject["portfolio.$.technologies"] =
                        req.body?.portfolio?.technologies;
                    updateObject["portfolio.$.attachements"] =
                        req.body?.portfolio?.attachements;
                    update_condition = {
                        _id: new ObjectId(find_profile._id),
                        "portfolio._id": new ObjectId(req.body?.portfolio?.portfolioId),
                    };
                }
            }
            // For update rest section
            if (
                req.body?.professional_role ||
                req.body?.title ||
                req.body?.hourly_rate ||
                req.body?.description ||
                req.body?.skills ||
                req.body?.categories
            ) {
                updateObject.professional_role = req.body?.professional_role;
                updateObject.hourly_rate = req.body?.hourly_rate;
                updateObject.description = req.body?.description;
                updateObject.skills = req.body?.skills;
                updateObject.categories = req.body?.categories;
                updateObject.sub_categories = req.body?.sub_categories;
                update_condition = {
                    _id: new ObjectId(find_profile._id),
                };
            }
            // Update data in freelancer profile
            await ProfileSchema.updateOne(update_condition, {
                $set: updateObject,
            }).then(async (updateResult) => {
                if (updateResult?.modifiedCount == 1) {
                    logger.info(
                        `Edit Freelancer profile ${messageConstants.LIST_FETCHED_SUCCESSFULLY}`
                    );
                    return responseData.success(
                        res,
                        req.body,
                        `Edit Freelancer profile ${messageConstants.LIST_FETCHED_SUCCESSFULLY}`
                    );
                } else {
                    logger.info(
                        `Edit Freelancer profile ${messageConstants.PROFILE_NOT_UPDATED}`
                    );
                    return responseData.fail(
                        res,
                        `${messageConstants.PROFILE_NOT_UPDATED}`,
                        200
                    );
                }
            });
        } else {
            logger.error(messageConstants.USER_NOT_FOUND);
            return responseData.fail(res, messageConstants.USER_NOT_FOUND, 403);
        }
    });
};

const editClientProfile = async (req, userData, res) => {
    return new Promise(async () => {
        const find_profile = await ProfileSchema.findOne({
            user_id: new ObjectId(userData._id),
        });
        if (find_profile) {
            const updateObject = {};
        } else {
            logger.error(messageConstants.USER_NOT_FOUND);
            return responseData.fail(res, messageConstants.USER_NOT_FOUND, 403);
        }
    });
};
const deleteExperience = async (req, userData, res) => {
    return new Promise(async () => {
        const find_profile = await ProfileSchema.findOne({
            user_id: new ObjectId(userData._id),
        });
        if (find_profile) {
            await ProfileSchema.updateOne(
                { _id: new ObjectId(find_profile._id) },
                { $pull: { experience: { _id: new ObjectId(req.body.experienceId) } } }
            ).then(async (deleteResult) => {
                if (deleteResult?.modifiedCount == 1) {
                    logger.info(
                        `Delete experience ${messageConstants.DELETED_SUCCESSFULLY}`
                    );
                    return responseData.success(
                        res,
                        req.body,
                        `Delete experience ${messageConstants.DELETED_SUCCESSFULLY}`
                    );
                } else {
                    logger.info(`Experience delete ${messageConstants.NOT_UPDATED}`);
                    return responseData.fail(res, `${messageConstants.NOT_UPDATED}`, 400);
                }
            });
        } else {
            logger.error(messageConstants.USER_NOT_FOUND);
            return responseData.fail(res, messageConstants.USER_NOT_FOUND, 403);
        }
    });
};

// const searchFreelancers = async (req, userData, res) => {
//     return new Promise(async () => {
//         if (userData.role == 1) {
//             logger.info(`Search freelancers ${messageConstants.NOT_ALLOWED}`);
//             return responseData.fail(res, `${messageConstants.NOT_ALLOWED}`, 404);
//         } else {
//             let { skills, experience, hourlyRateMin, hourlyRateMax, searchText, categoryId , subCategoryId} = req?.query;
//             if (skills?.length == 0 && experience?.length == 0 && !hourlyRateMin && !hourlyRateMax) {
//                 result = await ProfileSchema.find({});
//             } else {
//                 let query = {};
//                 if (skills) {
//                     query.skills = { $regex: new RegExp(skills, 'i') };
//                 }
//                 if (categoryId) {
//                     query['categories._id'] = categoryId;
//                 }
//                 if (hourlyRateMin && hourlyRateMax) {
//                     query.hourly_rate = { $gte: Number(hourlyRateMin), $lte: Number(hourlyRateMax) };
//                 }
//                 if (searchText) {
//                     query.$or = [
//                         { title: { $regex: new RegExp(searchText, 'i') } },
//                         { description: { $regex: new RegExp(searchText, 'i') } },
//                         { skills: { $regex: new RegExp(searchText, 'i') } },
//                         { firstName: { $regex: new RegExp(searchText, 'i') } },
//                         { lastName: { $regex: new RegExp(searchText, 'i') } },
//                     ];
//                 }
//                 await ProfileSchema.find(query).then(async (result) => {
//                     logger.info('Freelancer search successfully');
//                     return responseData.success(res, result, 'Freelancer search successfully');
//                 }).catch((err) => {
//                     logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
//                     return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
//                 })
//             }
//         }
//     })
// }



const searchFreelancers = async (req, res) => {
    return new Promise(async () => {

        let { skills, experience, hourlyRateMin, hourlyRateMax, searchText, categoryId, subCategoryId } = req?.query;
        let query = {};

        console.log(subCategoryId, "subCategoryId");

        if (skills) {
            query.skills = { $regex: new RegExp(skills, 'i') };
        }

        if (categoryId) {
            query['categories._id'] = categoryId;
        }

        if (subCategoryId) {
            subCategoryId = subCategoryId.split(',');
            const subcategoriesPromises = subCategoryId.map(async (id) => {
                return await ProfileSchema.find({ 'sub_categories._id': id });
            });
        }

        if (hourlyRateMin && hourlyRateMax) {
            query.hourly_rate = { $gte: Number(hourlyRateMin), $lte: Number(hourlyRateMax) };
        }

        if (experience) {
            query.experience = { $gte: Number(experience) };
        }

        if (searchText) {
            query.$or = [
                { title: { $regex: new RegExp(searchText, 'i') } },
                { description: { $regex: new RegExp(searchText, 'i') } },
                { skills: { $regex: new RegExp(searchText, 'i') } },
                { firstName: { $regex: new RegExp(searchText, 'i') } },
                { lastName: { $regex: new RegExp(searchText, 'i') } },
            ];
        }

        try {
            let result;

            if (subCategoryId && subCategoryId.length > 0) {
                // If subcategories are selected, update the query to include them
                query['sub_categories._id'] = { $in: subCategoryId };
            }

            result = await ProfileSchema.find(query);

            logger.info('Freelancer search successfully');
            return responseData.success(res, result, 'Freelancer search successfully');
        } catch (err) {
            logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
            return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
        }

    });
};


const getClientDetails = async (profile, user_id) => {
    user_id = new ObjectId(user_id);
    job_posted = await JobSchema.find({ client_id: user_id });
    job_open = await JobSchema.find({ client_id: user_id, status: "open" });
    hired_freelancers = await HiredFreelancersSchema.distinct("freelancer_id", {
        client_id: user_id,
    });
    active_freelancers = await OfferSchema.distinct("freelancer_id", {
        client_id: user_id,
        status: "accepted",
    });
    profile.job_posted = job_posted?.length || 0;
    profile.job_open = job_open?.length || 0;
    profile.hired_freelancers = hired_freelancers?.length || 0;
    profile.active_freelancers = active_freelancers?.length || 0;
    profile.total_amount_spend = 0;
    profile.avg_review = 4.2;
    profile.total_hours = 5;
    logger.info("Client Details Fetched Successfully");
    return profile;
};

module.exports = {
    freelancerProfile,
    clientProfile,
    getUserProfile,
    profileImageUpload,
    getProfileImage,
    deleteExperience,
    searchFreelancers,
    editFreelancerProfile,
    editClientProfile,
    getClientDetails,
};
