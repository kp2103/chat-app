import {Schema,model} from 'mongoose'
import {v4 as uuidv4} from 'uuid'

const ConversationSchema = new Schema({
    conversationId:{
        type:String,
        unique:true,
        default:uuidv4
    },
    type:{
        type:String,
        enum:['Direct','Group'],
        required:true,
    },
    participants: [
      {
        // type: mongoose.Schema.Types.ObjectId,
        type:Schema.Types.ObjectId,
        ref: "USER",
        required: true
      }
    ],
    // Group-specific fields
    name: {
      type: String,
      trim: true,
      default: null
    },
},{timestamps:true})

export default model('CONVERSATION',ConversationSchema);


ConversationSchema.pre('validate',function(next){

    if(this.type === 'Direct' && this.participants.length !== 2)
    {
        return next(new Error("Direct conversation must have exactly 2 participants"))
    }

    if(this.type === 'Group')
    {
        if(this.participants.length<3)
            return next(new Error("Group must have at least 3 participants"))

        if(!this.name)
            return next(new Error("Group name is required"))
    }

})