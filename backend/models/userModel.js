import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email address.`
        },
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    }
});

const User = mongoose.model('User', userSchema);

export default User;