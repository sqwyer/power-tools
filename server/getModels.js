if(process.env.NODE_ENV != 'production') require('dotenv').config();

function getModels () {
    if(process.env.BACKUP === "true") {
        return {
            UserModel: require('../backup/User').UserModel,
            ProjectModel: require('../backup/Project').ProjectModel
        }
    } else {
        return {
            UserModel: require('../models/User').UserModel,
            ProjectModel: require('../models/Project').ProjectModel
        }
    }
}

getModels.backup = (process.env.BACKUP === "true");

module.exports = getModels;