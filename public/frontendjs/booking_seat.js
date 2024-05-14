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

    let allSeats = []
    let pickedSeats = []
    let reservedSeats = []
    let totalPrice = 0;

    flight_info = flight_info[0];
    console.log(flight_info);
    for (let i = 1; i <= Math.floor(flight_info.total_seats / 6); i++) {
        console.log(i)
        if (i <= flight_info.economy_seats) {
            seatArea.innerHTML += `<div class="seat_row">
                    <img src = "images/seat.png" alt="seat id="${i}A" class="white_seat_img eco">
                    <img src = "images/seat.png" alt="seat id="${i}B" class="white_seat_img eco">
                    <img src = "images/seat.png" alt="seat id="${i}C" class="white_seat_img eco">
                    <div style="margin-left: -10px;"></div>
                    <img src = "images/seat.png" alt="seat id="${i}D" class="white_seat_img eco">
                    <img src = "images/seat.png" alt="seat id="${i}E" class="white_seat_img eco">
                    <img src = "images/seat.png" alt="seat id="${i}F" class="white_seat_img eco">
                </div>`
            allSeats.push(`${i}A,eco`)
            allSeats.push(`${i}B,eco`)
            allSeats.push(`${i}C,eco`)
            allSeats.push(`${i}D,eco`)
            allSeats.push(`${i}E,eco`)
            allSeats.push(`${i}F,eco`)
        }
        else if (i <= flight_info.economy_seats + flight_info.business_seats) {
            seatArea.innerHTML += `<div class="seat_row">
                    <img src = "images/seat.png" alt="seat id="${i}A" class="white_seat_img bus">
                    <img src = "images/seat.png" alt="seat id="${i}B" class="white_seat_img bus">
                    <img src = "images/seat.png" alt="seat id="${i}C" class="white_seat_img bus">
                    <div style="margin-left: -10px;"></div>
                    <img src = "images/seat.png" alt="seat id="${i}D" class="white_seat_img bus">
                    <img src = "images/seat.png" alt="seat id="${i}E" class="white_seat_img bus">
                    <img src = "images/seat.png" alt="seat id="${i}F" class="white_seat_img bus">
                </div>`
            allSeats.push(`${i}A,bus`)
            allSeats.push(`${i}B,bus`)
            allSeats.push(`${i}C,bus`)
            allSeats.push(`${i}D,bus`)
            allSeats.push(`${i}E,bus`)
            allSeats.push(`${i}F,bus`)
        }
        else if (i <= flight_info.economy_seats + flight_info.business_seats + flight_info.first_seats) {
            seatArea.innerHTML += `<div class="seat_row">
                    <img src = "images/seat.png" alt="seat id="${i}A" class="white_seat_img first">
                    <img src = "images/seat.png" alt="seat id="${i}B" class="white_seat_img first">
                    <img src = "images/seat.png" alt="seat id="${i}C" class="white_seat_img first">
                    <div style="margin-left: -10px;"></div>
                    <img src = "images/seat.png" alt="seat id="${i}D" class="white_seat_img first">
                    <img src = "images/seat.png" alt="seat id="${i}E" class="white_seat_img first">
                    <img src = "images/seat.png" alt="seat id="${i}F" class="white_seat_img first">
                </div>`
            allSeats.push(`${i}A,f`)
            allSeats.push(`${i}B,f`)
            allSeats.push(`${i}C,f`)
            allSeats.push(`${i}D,f`)
            allSeats.push(`${i}E,f`)
            allSeats.push(`${i}F,f`)
        }
    }

    whiteSeat = document.querySelectorAll(".white_seat_img")
    whiteSeat.forEach(seat => {
        seat.addEventListener("click", () => {
            id = seat.split(",")[0]
            pickedSeats = document.getElementById(id)
            if (seat in pickedSeats) {
                pickedSeats.splice(indexOf(seat), 1)
                removePrice(seat)
            }
            else {
                pickedSeats.push(seat)
                addPrice(seat)
            }
        })
    })

    totalPrice.addEventListener("change", function () {
        priceLabel = document.getElementById("price");
        price.innerHTML = totalPrice;
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
        let type = seat.split(",")[1];
        if (type == "eco") {
            totalPrice -= flight_info.economy_price;
        }
        else if (type == "bus") {
            totalPrice -= flight_info.business_price;
        }
        else {
            totalPrice -= flight_info.first_price;
        }
    }

    function addPrice(seat) {
        let type = seat.split(",")[1];
        if (type == "eco") {
            totalPrice += flight_info.economy_price;
        }
        else if (type == "bus") {
            totalPrice += flight_info.business_price;
        }
        else {
            totalPrice += flight_info.first_price;
        }
    }
}