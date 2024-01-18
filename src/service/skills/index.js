const responseData = require("../../constants/responses");
const CategorySchema = require("../../models/categories")
const SubCategorySchema = require("../../models/subCategory")
const SkillSchema = require("../../models/skills")
const { logger } = require("../../utils");
const mongoose = require('mongoose');
const messageConstants = require("../../constants/messages");
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
        await SubCategorySchema.find({ category_id: new ObjectId(req.query.category_id) }).then(async (result) => {
            logger.info('Categories list fetched succesfully');
            return responseData.success(res, result, 'Categories list fetched succesfully');
        })
    })
}

// const addSubCategory = async (req, res) => {
//     const subCategories = [
//         "Mechanical Engineering",
//         "Civil Engineering",
//         "Electrical Engineering",
//         "Software Engineering",
//         "Architectural Design",
//         "Environmental Engineering",
//         "Aerospace Engineering",
//         "Chemical Engineering",
//         "Urban Planning",
//         "Biomedical Engineering"
//     ]
//     return new Promise(async () => {
//         for (let subCategory of subCategories) {
//             const body = {
//                 category_id: '65a89e662a1e1295cacac5c6',
//                 sub_category_name: subCategory
//             }

//             const subCategorySchema = new SubCategorySchema(body);
//             await subCategorySchema.save().then((result) => {
//                 logger.info('Sub category added successfully');
//                 // return responseData.success(res, result, 'Sub category added successfully');
//             }).catch((err) => {
//                 logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
//                 // return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
//             })
//         }
//     })
// }

// const addSkills = async (req, res) => {
//     return new Promise(async () => {
//         const cantegorySkills = [
//             {
//                 "Subcategory": "Mechanical Engineering",
//                 "id": "65a8e6d3984d675263cf95bc",
//                 "Skills": [
//                     "Mechanical Design",
//                     "Thermodynamics",
//                     "CAD/CAM",
//                     "Materials Science"
//                 ]
//             },
//             {
//                 "Subcategory": "Civil Engineering",
//                 "id": "65a8e6d3984d675263cf95be",
//                 "Skills": [
//                     "Structural Engineering",
//                     "Construction Management",
//                     "Geotechnical Engineering",
//                     "Surveying"
//                 ]
//             },
//             {
//                 "Subcategory": "Electrical Engineering",
//                 "id": "65a8e6d3984d675263cf95c0",
//                 "Skills": [
//                     "Circuit Design",
//                     "Power Systems",
//                     "Electronics",
//                     "Control Systems"
//                 ]
//             },
//             {
//                 "Subcategory": "Software Engineering",
//                 "id": "65a8e6d4984d675263cf95c2",
//                 "Skills": [
//                     "Programming",
//                     "Software Development",
//                     "Algorithm Design",
//                     "System Architecture"
//                 ]
//             },
//             {
//                 "Subcategory": "Architectural Design",
//                 "id": "65a8e6d4984d675263cf95c4",
//                 "Skills": [
//                     "Conceptual Design",
//                     "3D Modeling",
//                     "Space Planning",
//                     "Building Codes Compliance"
//                 ]
//             },
//             {
//                 "Subcategory": "Environmental Engineering",
//                 "id": "65a8e6d4984d675263cf95c6",
//                 "Skills": [
//                     "Environmental Impact Assessment",
//                     "Water Treatment",
//                     "Air Quality Monitoring",
//                     "Sustainability Practices"
//                 ]
//             },
//             {
//                 "Subcategory": "Aerospace Engineering",
//                 "id": "65a8e6d4984d675263cf95c8",
//                 "Skills": [
//                     "Aerodynamics",
//                     "Aircraft Design",
//                     "Spacecraft Systems",
//                     "Flight Testing"
//                 ]
//             },
//             {
//                 "Subcategory": "Chemical Engineering",
//                 "id": "65a8e6d4984d675263cf95ca",
//                 "Skills": [
//                     "Chemical Process Design",
//                     "Material Science",
//                     "Bioprocess Engineering",
//                     "Safety Management"
//                 ]
//             },
//             {
//                 "Subcategory": "Urban Planning",
//                 "id": "65a8e6d4984d675263cf95cc",
//                 "Skills": [
//                     "Land Use Planning",
//                     "Transportation Planning",
//                     "Community Development",
//                     "Urban Design"
//                 ]
//             },
//             {
//                 "Subcategory": "Biomedical Engineering",
//                 "id": "65a8e6d4984d675263cf95ce",
//                 "Skills": [
//                     "Medical Device Design",
//                     "Biomechanics",
//                     "Biological Signal Processing",
//                     "Medical Imaging"
//                 ]
//             }
//         ]
//         for (let subCate of cantegorySkills) {
//             for (let skill of subCate['Skills']) {
//                 const body = {
//                     'skill_name': skill,
//                     'category_id': '65a89e662a1e1295cacac5c6',
//                     'sub_category_id': subCate['id'],
//                 };

//                 const skillsSchema = new SkillSchema(body);
//                 await skillsSchema.save().then(async (result) => {
//                     logger.info('Skills added successfully');
//                 })
//             }
//         }
//     })
// }

const getSkillsOfCategory = async (req, res) => {
    return new Promise(async () => {
        await SkillSchema.find({
            category_id: new ObjectId(req.query.category_id),
            sub_category_id: new ObjectId(req.query.sub_category_id)
        }).then(async (result) => {
            logger.info('Skills list fetched successfully');
            return responseData.success(res, result, 'Skills list fetched successfully');
        })
    })
}

module.exports = {
    getAllCategories,
    // addSkills,
    getSkillsOfCategory,
    // addSubCategory,
    getSubCategory
};