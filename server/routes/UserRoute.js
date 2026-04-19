import express, { Router } from 'express'
import {fetchUserController} from '../controller/Users/fetchUserController.js'
import {createUserController} from '../controller/Users/createUserController.js'

const userRoute = Router()

// Route for create the user
userRoute.route('/').post(createUserController)

// Route for fetch specific route
userRoute.route('/:mobileNumber').get(fetchUserController)

export {userRoute}