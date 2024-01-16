const mongoose = require('mongoose');
const { gigStatus } = require('../constants/enum');

const PricingSchema = mongoose.Schema({
    custom_title: {
        type: String
    },
    custom_description: {
        type: String
    },
    delivery_days: {
        type: Number
    },
    revisions: {
        type: Number
    },
    service_options: {
        type: [String]
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
        type: mongoose.Schema.Types.ObjectId
    },
    category: {
        type: mongoose.Schema.Types.ObjectId
    },
    skills: [
        {
            type: String
        }
    ],
    pricing: PricingSchema,
    images: {
        type: Array,
        required: true
    },
    video: {
        type: String,
        required: true
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
    services: {
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
