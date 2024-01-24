const responseData = require("../../constants/responses");
const CategorySchema = require("../../models/categories")
const SubCategorySchema = require("../../models/subCategory")
const SkillSchema = require("../../models/skills")
const { logger } = require("../../utils");
const mongoose = require('mongoose');
const messageConstants = require("../../constants/messages");
const { error } = require("winston");
const ObjectId = mongoose.Types.ObjectId;

const getAllCategories = async (req, res) => {
    return new Promise(async () => {
        await CategorySchema.find().then(async (result) => {
            logger.info('Categories list fetched succesfully');
            return responseData.success(res, result, 'Categories list fetched succesfully');
        })
    })
}

const getSubCategory = async (req, res) => {
    return new Promise(async () => {
        const categoryId = req.query.category_id;

        if (!ObjectId.isValid(categoryId)) {
            logger?.error('Invalid category_id provided');
            return responseData.fail(res,'Invalid category_id provided', 404);
        }

        await SubCategorySchema.find({ category_id: new ObjectId(categoryId) }).then(async (result) => {
            logger.info('Sub Categories list fetched successfully');
            return responseData.success(res, result, 'Sub Categories list fetched successfully');
        }).catch((error) => {
            logger.error('Error fetching subcategories:', error);
            return responseData.fail(res,'Error fetching subcategories', 404);
        });
    });
}
 
const getSkillsOfCategory = async (req, res) => {
    return new Promise(async () => {
        const categoryId = req.query.category_id;

        if (!ObjectId.isValid(categoryId)) {
            logger?.error('Invalid category_id provided');
            return responseData.fail(res,'Invalid category_id provided', 404);
        }

        await SkillSchema.find({
            category_id: new ObjectId(categoryId)
        }).then(async (result) => {
            logger.info('Skills list fetched successfully');
            return responseData.success(res, result, 'Skills list fetched successfully');
        }).catch((error)=>{
            logger.error('Error fetching skills list:', error);
            return responseData.fail(res,'Error fetching skills list', 404);
        })
    })
}

const getSkillsOfCategorySubCategory = async (req, res) => {
    return new Promise(async () => {
        const categoryId = req.query.category_id;
        const subCategoryId = req.query.sub_category_id;
        
        if (!ObjectId.isValid(categoryId) || !ObjectId.isValid(subCategoryId)) {
            logger?.error('Invalid category_id or sub_category_id provided');
            return responseData.fail(res, 'Invalid category_id or sub_category_id provided', 404);
        }
        
        await SkillSchema.find({
            category_id: new ObjectId(req.query.category_id),
            sub_category_id: new ObjectId(req.query.sub_category_id)
        }).then(async (result) => {
            logger.info('Skills list fetched successfully');
            return responseData.success(res, result, 'Skills list fetched successfully');
        }).catch((error) => {
            logger.error('Error fetching skills list:', error);
            return responseData.fail(res,'Error fetching skills list', 404);
        });
    })
}

module.exports = {
    getAllCategories,
    // addSkills,
    getSkillsOfCategory,
    // addSubCategory,
    getSubCategory,
    getSkillsOfCategorySubCategory
};