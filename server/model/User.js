const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        unique: true,
        trim: true,
        required: [true, "Please Input User Name!"]
    },
    Name: {
        type: String
    },
    role: {
        type: String,
        enum: ['admin', 'customer'],
        default: 'customer'
    },
    saldo: {
        type: Number,
        default: 0
    },
    poin: {
        type: Number,
        default: 0
    },

    password: {
        type: String,
        required: [true, "Please Input Password!"],
        minlength: 6,
        trim: true
    },
    passwordConfirm: {
        type: String,
        minlength: 7,
        trim: true,
        required: [true, "Please Input Password Confirmation!"],
        validate(value) {
            if (this.password !== this.passwordConfirm) {
                return true;
            }
        }
    },
    tokens: [
        {
            token: { type: String }
        },
    ]
}, { timestamps: true }
)

// jwt auth
userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, "robby", {
        expiresIn : "1 days",
    });

    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
}

// hiding key 
userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.passwordConfirm;
    delete userObject.tokens;

    return userObject;
}

//login cek
userSchema.statics.findByCredentials = async (userName, password) => {
    const user = await User.findOne({userName});

    if (!user) {
        throw Error("User Not Found!");
    }

    const isMatch = bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw Error("Wrong Password!");
    }

    return user;
}

//hashing password
userSchema.pre("save", async function(next){
    const user = this;

    if (user.isModified("password")) {
        user.password = bcrypt.hash(user.password, 9);
    }
    if (user.isModified("passwordConfirm")) {
        user.passwordConfirm = bcrypt.hash(user.passwordConfirm, 9);
    }
    next();
});

const User = mongoose.model('user', userSchema);

module.exports = { User }