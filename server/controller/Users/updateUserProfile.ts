import UserModel from "../../model/User.model.ts";
import type {Request,Response} from 'express' 

interface UpdateUserProfileParam{
    mobileNumber:string
}

interface UpdateUserProfileBody{
    avatarURL:string,
    firstName:string,
    lastName:string,
    newMobileNumber:string
}

export async function updateUserProfileController(req:Request<UpdateUserProfileParam,{},UpdateUserProfileBody>,res:Response)
{
    try {
        const {mobileNumber} = req.params
        const {avatarURL,firstName,lastName,newMobileNumber} = req.body

        if(!mobileNumber || !avatarURL || !firstName || !lastName || !newMobileNumber)
        {
            return res.status(400).json({
                message:"avatarURL or firstName or lastName or mobileNumber is required",
                isSuccess:false,
            })
        }

        // check mobilenumber and newMobikenumber
        const mobileNumberRegex = /^[6-9]\d{9}$/
        if(!mobileNumberRegex.test(mobileNumber) || !mobileNumberRegex.test(newMobileNumber))
        {
            return res.status(400).json({
                message:"Mobile number must start with 6-9 and have exactly 10 digit",
                isSuccess:false
            })
        }

        // fetch the user
        const updatedUserDoc = await UserModel.findOneAndUpdate(
            {mobileNumber},
            {$set :{firstName,lastName,avatarURL,mobileNumber:newMobileNumber}},
            {new:true,runValidators:true}
        ).select('firstName lastName mobileNumber avatarURL')

        if(!updatedUserDoc)
        {
            return res.status(404).json({
                message:"No user exist with mobile number",
                isSuccess:false,
            })
        }

        return res.status(200).json({
            message:"User profile updated",
            isSucess:true,
            user:updatedUserDoc
        })

        
    } catch (error) {
        console.log("Error in updteUserProfile controller:",error)

        return res.status(500).json({
            message:"Internal server error",
            isSuccess:false
        })
    }
}