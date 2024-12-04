import express from 'express';
import { register, login, updateUserProfile, logout, isloggedIn, userProfile, getUsers } from '../controllers/authController.js';
import { validateRegister, validateLogin } from '../middlewares/validateRequest.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/get-all-users',  getUsers);
router.put('/update-profile', protect,  authorize('user', 'admin'), updateUserProfile);
router.post('/isLogin/:token', isloggedIn);
router.get('/profile/:user', protect, authorize('user', 'admin'), userProfile);
router.get('/logout', logout);



export default router;
