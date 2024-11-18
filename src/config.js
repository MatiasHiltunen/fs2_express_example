export const JWT_SECRET = process.env['JWT_SECRET']

export const PORT = process.env['PORT'] || 3000
export const saltRounds = 10

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable must initilized")
}