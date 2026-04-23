// import {Schema,model} from 'mongoose'
import {Schema,Document,model} from 'mongoose'

interface IUser extends Document {
    firstName:string,
    lastName:string,
    mobileNumber:string,
    avatarURL:string,
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        mobileNumber: {
            type: String,
            required: true,
            unique: true,
            match: [
                /^[6-9]\d{9}$/,
                "Mobile number must be 10 digits and start from 6-9",
            ],
        },
        avatarURL:{
            type:String,
            match:[/^https?:\/\/.+\..+$/,"Invalid URL"]
        }
    },
    { timestamps: true }
);

// const UserSchema = new Schema({

//     firstName:{
//         type:String,
//         required:true,
//         trim:true,
//     },
//     lastName:{
//         type:String,
//         required:true,
//         trim:true
//     },
//     mobileNumber:{
//         type:String,
//         required: true,
//         unique: true,
//         match:[/^[6-9]\d{9}$/,"Mobile number must be 10 digits and start from 6-9"]
//     }

// },{timestamps:true})

export default model<IUser>("USER",UserSchema)