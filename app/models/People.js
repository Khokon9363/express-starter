const mongoose = require('mongoose')

const PeopleSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            min: 3,
            max: 100
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            unique: true,
            min: 10,
            max: 100
        },
        phone: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            min: 11,
            max: 14
        },
        password: {
            type: String,
            required: true,
            min: 6,
            max: 32
        },
        avatar: {
            type: String,
            default: 'nophoto'
        },
        role: {
            type: String,
            enum: ['Admin', 'User'],
            default: 'User'
        }
    },
    {
        timestamps: true
    }
)

const People = mongoose.model("People", PeopleSchema)

module.exports = People