import mongoose from 'mongoose';

const userDetails = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        lowercase: true,
        required: [true, 'Name is required']
    },
    relation: {
        type: String,
        enum: ['Friend', 'Relative', 'Other'],
        required: [true, 'Relation is required']
    },
    phone: {
        type: String,
        required: [true, 'phone is required'],
        validate: {
            validator: function (v) {
                return /\d{10}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number.`
        },
    },
    address: {
        type: String,
        required: [true, 'Address is required']
    }
});

const Detail = mongoose.model('Detail', userDetails);

export default Detail;