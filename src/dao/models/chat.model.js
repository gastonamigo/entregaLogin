import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    messages: {
        type: [
            {
                user: {
                    type: String
                },
                message: {
                    type: String
                }
            }
        ],
        default: []
    }
})

const chatModel = mongoose.model("messages", chatSchema)
export default chatModel