const urlConstants = {
    USER_REGISTER: '/register',
    VERIFY_EMAIL: '/verify-email',

    //==
    RESEND_VERIFY_EMAIL: '/resend-verify-email',
    // ===
    USER_PROFILE: '/profile',
    USER_LOGIN: '/login',
    GET_USER_PROFILE: '/get-user-profile',
    PROFILE_DETAILS: '/profile-details',
    UPDATE_EXPERIENCE: '/edit-experience',
    DELETE_EXPERIENCE: '/delete-experience',
    REFRESH_TOKEN: '/token',
    UPLOAD_IMAGE: '/upload/image',
    SUBSCRIPTION_PLAN_LIST: '/subscription/plan',
    CREATE_SUBSCRIPTION: '/create/subscription',
    MESSAGE_LIST: '/message-list',
    GET_USER_LIST: '/users/list',

    GET_OPTIONS_LIST:"/getOptionsList",
    // GET_USER_PROFILE: '/users/profile',

    SAVE_PAYMENT_DETAILS: '/save-payment-details',
    CHAT_USER_LIST: '/user-chat-list',
    CREATE_PAYMENT_INTENT: '/create/payment/intent',
    ONE_TIME_PAYMENT:'/payment-onetime',
    CHECKOUT_PAYMENT:'/payment-checkout',
    CHECKOUT_SUBSCRIPTION: '/subscription-checkout',
    CHECKOUT_SUBSCRIPTION_FREE_TRIAL: '/subscription-checkout-free-trial',
    GET_NOTIFICATION_LIST: '/notification/list',
    DELETE_NOTIFICATION: '/delete/notification',
    READ_NOTIFICATION: '/read/notification',
    ADVISOR_CATEGRY_FILTER: '/advisors/filter',
    SEND_INVITATION: '/invitation-send',
    UPDATE_INVITATION_STATUS: '/invitation-status-update',
    GET_INVITATION_DETAILS: '/invitation-details',
    ADD_COMMENT: '/comment',
    ADD_GOAL: '/goal',
    GET_GOAL_LIST:'/goal',
    UPDATE_GOAL_IS_COMPLETED: '/updateIsCompleted',
    REPLY_COMMENT: '/reply-comment',
    COMMENT_LIST: '/comment/list',
    ADD_EVENT: '/event',
    LIST_CATEGORY: '/getAllCategories',
    LIST_ADVISORS: '/getAllAdvisors',
    FORGOT_PASSWORD: '/forgot-password',
    CHANGE_PASSWORD: '/change-password',
    RESET_PASSWORD: '/reset-password',
    CREATE_SESSION: '/create-session',
    GET_SESSION_LIST: '/session',
    BOOK_SESSION: '/book-session',
    LIST_COUNTRIES: '/get-countries',
    ADD_ADVISOR_RATE: '/addAdvisorRate',
    GET_ADVISOR_RATE: '/getAdvisorRate',
    GET_USER_SESSION_LIST: '/user/session',
    GET_PAID_SESSION_LIST: '/paid/user/session',
    GET_PROFILE_IMAGE: '/load-profile-image',
    ADD_TO_BOARD:'/add/board',
    REMOVE_ADVISOR_FROM_BOARD:'/remove/advisor',
    LIST_BOARD_MEMBER:'/list/board/memeber',


    CREATE_JOB_PROPOSAL: '/job-proposal',
    GET_JOB_PROPOSALS_BY_USER_ID: '/job-proposal-by-user-id/:userId',
    GET_JOB_PROPOSALS_BY_JOB_ID: '/job-proposal-by-job-id/:jobId',

    POST_FEEDBACK: '/add/feedback',

    // = Job post url =
    ADD_JOB: '/job/create',
    GET_JOB: '/job/get-all',
    GET_SINGEL_JOB: '/job/get-job/:id',
    GET_JOB_BY_USERID: '/job/get-by-user-id/:id',
    DELETE_JOB: '/job/delete/:id',
    UPDATE_JOB: '/job/update/:id',
    JOB_SEARCH: '/job/search',
    // = Job post url =
  
}

module.exports = urlConstants;