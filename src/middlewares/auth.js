import { z } from 'zod'
import { verifyAccessToken } from '../auth/token.js'

export class AuthMiddleware {

    constructor({ userService }) {
        this.userService = userService
    }

    authenticate() {

        return async (req, res, next) => {

            try {

                const { accessToken } = req.cookies

                if (!accessToken) {
                    return res.status(401).send()
                }

                const { jti } = await verifyAccessToken(accessToken)

                if (!z.string().uuid().parse(jti)) {
                    throw new Error("jti is malformed or does not exist")
                }

                req.userData = await this.userService.getByJtiUser(jti)

                next()

            } catch (err) {
                console.log(err)
                res.status(401).send()
            }

        }
    }

    adminOnly() {
        return (req, res, next) => {

            if (req.userData && req.userData.role === 'admin') {
                return next()
            } else {
                res.status(401).send()
            }
        }
    }
}