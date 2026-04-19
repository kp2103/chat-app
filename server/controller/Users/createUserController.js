import UserModel from "../../model/User.model.js";

export async function createUserController(req,res) {
    try {
        // console.log("Req.Body",req.body)
        const {firstName,lastName,mobileNumber} = req.body

        if(!firstName || !lastName || !mobileNumber)
        {
            return res.status(400).json({
                message:"firstName,lastName and mobileNumber are required",
                isSuccess:false,
            })
        }

        const user = await UserModel.create({
            firstName,
            lastName,
            mobileNumber
        })

        return res.status(201).json({
            message:"New User created",
            isSuccess:true,
            user
        })

    } catch (error) {
        console.log("Error at createUser controller:",error)

        if(error.code === 11000)
        {
            return res.status(400).json({
                message:"Mobile number is already exist",
                isSuccess:false,
            })
        }

        if(error.name === 'ValidationError')
        {
            return res.status(400).json({
                message:error.message,
                isSuccess:false,
            })
        }

        return res.status(500).json({
            message:"Internal Server Error",
            isSuccess:false
        })
    }
}