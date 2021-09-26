const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us tour name!']
    },
    email: {
        type: String,
         required: [true, 'Please provide an email'],
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 4,
        select: false
    },
    confirmPassword: {
        type: String,
         required: [true, 'Please enter password again'],
    },
    createdAt: {
        type: String,
        default: Date.now()
    }
})

userSchema.pre('save', async function (next) {
    // Only run this function, if password was actually modified
    if (!this.isModified('password')) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {

        const changedTimestamp=parseInt( this.passwordChangedAt.getTime()/1000, 10);
        console.log(changedTimestamp, JWTTimestamp);
        return JWTTimestamp < changedTimestamp; //100<200
    }

    // False means not changed
    return false;
}

const User = mongoose.model('User', userSchema);



module.exports = User;