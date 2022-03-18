function getModels () {
        return {
            UserModel: require('../models/User').UserModel,
            ProjectModel: require('../models/Project').ProjectModel
        }
}

getModels.backup = false;

module.exports = getModels;