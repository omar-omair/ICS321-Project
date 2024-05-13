window.onload = main()

function main() {
    let login_button = document.getElementById('login_button')
    login_button.addEventListener('click', async function (e) {
        e.preventDefault()
        let emailInput = document.getElementById('email')
        let passwordInput = document.getElementById('password')
        let test_email = emailInput.value
        let test_password = passwordInput.value


        await fetch('http://localhost:3000/login/accounts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: test_email,
                password: test_password
            })
        }).then(response => {
            if (!response.ok) {
                console.log("emaiiaiaialk not fdound error")
                throw new Error("")
            }
        }).then(data => {
            localStorage.setItem('user', JSON.stringify(data));

        }).catch(error => {
            alert(error.message);
        });

    })
}