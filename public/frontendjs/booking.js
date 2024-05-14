window.onload = main
let currentFlight;

async function main() {
    searchButton = document.getElementById('search_button')
    originSelect = document.getElementById('origin')
    destSelect = document.getElementById('destination')
    dateLabel = document.getElementById('date_label')
    dateInput = document.getElementById('departure')
    tableSection = document.getElementById('table_section')
    bookingSection = document.getElementById('booking_section')
    reserveTable = document.getElementById('reserve_table')



    var currentDate = new Date();
    var minDate = currentDate.toISOString().split('T')[0];
    dateInput.setAttribute("min", minDate);

    let originCities = [];

    await fetch("http://localhost:3000/origin").then(response => response.json()).then(data => { originCities = data; });

    originCities.forEach(origin => {

        originSelect.innerHTML += `<option value="${origin.src_city}">${origin.src_city}</option>`

    });

    removeDuplicateOptions(originSelect);

    changeEverything()

    originSelect.addEventListener('change', changeEverything, true);

    async function changeEverything() {
        let destCities = []
        let origin = originSelect.value
        await fetch('http://localhost:3000/dest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                origin: origin
            })
        }).then(response => {
            return response.json()
        }).then(data => {
            destCities = data
        }).catch(error => {
            alert(error.message);
        });

        destSelect.innerHTML = null

        destCities.forEach(dest => {
            destSelect.innerHTML += `<option value="${dest.dest_city}">${dest.dest_city}</option>`
        });

        removeDuplicateOptions(destSelect);

    }

    searchButton.addEventListener('click', async function (e) {
        e.preventDefault()
        let flights = []
        let origin = originSelect.value
        let dest = destSelect.value
        let date = dateInput.value

        await fetch('http://localhost:3000/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                origin: origin,
                dest: dest,
                date: date
            })
        }).then(response => {
            return response.json()
        }).then(data => {
            flights = data
        }).catch(error => {
            alert(error.message);
        });

        console.log(flights);
        tableSection.style.display = 'block';
        bookingSection.style.display = 'none';

        flights.forEach(flight => {
            flight.f_time = flight.f_time.split(':')[0] + ":" + flight.f_time.split(':')[1]
            const dateTime = new Date(flight.f_date);
            const year = dateTime.getFullYear();
            const month = dateTime.getMonth() + 1;
            const day = dateTime.getDate();
            const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            reserveTable.innerHTML += `<tr>
                    <td>${flight.src_city}</td>
                    <td>${flight.dest_city}</td>
                    <td>${flight.f_time}</td>
                    <td>${formattedDate}</td>
                    <td>${flight.duration} Hours</td>
                    <td>${flight.economy_price}$</td>
                    <td><button class="book_button" id=button_${flight.fid}>Book</button></td>
                </tr>`
        })

        let bookingButton = document.querySelectorAll('.book_button');

        bookingButton.forEach(button => {
            button.addEventListener('click', async function (e) {
                e.preventDefault();
                fid = e.target.id.split("_")[1]
                currentFlight = fid;
                const url = "http://localhost:3000/booking_seat"
                await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        fid: fid,
                    })
                }).then(response => {
                    if (response.ok) {
                        // Redirect to booking_seat.html if the response is successful
                        window.location.href = '/booking_seat';
                    } else {
                        // Handle errors here, if needed
                        console.error('Error:', response.statusText);
                    }
                }).catch(error => {
                    console.error('Error:', error);
                });
            });
        });

    });

}

let logout_button = document.getElementById('logout');
logout_button.addEventListener('click', async function (e) {
    e.preventDefault();
    window.location.href = '/logout'; // Redirect to login page
});

function removeDuplicateOptions(selectElement) {
    // Create an array to store unique option values 
    let uniqueOptions = [];

    // Iterate through existing options 
    for (let option of selectElement.options) {
        // Check if the option value is not already in the uniqueOptions array 
        if (!uniqueOptions.includes(option.value)) {
            // Add the option value to the uniqueOptions array 
            uniqueOptions.push(option.value);
        } else {
            // If the option value is a duplicate, remove the option 
            selectElement.removeChild(option);
        }
    }
}




