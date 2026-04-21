// import {Schema,model} from 'mongoose'
import {Schema,model,Document,Types} from 'mongoose'

interface IMessage extends Document{
    conversationId:Types.ObjectId,
    type: "Text" | "Image" | "Document",
    content:{
        text?:string
    },
    senderMobileNumber: string;
    deleted: boolean;
    edited: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// const MessageSchema = new Schema<IMessage> extends Document({

//     conversationId : {
//         type:Schema.Types.ObjectId,
//         ref:"CONVERSATION",
//         requird:true
//     },
//     type:{
//         type:String,
//         enum:['Text','Image','Document'],
//         default:"Text"
//     },
//     content:{
//         text:{
//             type:String,
//         }
//     },
//     senderMobileNumber:{
//         type:String,
//         required: true,
//         match:[/^[6-9]\d{9}$/,"Mobile number must be 10 digits and start from 6-9"]
//     },
//     deleted:{
//         type:Boolean,
//         enum:[true,false],
//         default:false,
//     },
//     edited:{
//         type:Boolean,
//         enum:[true,false],
//         default:false,
//     },
// },{timestamps:true})

// export default model("MESSAGE",MessageSchema)

const MessageSchema = new Schema<IMessage>(
    {
        conversationId: {
            type: Schema.Types.ObjectId,
            ref: "CONVERSATION",
            required: true,
        },
        type: {
            type: String,
            enum: ["Text", "Image", "Document"],
            default: "Text",
        },
        content: {
            text: {
                type: String,
            },
        },
        senderMobileNumber: {
            type: String,
            required: true,
            match: [
                /^[6-9]\d{9}$/,
                "Mobile number must be 10 digits and start from 6-9",
            ],
        },
        deleted: {
            type: Boolean,
            default: false,
        },
        edited: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export default model<IMessage>("MESSAGE", MessageSchema);