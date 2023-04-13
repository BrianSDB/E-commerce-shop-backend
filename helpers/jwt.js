var {expressjwt:jwt} = require("express-jwt")


function jwt() {
    const secret = process.env.secret;
    return{
        secret,
        algorithms: ['HS256']
    }
}



module.exports = jwt;