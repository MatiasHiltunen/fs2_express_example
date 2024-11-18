import test from 'node:test'
import assert from 'assert'
import { createTestDb } from './database.test.js'
import { UserRepository } from '../repository.js'
import { UserService } from '../services.js'
import { hash } from 'bcrypt'




test("Test user service", async (t)=>{


    const db = await createTestDb()

    const userRepository = new UserRepository({databaseConnection: db})
    const userService = new UserService({userRepository})


    assert.ok(userService, "user service created")


    await t.test("create user account", async ()=>{

        const id = await userService.createUser({
            username: "testuser",
            hashedPassword: await hash("salasana", 10),
            role: 'user'
        })

        assert.equal(id, 1)

    })


    await t.test("test login", async ()=>{


        const token = await userService.authenticateClient({
            password: "salasana",
            username: "testuser"
        })

        assert.ok(token)
      
    })

    await t.test("test login failed", async ()=>{

        await assert.rejects(async ()=>{
            await userService.authenticateClient({
                password: "salasana123",
                username: "testuser"
            })

        },(err)=>{
            assert.strictEqual(err.message, 'Password does not match')
            return true
        })
      

    })

})