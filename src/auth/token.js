import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../config.js"

export function createAccessToken(claims = {}) {

    return new Promise((resolve, reject) => {

        const jti = crypto.randomUUID()

        jwt.sign(claims, JWT_SECRET, {
            expiresIn: '1h',
            jwtid: jti
        }, (error, token) => {

            if (error) {
                return reject(error)
            }

            resolve({token, jti})

        })

    })
}

export function verifyAccessToken(accessToken){


    return new Promise((resolve, reject)=>{

        jwt.verify(accessToken, JWT_SECRET, (error, decoded)=>{

            if(error){
                return reject(error)
            }

            resolve(decoded)

        })

    })

}