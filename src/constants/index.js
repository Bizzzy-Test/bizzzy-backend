const urlConstants = require('./url');
const responseData = require('./responses');
const messageConstants = require('./messages');
const { mailSubjectConstants, mailTemplateConstants } = require('./mail');
const { userType, messageType, invitationStatus, notificationType, ...enums } = require('./enum');

module.exports = {
    urlConstants,
    responseData,
    messageConstants,
    userType,
    messageType,
    invitationStatus,
    notificationType,
    mailSubjectConstants,
    mailTemplateConstants,
    ...enums
}