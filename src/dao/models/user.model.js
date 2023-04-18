import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        
    },
    first_name: {
        type: String,
        
    },
    last_name: {
        type: String,
        
    },
    age: {
        type: Number,
        
    },
    password: {
        type: String,
        
    }
});

export const UserModel = mongoose.model("user",userSchema);