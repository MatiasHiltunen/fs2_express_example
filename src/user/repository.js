export class UserRepository {

    constructor({ databaseConnection }) {
        this.db = databaseConnection

        if(!this.db) {
            throw new Error("Database connection does not exist")
        }

        this.createUserTableIfNotExist().then(()=>{
            console.log("Database: User OK")
        }).catch((err)=>{
            console.log("Failed to initialize User-database due to error: ", err)
        })
    }

    createUserTableIfNotExist() {

        return new Promise((resolve, reject) => {

            this.db.exec(`
            CREATE TABLE IF NOT EXISTS 
            user (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                username TEXT NOT NULL UNIQUE, 
                password TEXT NOT NULL, 
                age INTEGER, 
                jti TEXT, 
                role TEXT NOT NULL
            ) 
            STRICT`, (err) => {
                if (err) {
                    return reject(err)
                }

                resolve()
            })
        })

    }

    getById(id) {

        return new Promise((resolve, reject) => {

            this.db.get('SELECT id, username, age, role FROM user WHERE id = ?', [id], (err, row) => {

                if (err) {
                    return reject(err)
                }

                resolve(row)
            })
        })
    }


    getAll() {

        return new Promise((resolve, reject) => {

            this.db.all('SELECT id, username, age, role FROM user', [], (err, rows) => {

                if (err) {
                    return reject(err)
                }

                resolve(rows)
            })
        })
    }


    create({ username, hashedPassword, age, role }) {
        return new Promise((resolve, reject) => {


            const stmt = this.db.prepare("INSERT INTO user VALUES (NULL, ?, ?, ?, NULL, ?)")


            stmt.run(username, hashedPassword, age, role, function (err) {

                if (err) {
                    console.log(err)
                    return reject(err)
                }

                resolve(this.lastID)

            })

        })
    }

    update({ username, age, id }) {

        return new Promise((resolve, reject) => {

            const stmt = this.db.prepare("UPDATE user SET username = ?, age = ? WHERE id = ?")

            stmt.run([username, age, id], function (err) {

                if (err || this.changes === 0) {
                    return reject(err)
                }

                resolve()
            })

        })
    }

    remove(id) {

        return new Promise((resolve, reject) => {

            this.db.run("DELETE FROM user WHERE id = ?", [id], function (err) {

                if (err || this.changes === 0) {
                    return reject(err)
                }

                resolve()

            })

        })

    }

    getByUsername(username) {


        return new Promise((resolve, reject) => {


            this.db.get('SELECT id, password, role FROM user WHERE username = ?', [username], async (err, row) => {


                if (err || !row) {
                    return reject(err)
                }

                resolve(row)

            })

        })

    }

    setJti({ jti, id }) {

        return new Promise((resolve, reject) => {

            const stmt = this.db.prepare("UPDATE user SET jti = ? WHERE id = ?")

            stmt.run([jti, id], (err) => {
                if (err) {
                    return reject(err)
                }

                resolve()

            })
        })

    }


    getUserByJti(jti) {

        return new Promise((resolve, reject) => {

            this.db.get('SELECT id, username, age, role FROM user WHERE jti = ?', [jti], (err, row) => {

                if (err || !row) {
                    return reject(err)
                }

                resolve(row)
            })

        })
    }

}