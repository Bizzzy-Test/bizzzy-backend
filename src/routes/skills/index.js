const api = require("../../controller/skills");
const { urlConstants } = require("../../constants");

module.exports = (app) => {
    app.get(urlConstants.GET_CATEGORIES, api.getAllCategories);
    // app.post(urlConstants.ADD_SUB_CATEGORIES, api.addSubCategory);
    app.get(urlConstants.GET_SUB_CATEGORIES, api.getSubCategory);
    // app.post(urlConstants.ADD_SKILLS, api.addSkills);
    app.get(urlConstants.GET_SKILLS, api.getSkillsOfCategory);
}