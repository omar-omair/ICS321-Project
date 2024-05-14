window.onload = main

async function main() {
    const cookies = document.cookie.split(';');
    console.log(cookies);

    fid = findCookie(cookies, "currentFlight")
    flight_info = []

    seatArea = document.getElementById("seats")

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

    let allSeats = {}
    let pickedSeats = {}
    let reservedSeats = []
    let totalPrice = 0;

    flight_info = flight_info[0];
    console.log(flight_info);
    for (let i = 1; i <= Math.floor(flight_info.total_seats / 6); i++) {
        if (i <= Math.floor(flight_info.economy_seats / 6)) {
            seatArea.innerHTML += `<div class="seat_row">
                    <img src = "images/seat.png" alt="seat" id="${i}A" class="white_seat_img eco">
                    <img src = "images/seat.png" alt="seat" id="${i}B" class="white_seat_img eco">
                    <img src = "images/seat.png" alt="seat" id="${i}C" class="white_seat_img eco">
                    <div style="margin-left: -10px;"></div>
                    <img src = "images/seat.png" alt="seat" id="${i}D" class="white_seat_img eco">
                    <img src = "images/seat.png" alt="seat" id="${i}E" class="white_seat_img eco">
                    <img src = "images/seat.png" alt="seat" id="${i}F" class="white_seat_img eco">
                </div>`
            allSeats[`${i}A`] = 'eco'
            allSeats[`${i}B`] = 'eco'
            allSeats[`${i}C`] = 'eco'
            allSeats[`${i}D`] = 'eco'
            allSeats[`${i}E`] = 'eco'
            allSeats[`${i}F`] = 'eco'

        }
        else if (i <= Math.floor((flight_info.economy_seats + flight_info.business_seats) / 6)) {
            seatArea.innerHTML += `<div class="seat_row">
                    <img src = "images/seat.png" alt="seat" id="${i}A" class="white_seat_img bus">
                    <img src = "images/seat.png" alt="seat" id="${i}B" class="white_seat_img bus">
                    <img src = "images/seat.png" alt="seat" id="${i}C" class="white_seat_img bus">
                    <div style="margin-left: -10px;"></div>
                    <img src = "images/seat.png" alt="seat" id="${i}D" class="white_seat_img bus">
                    <img src = "images/seat.png" alt="seat" id="${i}E" class="white_seat_img bus">
                    <img src = "images/seat.png" alt="seat" id="${i}F" class="white_seat_img bus">
                </div>`
            allSeats[`${i}A`] = 'bus'
            allSeats[`${i}B`] = 'bus'
            allSeats[`${i}C`] = 'bus'
            allSeats[`${i}D`] = 'bus'
            allSeats[`${i}E`] = 'bus'
            allSeats[`${i}F`] = 'bus'
        }
        else if (i <= Math.floor((flight_info.economy_seats + flight_info.business_seats + flight_info.first_seats) / 6)) {
            seatArea.innerHTML += `<div class="seat_row">
                    <img src = "images/seat.png" alt="seat" id="${i}A" class="white_seat_img first">
                    <img src = "images/seat.png" alt="seat" id="${i}B" class="white_seat_img first">
                    <img src = "images/seat.png" alt="seat" id="${i}C" class="white_seat_img first">
                    <div style="margin-left: -10px;"></div>
                    <img src = "images/seat.png" alt="seat" id="${i}D" class="white_seat_img first">
                    <img src = "images/seat.png" alt="seat" id="${i}E" class="white_seat_img first">
                    <img src = "images/seat.png" alt="seat" id="${i}F" class="white_seat_img first">
                </div>`
            allSeats[`${i}A`] = 'f'
            allSeats[`${i}B`] = 'f'
            allSeats[`${i}C`] = 'f'
            allSeats[`${i}D`] = 'f'
            allSeats[`${i}E`] = 'f'
            allSeats[`${i}F`] = 'f'
        }
    }

    console.log(allSeats)

    whiteSeat = document.querySelectorAll(".white_seat_img")
    whiteSeat.forEach(seat => {
        seat.addEventListener("click", () => {
            id = seat.getAttribute("id")
            if (pickedSeats[id] !== undefined) {
                delete pickedSeats[id]
                removePrice(id)
            }
            else {
                pickedSeats[id] = allSeats[id]
                addPrice(id)
            }
        })
    })




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

    function removePrice(seat) {
        let type = allSeats[seat]
        if (type == "eco") {
            totalPrice -= parseInt(flight_info.economy_price);
        }
        else if (type == "bus") {
            totalPrice -= parseInt(flight_info.business_price);
        }
        else {
            totalPrice -= parseInt(flight_info.first_price);
        }

        let priceLabel = document.getElementById("price");
        priceLabel.innerHTML = totalPrice;
    }

    function addPrice(seat) {
        let type = allSeats[seat]
        if (type == "eco") {
            totalPrice += parseInt(flight_info.economy_price);
        }
        else if (type == "bus") {
            totalPrice += parseInt(flight_info.business_price);
        }
        else {
            totalPrice += parseInt(flight_info.first_price);
        }
        let priceLabel = document.getElementById("price");
        priceLabel.innerHTML = totalPrice;
    }
}