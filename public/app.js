const loginForm = document.getElementById('login')

fetch('/api/v1/user/account').then((response) => {
    return response.json()
}).then((account) => {

    const button = document.createElement('BUTTON')
    const text = document.createTextNode("Hei " + account.username + "!")

    button.innerText = 'kirjaudu ulos'
    button.addEventListener('click', () => {

        fetch('/api/v1/user/logout', {
            method: 'POST',

        }).then((response) => {
            if (response.ok) {
                button.remove()
                text.remove()

               
            }
        }).catch((error) => {
            console.log(error)
        })
    })

    document.body.appendChild(button)
    document.body.appendChild(text)
})

loginForm.addEventListener('submit', (e) => {

    e.preventDefault()

    const data = new FormData(loginForm)
    const credentials = Object.fromEntries(data)

    fetch('/api/v1/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then((response) => {
        return response.json()
    }).then((data) => {
        console.log(data)

        fetch('/api/v1/user/account').then((response) => {
            return response.json()
        }).then((account) => {

            const button = document.createElement('BUTTON')
            const text = document.createTextNode("Hei " + account.username + "!")

            button.innerText = 'kirjaudu ulos'
            button.addEventListener('click', () => {

                fetch('/api/v1/user/logout', {
                    method: 'POST',

                }).then((response) => {
                    if (response.ok) {
                        button.remove()
                        text.remove()

                       
                    }
                }).catch((error) => {
                    console.log(error)
                })
            })

            document.body.appendChild(button)
            document.body.appendChild(text)
        })
    })
})

