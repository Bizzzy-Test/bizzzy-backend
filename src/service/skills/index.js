const responseData = require("../../constants/responses");
const CategorySchema = require("../../models/categories")
const SkillSchema = require("../../models/skills")
const { logger } = require("../../utils");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const getAllCategories = async (req, res) => {
    return new Promise(async () => {
        await CategorySchema.find().then(async (result) => {
            logger.info('Categories list fetched succesfully');
            return responseData.success(res, result, 'Categories list fetched succesfully');
        })
    })
}

// const addSkills = async (req, res) => {
//     return new Promise(async () => {
//         req.body['category_id'] = new ObjectId(req.body.category_id)
//         const skillsSchema = new SkillSchema(req.body);
//         await skillsSchema.save().then(async (result) => {
//             logger.info('Skills added successfully');
//             return responseData.success(res, result, 'Skills added successfully');
//         })
//     })
// }

const getSkillsOfCategory = async (req, res) => {
    return new Promise(async () => {
        await SkillSchema.find({
            category_id: new ObjectId(req.query.category_id)
        }).then(async (result) => {
            logger.info('Skills list fetched successfully');
            return responseData.success(res, result, 'Skills list fetched successfully');
        })
    })
}

module.exports = {
    getAllCategories,
    // addSkills,
    getSkillsOfCategory
};