window.onload = main();
function main() {
    let logout_button = document.getElementById('logout');
    logout_button.addEventListener('click', async function (e) {
        e.preventDefault();
            window.location.href = '/logout'; // Redirect to login page
    });
}
