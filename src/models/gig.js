const mongoose = require('mongoose');
const { gigStatus } = require('../constants/enum');

const PricingSchema = mongoose.Schema({
    custom_title: {
        type: String,
        required: true
    },
    custom_description: {
        type: String,
        required: true
    },
    delivery_days: {
        type: Number,
        required: true
    },
    revisions: {
        type: Number,
        required: true
    },
    service_price: {
        type: Number,
        require: true
    },
    service_options: {
        type: Object,
        required: true
    }
});
const RequirementSchema = mongoose.Schema({
    requirement: {
        type: String,
        required: true
    },
    required: {
        type: Boolean,
        default: false
    }
});
const stepSchema = new mongoose.Schema({
    step_title: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
});
const faqSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    }
});
const projectDescriptionSchema = new mongoose.Schema({
    project_summary: {
        type: String,
        required: true
    },
    faqs: {
        type: [faqSchema]
    }
});
const GigSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    freelancer_id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    sub_category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    skills: [
        {
            type: String
        }
    ],
    pricing: PricingSchema,
    images: {
        type: Array,
    },
    video: {
        type: String,
    },
    requirements: {
        type: [RequirementSchema],
        default: []
    },
    steps: {
        type: [stepSchema],
        required: true
    },
    project_description: {
        type: projectDescriptionSchema
    },
    status: {
        type: String,
        enum: [
            gigStatus.PENDING,
            gigStatus.ACCEPT,
            gigStatus.REJECT
        ],
        default: gigStatus.PENDING
    },
    terms: {
        type: Boolean,
        default: false
    },

    privacy_notice: {
        type: Boolean,
        default: false
    },

    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('Gig', GigSchema);
