const urlConstants = {
    USER_REGISTER: '/register',
    VERIFY_EMAIL: '/email/verification',

    //==
    RESEND_VERIFY_EMAIL: '/email/resend-verification',
    // ===
    USER_PROFILE: '/profile',
    USER_LOGIN: '/login',
    GET_USER_PROFILE: '/get-user-profile',
    GET_USER_BY_ID: '/user',
    USER_PROFILE_IMAGE: '/user-profile-image',
    SEARCH_FREELANCERS: '/search-freelancers',
    PROFILE_DETAILS: '/profile-details',
    EDIT_PROFILE: '/edit-profile',
    DELETE_EXPERIENCE: '/delete-experience',
    REFRESH_TOKEN: '/token',
    UPLOAD_IMAGE: '/upload/image',
    SUBSCRIPTION_PLAN_LIST: '/subscription/plan',
    CREATE_SUBSCRIPTION: '/create/subscription',
    GET_USER_LIST: '/users/list',
    GET_OPTIONS_LIST: "/getOptionsList",
    GET_USER_JOB: '/users/jobs',
    // GET_ACTIVE_JOB_BY_FREELANCER_ID: '/freelancer/job/active',
    SUBMIT_OFFER_TASK: '/offer/task/submit',
    // GET_USER_PROFILE: '/users/profile',

    // Message
    MESSAGE_LIST: '/message-list',
    DELETE_MESSAGE: '/message/delete',
    CHAT_USER_LIST: '/user-chat-list',

    SAVE_PAYMENT_DETAILS: '/save-payment-details',
    CREATE_PAYMENT_INTENT: '/create/payment/intent',
    ONE_TIME_PAYMENT: '/payment-onetime',
    CHECKOUT_PAYMENT: '/payment-checkout',
    CHECKOUT_SUBSCRIPTION: '/subscription-checkout',
    CHECKOUT_SUBSCRIPTION_FREE_TRIAL: '/subscription-checkout-free-trial',
    GET_NOTIFICATION_LIST: '/notification/list',
    DELETE_NOTIFICATION: '/delete/notification',
    READ_NOTIFICATION: '/read/notification',
    SEND_INVITATION: '/invitation-send',
    UPDATE_INVITATION_STATUS: '/invitation-status-update',
    CLIENT_INVITATION_DETAILS: '/client-invitation-details',
    FREELANCER_INVITATION_DETAILS: '/freelancer/invitation-details',
    GET_INVITED_FREELANCERS: '/freelancers/invited',
    END_CONTRACT: '/contract/end',
    GET_REPORT_DATA: '/reports/freelancer',
    GET_CATEGORIES: '/categories',
    ADD_SUB_CATEGORIES: '/sub/categories',
    GET_SUB_CATEGORIES: '/categories/subcategories',
    ADD_SKILLS: '/skill/add',
    GET_SKILLS: '/categories/skills',
    GET_SKILL_SUBCATEGORY_CATEGORY: '/categories/subcategories/skills',
    // GET_INVITED_FREELANCERS_LIST: '/invited-freelancers-list',

    OFFER_SEND: '/offer/send',
    OFFER_UPDATE: '/offer/update',
    OFFERS_LIST_GET: '/offers/list',

    // JOB_HIRED_LIST_GET: '/client/all-hired',
    HIRED_LIST_GET: '/client/all-hired',
    JOB_HIRED_LIST_GET: '/client/hired',
    FREELANCER_OFFER_DETAILS: '/freelancer/offer-details',


    FORGOT_PASSWORD: '/forgot-password',
    CHANGE_PASSWORD: '/change-password',
    RESET_PASSWORD: '/reset-password',
    LIST_COUNTRIES: '/get-countries',
    GET_PROFILE_IMAGE: '/load-profile-image',


    CREATE_JOB_PROPOSAL: '/job-proposal',
    GET_JOB_PROPOSALS_BY_USER_ID: '/job-proposal-by-user-id/:id',
    GET_JOB_PROPOSALS_BY_JOB_ID: '/job/:jobId/proposal',
    GET_JOB_PROPOSALS: '/jobs/proposals',

    POST_FEEDBACK: '/feedback/add',
    GET_FEEDBACK: '/feedback',

    // Dashboard
    GET_JOB_POST_FOR_DASHBOARD: '/admin/dasboard/jobs',

    // = Job post url =
    ADD_JOB: '/job/create',
    CLOSE_JOB: '/job/close',
    GET_JOB: '/job/get-all',
    GET_SINGEL_JOB: '/job/get-job',
    GET_JOB_BY_USERID: '/job/client/jobs',
    DELETE_JOB: '/job/delete/:id',
    UPDATE_JOB: '/job/update/:id',
    JOB_SEARCH: '/job/search',
    // = Job post url =

    

    // Gig endpoints

    CREATE_GIG: '/freelancer/gig/create',
    UPLOAD_MULTIPLE_IMAGE: '/upload/multiple/images',
    UPLOAD_VIDEO: '/upload/video',
    GET_ALL_APPROVED_GIG: '/freelancer/approved/gigs',
    GET_ALL_GIG: '/freelancer/all/gig',
    GET_GIG_BY_USER_ID: '/freelancer/gig/getbyUserId',
    GET_GIG_BY_GIG_ID: '/freelancer/gig/getbyGigId',
    GIG_DELETE: '/freelancer/gig/delete',
    GIG_UPDATE: '/freelancer/gig/update',
    GIG_UPDATE_STATUS: '/freelancer/gig/status',

    // Agency
    GET_AGENCY: '/agency',
    GET_AGENCY_DATA: '/data/agency',
    CREATE_AGENCY: '/agency/create',
    UPDATE_AGENCY: '/agency/update',
    DELETE_AGENCY: '/agency/delete',
    GET_AGENCY_BY_ID: '/agencyById',
    GET_AGENCIES: '/all/agency',
    SEARCH_AGENCY: '/search/agency',
    SEND_AGENCY_INVITATION: '/agency/invite',
    UPDATE_INVITATION_BY_FREELANCER: '/freelancer/invite/update',
    UPDATE_INVITATION_BY_AGENCY: '/agency/invite/update',
    GET_INVITATION_STATUS_DATA: '/invitation/status'
}

module.exports = urlConstants;