import type {Request,Response} from 'express'
import UserModel from '../../model/User.model.ts'

interface FetchUserParams {
    mobileNumber:string
}

export async function fetchUserController(req:Request<FetchUserParams>,res:Response) {
    try {

        const {mobileNumber} = req.params

        if(!mobileNumber)
        {
            return res.status(400).json({
                message:"Mobile number is required",
                isSuccess:false
            })
        }

        // check mobile number is valid 
        if(!/^[6-9]\d{9}$/.test(mobileNumber))
        {
            return res.status(400).json({
                message:"Mobile Number must be 10 digit and start with 6-9",
                isSuccess:false,
            })
        }

        const user = await UserModel.findOne({
            mobileNumber
        })

        if(!user)
        {
            return res.status(404).json({
                message:"No User Exist with this Mobile Number",
                isSuccess:false,
            })
        }

        return res.status(200).json({
            message:"user Find",
            isSuccess:true,
            user
        })
 
    } catch (error) {
        console.log("Error in the fetchUser Controller:",error)
        return res.status(500).json({
            message:'Internal Server',
            isSuccess:false,
        })
    }
}