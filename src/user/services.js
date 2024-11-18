import { compare } from "bcrypt";
import { createAccessToken } from "../auth/token.js";

export class UserService {

    constructor({userRepository}) {
        this.userRepository = userRepository
    }

    async fetchById(id) {
        return await this.userRepository.getById(id)
    }

    async fetchUserByUsername(username) {
        return await this.userRepository.getByUsername(username)
    }

    async fetchAllUsers() {
        return await this.userRepository.getAll()
    }

    async createUser(userData) {
        return await this.userRepository.create(userData)
    }

    async updateUser(userData) {
        return await this.userRepository.update(userData)
    }

    async deleteUser(id) {
        return await this.userRepository.remove(id)
    }

    async setJtiUser(data) {
        return await this.userRepository.setJti(data)
    }

    async getByJtiUser(jti) {
        return await this.userRepository.getUserByJti(jti)
    }

    async authenticateClient({ username, password }) {


        const user = await this.fetchUserByUsername(username)

        if (!user) {
            throw new Error("User not found")
        }

        const isAuthenticated = await compare(password, user.password)

        if (!isAuthenticated) {
            throw new Error("Password does not match")
        }

        const { token, jti } = await createAccessToken()

        if (!token || !jti) {
            throw new Error("Token or jti not present in authentication service")
        }

        await this.setJtiUser({
            jti,
            id: user.id
        })

        return token
    }

}