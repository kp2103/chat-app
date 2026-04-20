import {Schema,model} from 'mongoose'

const MessageSchema = new Schema({

    conversationId : {
        type:Schema.Types.ObjectId,
        ref:"CONVERSATION",
        requird:true
    },
    type:{
        type:String,
        enum:['Text','Image','Document'],
        default:"Text"
    },
    content:{
        text:{
            type:String,
        }
    },
    senderMobileNumber:{
        type:String,
        required: true,
        match:[/^[6-9]\d{9}$/,"Mobile number must be 10 digits and start from 6-9"]
    },
    deleted:{
        type:Boolean,
        enum:[true,false],
        default:false,
    },
    edited:{
        type:Boolean,
        enum:[true,false],
        default:false,
    },
},{timestamps:true})

export default model("MESSAGE",MessageSchema)