import  { Router } from 'express'
import {fetchUserController} from '../controller/Users/fetchUserController.ts'
import {createUserController} from '../controller/Users/createUserController.ts'
import { updateUserProfileController } from '../controller/Users/updateUserProfile.ts'

const userRoute = Router()

// Route for create the user
userRoute.route('/').post(createUserController)

// Route for fetch specific route
userRoute.route('/:mobileNumber').get(fetchUserController)

userRoute.route('/:mobileNumber').put(updateUserProfileController)

export {userRoute}