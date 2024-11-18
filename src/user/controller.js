import { saltRounds } from "../config.js"
import { hash } from "bcrypt";
import { createUserSchema, loginUserSchema, updateUserSchema } from './schemas.js';


export class UserController {

    constructor({ userService }) {
        this.userService = userService
    }

    getUserById() {
        return async (req, res) => {

            try {

                const user = await this.userService.fetchById(req.params.id)

                if (!user) {
                    return res.status(404).json({ error: "User not found" })
                }

                res.json(user)

            } catch (err) {
                return res.status(500).send()
            }
        }
    }

    getAllUsers() {
        return async (req, res) => {

            try {
                const users = await this.userService.fetchAllUsers()

                if (!users) {
                    return res.status(404).json({
                        error: 'Users not found'
                    })
                }

                res.json(users)

            } catch (err) {
                res.status(500).send()
            }
        }

    }

    getAccount() {
        return (req, res) => {

            if (req.userData) {
                res.json(req.userData)
            } else {
                res.status(500).send()
            }

        }
    }

    createUser() {

        return async (req, res) => {

            try {

                const { password, username, age, role } = createUserSchema.parse(req.body)

                const hashedPassword = await hash(password, saltRounds)

                const id = await this.userService.createUser({
                    username,
                    hashedPassword,
                    age,
                    role
                })

                res.status(201).json({ id })

            } catch (err) {
                console.log(err)
                res.status(500).json({
                    error: err
                })
            }
        }

    }

    updateUser() {
        return async (req, res) => {

            try {

                const { username, age, id } = updateUserSchema.parse(req.body)

                await this.userService.updateUser({ username, age, id })

                res.status(200).send()
            } catch (err) {
                res.status(500).send()
            }
        }

    }

    deleteUser() {
        return async (req, res) => {

            try {
                const id = req.params.id

                await this.userService.deleteUser(id)

                res.status(200).send()

            } catch (err) {
                console.log(err)
                res.status(500).send()
            }
        }
    }

    authenticateUser() {
        return async (req, res) => {
            try {

                const credentials = loginUserSchema.parse(req.body)

                const token = await this.userService.authenticateClient(credentials)

                res.cookie('accessToken', token, {
                    httpOnly: true,
                    sameSite: "lax",
                    secure: true
                })

                return res.json({
                    msg: "Login successful"
                })

            } catch (err) {
                console.log(err)
                res.status(500).send()
            }
        }
    }

    logoutUser() {
        return async (req, res) => {
            try {

                if (!req?.userData?.id) {
                    throw new Error("Userdata is required when logging out")
                }

                await this.userService.setJtiUser({
                    jti: null,
                    id: req.userData.id
                })

                res.clearCookie('accessToken')
                res.send()

            } catch (error) {
                console.log(error)
                res.clearCookie('accessToken')
                res.status(500).send("There was an error while logging out, try to login again")
            }
        }
    }
}