const mailSubjectConstants = {
    RESET_PASS_SUBJECT: 'Password Reset Successfully',
    FORGOT_PASS_SUBJECT: 'Forgot Password',
    FORGOTTED_PASS_SUBJECT: 'Password Changed Successfully',
    SESSION_BOOKED_SUCCESSFULLY: 'Session Booked Successfully',
    VERIFY_EMAIL_SUBJECT: 'Complete Your Registration: Verify Your Email'
}

const mailTemplateConstants = {
    VERIFY_EMAIL_TEMPLATE: 'verify_email_template.ejs',
    RESET_PASS_TEMPLATE: 'reset_password_template.ejs',
    FORGOT_PASS_TEMPLATE: 'forgot_password_template.ejs',
    FORGOTTED_PASS_TEMPLATE: 'forgotted_password_template.ejs',
    BOOK_SESSION: 'book_session.ejs',
    INVITATION_TEMPLATE: 'invite.ejs',
    SEND_OFFER: 'send_offer.ejs'
}

module.exports = { mailSubjectConstants, mailTemplateConstants };