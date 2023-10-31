const jwt = require('jsonwebtoken');
const { responseData, messageConstants } = require('../../constants');
const { logger } = require('../../utils');

function generateToken(user, remember_me) {
    let SECRET_KEY = process.env.JWT_SECRET_KEY;
    const payload = {
        id: user._id,
        email: user.email,
        role: user.role
    };

    let options = {};
    // Token expiration (optional)
    if(!remember_me)
        options = {
            expiresIn: '24h' // Token will expire in 1 hour
        };

    const token = jwt.sign(payload, SECRET_KEY, options);
    logger.info(messageConstants.TOKEN_GENERATED);
    return token;
}

function validateToken(req, res, next, userToken = '') {
    try {
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.header('token') || userToken;
        if (token) {
            const verified = jwt.verify(token, jwtSecretKey);
            if (verified) {
                req.userId = verified.id;
                logger.info(messageConstants.TOKEN_VALIDATED);
                next();
            } else {
                logger.error(`${messageConstants.USER_NOT_FOUND} ${messageConstants.TOKEN_EXPIRED}`);
                res.status(401).send(responseData.unauthorized)
            }
        } else {
            res.status(400).send(responseData.tokenRequired)
        }
    } catch (error) {
        logger.error(messageConstants.TOKEN_EXPIRED);
        res.status(401).send(responseData.unauthorized)
    }
}

module.exports = {
    createToken: generateToken,
    validateToken: validateToken,
}