import type {Request,Response} from 'express'
import UserModel from "../../model/User.model.ts";

interface CreateUserBody {
    firstName:string,
    lastName:string,
    mobileNumber:string,
    avatarURL:string
}

export async function createUserController(req:Request<{},{},CreateUserBody>,res:Response) {
    try {
        // console.log("Req.Body",req.body)
        const {firstName,lastName,mobileNumber,avatarURL} = req.body

        if(!firstName || !lastName || !mobileNumber || !avatarURL)
        {
            return res.status(400).json({
                message:"firstName,lastName and mobileNumber are required",
                isSuccess:false,
            })
        }

        const user = await UserModel.create({
            firstName,
            lastName,
            mobileNumber,
            avatarURL
        })

        return res.status(201).json({
            message:"New User created",
            isSuccess:true,
            user
        })

    } catch (error: unknown) {
        console.log("Error at createUser controller:", error);

        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            (error as { code?: number }).code === 11000
        ) {
            return res.status(400).json({
                message: "Mobile number already exists",
                isSuccess: false,
            });
        }

        if (error instanceof Error && error.name === "ValidationError") {
            return res.status(400).json({
                message: error.message,
                isSuccess: false,
            });
        }

        return res.status(500).json({
            message: "Internal Server Error",
            isSuccess: false,
        });
    }
}