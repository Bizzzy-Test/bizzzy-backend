const userType = Object.freeze({
    FREELANCER: 1,
    CLIENT: 2,
    ADMIN: 3
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

// ==
const budgetType = Object.freeze({
    FIXED_BUDGET: 1,
    HOURLY: 2
})

const experienceType = Object.freeze({
    ENTRY: 'Entry',
    INTERMEDIATE: 'Intermediate',
    EXPERT: 'Expert'
})

const jobTypes = Object.freeze({
    PROJECT: "project",
    MILESTONE: "milestone",
    HOURLY: "hourly",
    FIXED: "fixed"
});
// ==



module.exports = {
    userType,
    messageType,
    invitationStatus,
    notificationType,
    paymentStatus,
    budgetType,
    experienceType,
    jobTypes
}