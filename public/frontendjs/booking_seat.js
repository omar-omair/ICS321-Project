window.onload = main

async function main() {
    const cookies = document.cookie.split(';');
    console.log(cookies);

    fid = findCookie(cookies, "currentFlight")
    flight_info = []

    await fetch('http://localhost:3000/booking_info', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            fid: fid
        })
    }).then(response => {
        return response.json()
    }).then(data => {
        flight_info = data
    }).catch(error => {
        alert(error.message);
    });



}

function findCookie(cookies, Cname) {
    for (let cookie of cookies) {
        // Split the cookie into its name-value pair
        const [cookieName, cookieValue] = cookie.split('=');

        // Trim any leading or trailing whitespace from the cookie name
        const trimmedCookieName = cookieName.trim();

        // If the current cookie is the one we're looking for, return its value
        if (trimmedCookieName === Cname) {
            return cookieValue;
        }
    }
}