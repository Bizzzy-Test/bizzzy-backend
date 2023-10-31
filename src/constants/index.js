const urlConstants = require('./url');
const responseData = require('./responses');
const messageConstants = require('./messages');
const { mailSubjectConstants, mailTemplateConstants } = require('./mail');
const { userType, messageType, invitationStatus, notificationType } = require('./enum');

module.exports = {
    urlConstants,
    responseData,
    messageConstants,
    userType,
    messageType,
    invitationStatus,
    notificationType,
    mailSubjectConstants,
    mailTemplateConstants
}