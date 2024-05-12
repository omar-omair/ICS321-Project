window.onload = main()

function main() {
    let register_button = document.getElementById('register_button')
    register_button.addEventListener('click', async function (e) {
        e.preventDefault()
        let emailInput = document.getElementById('email')
        let passwordInput = document.getElementById('password')
        let phoneInput = document.getElementById('phone')
        let address = document.getElementById('address')
        let name = document.getElementById('username')
        let test_email = emailInput.value
        let test_password = passwordInput.value
        let test_phone = phoneInput.value
        let test_address = address.value
        let test_name = name.value;

        await fetch('http://localhost:3000/register/accounts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: test_name,
                email: test_email,
                password: test_password,
                phone: test_phone,
                address: test_address,
            })
        }).then(response => {
            if (!response.ok) {
                console.log("emaiiaiaialk not fdound error")
                throw new Error("")
            }
        }).then(data => {
            localStorage.setItem('user', JSON.stringify(data));
            window.location.href = '/booking';

        }).catch(error => {
            alert(error.message);
        });

    })
}