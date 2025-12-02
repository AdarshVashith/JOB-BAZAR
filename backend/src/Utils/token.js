const jwt = require("jsonwebtoken");

const generateToken = (userId)=>{
    const payload = { userId };
    const accessTokens = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1h'
    })
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '7d'
    })

    return { accessTokens, refreshToken }
}

const verifyTokens = (token) =>{
    try{
        return jwt.verify(token, process.env.JWT_SECRET)
    }
    catch(err){
        return null
    }
}

module.exports = { generateToken, verifyTokens };