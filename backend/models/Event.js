const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please provide an event title"],
        trim: true,
        maxlength: [100, "Title cannot be more than 100 characters"]
    },
    date: {
        type: String,
        required: [true, "Please provide an event date"],
        trim: true
    },
    time: {
        type: String,
        required: [true, "Please provide an event time"],
        trim: true
    },
    description: {
        type: String,
        default: "",
        maxlength: [500, "Description cannot be more than 500 characters"]
    },
    location: {
        type: String,
        default: "Campus",
        trim: true
    },
    category: {
        type: String,
        enum: ["Academic", "Social", "Sports", "Cultural", "Workshop", "Other"],
        default: "Other"
    },
    attendees: {
        type: Number,
        default: 0
    },
    image: {
        type: String,
        default: "https://via.placeholder.com/400x200"
    },
    registrationLink: {
        type: String,
        default: ""
    },
    reviews: [{
        user: String,
        comment: String,
        date: { type: Date, default: Date.now }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
eventSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("Event", eventSchema);
