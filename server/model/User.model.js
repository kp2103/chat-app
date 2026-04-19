import {Schema,model} from 'mongoose'

const UserSchema = new Schema({

    firstName:{
        type:String,
        required:true,
        trim:true,
    },
    lastName:{
        type:String,
        required:true,
        trim:true
    },
    mobileNumber:{
        type:String,
        required: true,
        unique: true,
        match:[/^[6-9]\d{9}$/,"Mobile number must be 10 digits and start from 6-9"]
    }

},{timestamps:true})

export default model("USER",UserSchema)