import express from "express";
import cookieParser from "cookie-parser";
import userRouter from './src/user/router.js'
import { PORT } from "./src/config.js";
import helmet from "helmet";
import cors from 'cors'

const API_VERSION = '/api/v1'

const app = express();

app.use(cors())
app.use(helmet())
app.use(express.json())
app.use(cookieParser())
app.use(express.static('public'))

app.use(API_VERSION, userRouter)

app.listen(PORT, () => {
    console.log('HTTP Server is running on http://localhost:' + PORT)
})
