window.onload = main

async function main() {
    const cookies = document.cookie.split(';');
    console.log(cookies);

    fid = findCookie(cookies, "currentFlight")
    flight_info = []
    reservedSeatsArr = []

    seatArea = document.getElementById("seats")
    toP = document.getElementById("to");
    fromP = document.getElementById("from");
    priceP = document.getElementById("price")
    previousB = document.getElementById("previous")
    nextB = document.getElementById("next")

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
    let reservedSeats = {}
    let totalPrice = 0;

    await fetch('http://localhost:3000/tickets', {
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
        reservedSeatsArr = data

    }).catch(error => {
        alert(error.message);
    });

    flight_info = flight_info[0];
    from.innerHTML = `${flight_info.src_city}`
    to.innerHTML = `${flight_info.dest_city}`


    for (let i = 1; i <= Math.floor(flight_info.total_seats / 6); i++) {
        if (i <= Math.floor(flight_info.economy_seats / 6)) {
            seatArea.innerHTML += `<div class="seat_row">
                    <img src = "images/seat.png" alt="seat" id="${i}A" class="white_seat_img eco">
                    <img src = "images/seat.png" alt="seat" id="${i}B" class="white_seat_img eco">
                    <img src = "images/seat.png" alt="seat" id="${i}C" class="white_seat_img eco">
                    <div style="margin-left: -10px; font-size:18px; color:#C94C4B;"></div>
                    <img src = "images/seat.png" alt="seat" id="${i}D" class="white_seat_img eco">
                    <img src = "images/seat.png" alt="seat" id="${i}E" class="white_seat_img eco">
                    <img src = "images/seat.png" alt="seat" id="${i}F" class="white_seat_img eco">
                    <div style="margin-left: 25px; font-size:25px; color:#f30606; font-weight:bold;">${i}</div>
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
                    <div style="margin-left: 25px; font-size:25px; color:#353ff2; font-weight:bold;">${i}</div>
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
                    <div style="margin-left: 25px; font-size:25px; color:#FDD017; font-weight:bold;">${i}</div>
                </div>`
            allSeats[`${i}A`] = 'f'
            allSeats[`${i}B`] = 'f'
            allSeats[`${i}C`] = 'f'
            allSeats[`${i}D`] = 'f'
            allSeats[`${i}E`] = 'f'
            allSeats[`${i}F`] = 'f'
        }
    }

    reservedSeatsArr.forEach(seat => {
        id = seat.seat_number;
        reservedSeats[id] = allSeats[id];
    });

    console.log(allSeats)
    console.log(reservedSeats);

    whiteSeat = document.querySelectorAll(".white_seat_img")
    whiteSeat.forEach(seat => {
        let id = seat.getAttribute("id")
        if (reservedSeats[id] !== undefined) {
            seat.src = " ../images/gray seat.png"
            seat.classList.add('disabled-hover');
        }
        seat.addEventListener("click", () => {
            id = seat.getAttribute("id")
            if (reservedSeats[id] == undefined) {
                let color = ""
                console.log(pickedSeats)
                if (pickedSeats[id] !== undefined) {
                    delete pickedSeats[id]
                    seat.src = "../images/seat.png"
                    removePrice(id)
                }
                else {
                    pickedSeats[id] = allSeats[id]
                    addPrice(id)

                    if (pickedSeats[id] == "eco") {
                        color = "red"
                    }
                    else if (pickedSeats[id] == "bus") {
                        color = "blue"
                    }
                    else {
                        color = "yellow"
                    }

                    seat.src = `../images/${color} seat.png`
                }



                let counter = 0
                let selected_seatsP = document.getElementById("selected_seats")
                selected_seatsP.innerHTML = ""
                for (i in pickedSeats) {
                    color = ""
                    if (pickedSeats[i] == "eco") {
                        color = "#f30606"
                    }
                    else if (pickedSeats[i] == "bus") {
                        color = "#353ff2"
                    }
                    else {
                        color = "#FDD017"
                    }
                    if (counter < Object.keys(pickedSeats).length - 1) {
                        selected_seatsP.innerHTML += `<span style="color:${color};">${i}<span>, &nbsp`
                    }
                    else {
                        selected_seatsP.innerHTML += `<span style="color:${color};">${i}<span>.`;
                    }
                    counter++;
                }
            }

        })
    })

    previousB.addEventListener("click", function (e) {
        window.location.href = "/booking"
    })

    nextB.addEventListener("click", async function (e) {
        const dateTime2 = new Date();
        const year2 = dateTime2.getFullYear();
        const month2 = dateTime2.getMonth() + 1;
        const day2 = dateTime2.getDate();
        let formattedDate2 = `${year2}-${month2.toString().padStart(2, '0')}-${day2.toString().padStart(2, '0')}`;

        for (i in pickedSeats) {
            console.log(i);

            let weight_v = "0";

            if (pickedSeats[i] == "eco") {
                weight_v = "30";
            }
            else if (pickedSeats[i] == "bus") {
                weight_v = "70";
            }
            else {
                weight_v = "120";
            }


            let fid_v = flight_info.fid;

            let seat_number_v = i;



            await fetch('http://localhost:3000/addedTicket', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    booking_date: formattedDate2,
                    weight: weight_v,
                    purchase_date: formattedDate2,
                    pid: null,
                    fid: fid_v,
                    seat_number: seat_number_v,
                    type: pickedSeats[i]
                })
            }).then(response => {
                if (!response.ok) {
                    console.log("Error")
                    throw new Error("")
                }
                return response.text();
            }).then(data => {

            }).catch(error => {
                alert(error.message);
            });

        }

        window.location.href = "/payment"

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

        priceP.innerHTML = totalPrice.toString() + "$";
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

        priceP.innerHTML = totalPrice.toString() + "$";
    }
}