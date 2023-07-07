import express from 'express'
import { createUser, deleteUser, getAllUsers, getProfile, getSingleUser, loginUser, logoutUser, updateProfile, updateUserInfo } from '../controllers/user.js'
import { admin, auth } from '../../middleware/authMiddleware.js'




const router = express.Router()


// create a new user
router.post('/create', createUser)

// login an existing user
router.post('/login', loginUser)

// get user profile
router.get('/profile',auth, getProfile)

// update user profile
router.put('/profile/update', auth, updateProfile)

// get user logout
router.get('/logout', auth, logoutUser)

// get all users
router.get('/', auth, admin, getAllUsers)

// get single user
router.get('/:id', auth, admin, getSingleUser)

// delete a single user
router.delete('/:id', auth, admin, deleteUser)

// update a single user by id (Admin Only)
router.put('/:id', auth, admin, updateUserInfo)


export default router