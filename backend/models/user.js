const mongoose = require("mongoose");


const userSchema = mongoose.Schema({
    Firstname: { type: String, require },
    Lastname:{ type: String, require },
    Phone:{ type: String, require },
    Cin:{ type: String, require },
    Email: { type: String, require },
    Password: { type: String, require },
    Role: { type: String, require},
    FirstTimeLogin: { type: Boolean, default: false }

}, {
    timestamps: true,
})

const User= mongoose.model('User', userSchema)

module.exports = User