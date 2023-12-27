const urlConstants = {
    USER_REGISTER: '/register',
    VERIFY_EMAIL: '/verify-email',

    //==
    RESEND_VERIFY_EMAIL: '/resend-verify-email',
    // ===
    USER_PROFILE: '/profile',
    USER_LOGIN: '/login',
    GET_USER_PROFILE: '/get-user-profile',
    GET_USER_BY_ID: '/user/:id',
    USER_PROFILE_IMAGE: '/user-profile-image',
    SEARCH_FREELENCERS: '/search-freelencers',
    PROFILE_DETAILS: '/profile-details',
    EDIT_PROFILE: '/edit-profile',
    DELETE_EXPERIENCE: '/delete-experience',
    REFRESH_TOKEN: '/token',
    UPLOAD_IMAGE: '/upload/image',
    SUBSCRIPTION_PLAN_LIST: '/subscription/plan',
    CREATE_SUBSCRIPTION: '/create/subscription',
    MESSAGE_LIST: '/message-list',
    GET_USER_LIST: '/users/list',
    GET_OPTIONS_LIST: "/getOptionsList",
    GET_ACTIVE_JOB_BY_FREELANCER_ID: '/freelancer/job/active',
    SUBMIT_OFFER_TASK: '/offer/task/submit',
    // GET_USER_PROFILE: '/users/profile',

    SAVE_PAYMENT_DETAILS: '/save-payment-details',
    CHAT_USER_LIST: '/user-chat-list',
    CREATE_PAYMENT_INTENT: '/create/payment/intent',
    ONE_TIME_PAYMENT: '/payment-onetime',
    CHECKOUT_PAYMENT: '/payment-checkout',
    CHECKOUT_SUBSCRIPTION: '/subscription-checkout',
    CHECKOUT_SUBSCRIPTION_FREE_TRIAL: '/subscription-checkout-free-trial',
    GET_NOTIFICATION_LIST: '/notification/list',
    DELETE_NOTIFICATION: '/delete/notification',
    READ_NOTIFICATION: '/read/notification',
    ADVISOR_CATEGRY_FILTER: '/advisors/filter',
    SEND_INVITATION: '/invitation-send',
    UPDATE_INVITATION_STATUS: '/invitation-status-update',
    CLIENT_INVITATION_DETAILS: '/client-invitation-details',
    FREELANCER_INVITATION_DETAILS: '/freelancer/invitation-details',
    GET_INVITED_FREELANCERS: '/freelencers/invited',
    END_CONTRACT: '/contract/end',
    GET_REPORT_DATA: '/reports',
    GET_CATEGORIES: '/category',
    ADD_SKILLS: '/add/skill',
    GET_SKILLS: '/skills',
    // GET_INVITED_FREELANCERS_LIST: '/invited-freelancers-list',

    OFFER_SEND: '/offer-send',
    OFFER_UPDATE: '/offer-update',
    OFFERS_LIST_GET: '/get-offers-list',

    // JOB_HIRED_LIST_GET: '/client/all-hired',
    HIRED_LIST_GET: '/client/all-hired',
    JOB_HIRED_LIST_GET: '/client/hired',

    FREELANCER_OFFER_DETAILS: '/freelancer/offer-details',

    ADD_COMMENT: '/comment',
    ADD_GOAL: '/goal',
    GET_GOAL_LIST: '/goal',
    UPDATE_GOAL_IS_COMPLETED: '/updateIsCompleted',
    REPLY_COMMENT: '/reply-comment',
    COMMENT_LIST: '/comment/list',
    ADD_EVENT: '/event',
    LIST_CATEGORY: '/getAllCategories',

    FORGOT_PASSWORD: '/forgot-password',
    CHANGE_PASSWORD: '/change-password',
    RESET_PASSWORD: '/reset-password',
    LIST_COUNTRIES: '/get-countries',
    GET_PROFILE_IMAGE: '/load-profile-image',


    CREATE_JOB_PROPOSAL: '/job-proposal',
    GET_JOB_PROPOSALS_BY_USER_ID: '/job-proposal-by-user-id/:id',
    GET_JOB_PROPOSALS_BY_JOB_ID: '/job/:jobId/proposal',
    GET_PROPOSAL_BY_USER: '/job-proposal-by-user',

    POST_FEEDBACK: '/add/feedback',
    GET_FEEDBACK: '/feedback',

    // Dashboard
    GET_JOB_POST_FOR_DASHBOARD: '/admin/dasboard/jobs',

    // = Job post url =
    ADD_JOB: '/job/create',
    CLOSE_JOB: '/job/close',
    GET_JOB: '/job/get-all',
    GET_SINGEL_JOB: '/job/get-job/:id',
    GET_JOB_BY_USERID: '/job/client/jobs',
    DELETE_JOB: '/job/delete/:id',
    UPDATE_JOB: '/job/update/:id',
    JOB_SEARCH: '/job/search',
    // = Job post url =

}

module.exports = urlConstants;