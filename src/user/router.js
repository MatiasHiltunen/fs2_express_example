import { Router } from "express";
import { UserController } from "./controller.js";
import { AuthMiddleware } from "../middlewares/auth.js";
import { UserRepository } from "./repository.js";
import { db } from "../../database/sqlite.js";
import { UserService } from "./services.js";


const userRepository = new UserRepository({databaseConnection: db})
const userService = new UserService({userRepository})



const userController = new UserController({userService: userService})
const authMiddleware = new AuthMiddleware({userService: userService})

const router = Router();

const admin = [authMiddleware.authenticate(), authMiddleware.adminOnly()]

router.get('/user/account', authMiddleware.authenticate(), userController.getAccount())
router.post('/user/login', userController.authenticateUser())
router.post('/user/logout', authMiddleware.authenticate(), userController.logoutUser())

router.get('/user', admin, userController.getAllUsers())
router.post('/user', userController.createUser())
router.put('/user', authMiddleware.authenticate(), userController.updateUser())

router.get('/user/:id', admin, userController.getUserById())
router.delete('/user/:id', admin, userController.deleteUser())

export default router