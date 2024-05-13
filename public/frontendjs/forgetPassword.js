window.onload = main()

function main() {
    let changePass = document.getElementById('new_pass_button')
    changePass.addEventListener('click', async function (e) {
        e.preventDefault()
        let emailInput = document.getElementById('email')
        let passwordInput = document.getElementById('new_password')
        let test_email = emailInput.value
        let test_password = passwordInput.value
        await fetch('http://localhost:3000/forgetpassword', {
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
                console.log("email not found")
                throw new Error("")
            }
            return response.text();
        }).then(data => {
            console.log(data);
            window.location.href = "/login"

        }).catch(error => {
            alert(error.message);
        });

    })
}