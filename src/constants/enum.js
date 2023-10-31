const userType = Object.freeze({
    FREELANCER: 'freelancer',
    CLIENT: 'client'
})

const messageType = Object.freeze({
    TEXT: 1,
    INVITATION: 2
})

const invitationStatus = Object.freeze({
    PENDING: 0,
    ACCEPT: 1,
    REJECT: 2
})

const paymentStatus = Object.freeze({
    SUCCESS: 1,
    FAIL: 2
})

const notificationType = Object.freeze({
    MESSAGE: 1,
    BOARD_INVITATION: 2,
    UPCOMING_EVENTS: 3,
    BOOK_SESSION: 4,
    COMMENT: 5
})

module.exports = {
    userType,
    messageType,
    invitationStatus,
    notificationType,
    paymentStatus
}