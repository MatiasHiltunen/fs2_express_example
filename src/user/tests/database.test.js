import { test } from 'node:test'
import assert from 'assert';
import { hash } from 'bcrypt'
import { UserRepository } from '../repository.js';
import sqlite3 from 'sqlite3';
import { saltRounds } from '../../config.js';

export async function createTestDb() {

    return new Promise((resolve, reject) => {
        let db = null

        db = new sqlite3.Database(':memory:', (err) => {
            if (err) {
                reject(err)
            }
            resolve(db)
        })
    })

}



test('test user\'s database operations', async (t) => {


    const db = await createTestDb()

    t.test("test-database connection", () => {

        assert.ok(db, "connection ok")
    })

    const userRepository = new UserRepository({ databaseConnection: db })

    await t.test('creating new user', async () => {
        const id = await userRepository.create({
            username: 'testuser12',
            hashedPassword: await hash('salasana', saltRounds),
            age: 50,
            role: 'user'
        })


        assert.ok(id, "id not null or undefined")


    })

    await t.test('error when duplicate username is provided', async (t) => {

        await assert.rejects(userRepository.create({
            username: 'testuser12',
            hashedPassword: await hash('salasana', saltRounds),
            age: 50,
            role: 'user'
        }), (err) => {
            assert.strictEqual(err.message, 'SQLITE_CONSTRAINT: UNIQUE constraint failed: user.username');
            return true
        },
            "Should throw unique constraint error for duplicate username"
        );

    })

   
    await t.test('test getting user by username', async () => {

        const user = await userRepository.getByUsername('testuser12')

        assert.equal(user.role, 'user')

    })

})