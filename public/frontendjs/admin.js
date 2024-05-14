window.onload = main();
async function main() {
    let logout = document.getElementById('logout');
    let para = document.getElementById('para')
    let back = document.getElementById('back');
    let report = document.getElementById('main-container');
    let addPage = document.getElementById('add');
    let removePage = document.getElementById('remove');
    let book_page=document.getElementById('book_page');
    report.style.display = 'none';
    let admin_page = document.getElementById('admin_page');
    let booking_button = document.getElementById('booking_button');
    booking_button.addEventListener('click', async function (e) {
        e.preventDefault();
        window.location.href = '/booking';
    });
    back.addEventListener('click', async function (e) {
        e.preventDefault();
        location.reload();
    });
    let active_flight = document.getElementById('active_flight');
    active_flight.addEventListener('click', async function (e) {
        e.preventDefault();
        admin_page.style.display = 'none';
        logout.style.display = 'none';
        report.style.display = 'block';
        back.style.display = 'block';
        para.innerHTML = '';
        let flights_list = [];

        await fetch("http://localhost:3000/activeFlights").then(response => response.json()).then(data => { flights_list = data; });
        const heading = document.createElement('h1');
        heading.textContent = 'Active Flights Report:';
        para.appendChild(heading);
        const table = document.createElement('table');
        table.classList.add('activeFlights-table');

        const headerRow = table.createTHead().insertRow();
        const nameHeader = headerRow.insertCell();
        const originHeader = headerRow.insertCell();
        const destHeader = headerRow.insertCell();
        const flightTime = headerRow.insertCell();
        const flightDate = headerRow.insertCell();
        nameHeader.textContent = 'Flight ID';
        originHeader.textContent = 'Origin';
        destHeader.textContent = 'Destination';
        flightTime.textContent = 'Flight Time';
        flightDate.textContent = 'Flight Date';

        flights_list.forEach(item => {
            const currentDateTimestamp = Date.now();
            const givenDateTimestamp = Date.parse(item.f_date);
            let result = currentDateTimestamp < givenDateTimestamp;
            if (result) {
                const row = table.insertRow();
                const nameCell = row.insertCell();
                const originCell = row.insertCell();
                const destCell = row.insertCell();
                const timeCell = row.insertCell();
                const dateCell = row.insertCell();
                nameCell.textContent = item.fid;
                originCell.textContent = item.src_city;
                destCell.textContent = item.dest_city;
                timeCell.textContent = item.f_time;
                const dateTime = new Date(item.f_date);
                const year = dateTime.getFullYear();
                const month = dateTime.getMonth() + 1;
                const day = dateTime.getDate();
                const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                dateCell.textContent = formattedDate;
            }
        });
        para.appendChild(table);
    });
    let booking_percentage = document.getElementById('booking_percentage');
    booking_percentage.addEventListener('click', async function (e) {
        e.preventDefault();
        admin_page.style.display = 'none';
        logout.style.display = 'none';
        report.style.display = 'block';
        back.style.display = 'block';
        book_page.style.display='block';
    });
    
    let percentage_button=document.getElementById('percentageButton')
    percentage_button.addEventListener('click',async function(e){
        e.preventDefault();
        let givenDate=document.getElementById('bookDate2');
        let givenDateValue=givenDate.value;
        let booking_list = [];
        para.innerHTML = '';

        await fetch("http://localhost:3000/bookingPercentage").then(response => response.json()).then(data => { booking_list = data; });
        const table = document.createElement('table');
        table.classList.add('activeFlights-table');

        const headerRow = table.createTHead().insertRow();
        const flightID = headerRow.insertCell();
        const percentage = headerRow.insertCell();
        flightID.textContent = 'Flight ID';
        percentage.textContent = 'Booking Percentage';
        booking_list.forEach(item => {
            const dateTime = new Date(item.f_date);
            const year = dateTime.getFullYear();
            const month = dateTime.getMonth() + 1;
            const day = dateTime.getDate();
            const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            
            const dateTime2 = new Date(givenDateValue);
            const year2 = dateTime2.getFullYear();
            const month2 = dateTime2.getMonth() + 1;
            const day2 = dateTime2.getDate();
            const formattedDate2 = `${year2}-${month2.toString().padStart(2, '0')}-${day2.toString().padStart(2, '0')}`;
            
         

            if(formattedDate === formattedDate2){
                const row = table.insertRow();
                const idCell = row.insertCell();
                const percentageCell = row.insertCell();
                idCell.textContent = item.fid;
                percentageCell.textContent = item.booking_percentage;
            }
        });
        para.appendChild(table);
    });
    let payments = document.getElementById('payments');
    payments.addEventListener('click', async function (e) {
        e.preventDefault();
        admin_page.style.display = 'none';
        logout.style.display = 'none';
        report.style.display = 'block';
        back.style.display = 'block';
        para.innerHTML = '';
        let payment_list = [];

        await fetch("http://localhost:3000/payments").then(response => response.json()).then(data => { payment_list = data; });
        const heading = document.createElement('h1');
        heading.textContent = 'Payments Report:';
        para.appendChild(heading);
        const table = document.createElement('table');
        table.classList.add('activeFlights-table');

        const headerRow = table.createTHead().insertRow();
        const titleID = headerRow.insertCell();
        const purchaseDate = headerRow.insertCell();
        const ticket_price = headerRow.insertCell();

        titleID.textContent = 'Ticket ID';
        purchaseDate.textContent = 'Ticket Date';
        ticket_price.textContent = 'Price';
        payment_list.forEach(item => {
            const row = table.insertRow();
            const idCell = row.insertCell();
            const dateCell = row.insertCell();
            const priceCell = row.insertCell();
            idCell.textContent = item.tid;
            const dateTime = new Date(item.purchase_date);
            const year = dateTime.getFullYear();
            const month = dateTime.getMonth() + 1;
            const day = dateTime.getDate();
            const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            dateCell.textContent = formattedDate;
            priceCell.textContent = item.price;
        });
        para.appendChild(table);
    });
    let waitlist = document.getElementById('waitlist');
    waitlist.addEventListener('click', async function (e) {
        e.preventDefault();
        admin_page.style.display = 'none';
        logout.style.display = 'none';
        report.style.display = 'block';
        back.style.display = 'block';
        para.innerHTML = '';
        let wait_list = [];

        await fetch("http://localhost:3000/waitlist").then(response => response.json()).then(data => { wait_list = data; });
        const heading = document.createElement('h1');
        heading.textContent = 'Waitlist Report:';
        para.appendChild(heading);
        const table = document.createElement('table');
        table.classList.add('waitlist-table');

        const headerRow = table.createTHead().insertRow();
        const nameHeader = headerRow.insertCell();
        const positionHeader = headerRow.insertCell();
        const promote = headerRow.insertCell();
        nameHeader.textContent = 'Name';
        positionHeader.textContent = 'Position';
        promote.textContent = 'Promote';

        wait_list.forEach(item => {
            const row = table.insertRow();
            const nameCell = row.insertCell();
            const positionCell = row.insertCell();
            const promoteCell = row.insertCell();
            nameCell.textContent = item.name;
            positionCell.textContent = item.position;
            const promoteButton = document.createElement('button');
            promoteButton.textContent = 'Promote';
            promoteButton.classList.add('promote_button');
            promoteButton.addEventListener('click', () => {
                console.log(`Promoting ${item.name} (${item.position})`);
            });

            promoteCell.appendChild(promoteButton);
        });
        para.appendChild(table);
    });
    let load_factor = document.getElementById('load_factor');
    load_factor.addEventListener('click', async function (e) {
        e.preventDefault();
        window.location.href = '/report';
    });
    let ticket_cancelled = document.getElementById('ticket_cancelled');
    ticket_cancelled.addEventListener('click', async function (e) {
        e.preventDefault();
        admin_page.style.display = 'none';
        logout.style.display = 'none';
        report.style.display = 'block';
        back.style.display = 'block';
        para.innerHTML = '';
        let tickets_list = [];

        await fetch("http://localhost:3000/cancelledTickets").then(response => response.json()).then(data => { tickets_list = data; });
        const heading = document.createElement('h1');
        heading.textContent = 'The Cancelled Tickets Report:';
        para.appendChild(heading);
        const table = document.createElement('table');
        table.classList.add('activeFlights-table');

        const headerRow = table.createTHead().insertRow();
        const ticketID = headerRow.insertCell();
        const planeID = headerRow.insertCell();
        const flightID = headerRow.insertCell();
        const seatNumber = headerRow.insertCell();
        ticketID.textContent = 'Ticket ID';
        planeID.textContent = 'Plane ID';
        flightID.textContent = 'Flight ID';
        seatNumber.textContent = 'Seat Number';

        tickets_list.forEach(item => {
            if (item.cancelled) {
                const row = table.insertRow();
                const ticket = row.insertCell();
                const plane = row.insertCell();
                const flight = row.insertCell();
                const seat = row.insertCell();
                ticket.textContent = item.tid;
                plane.textContent = item.pid;
                flight.textContent = item.fid;
                seat.textContent = item.seat_number;
            }
        });
        para.appendChild(table);
    });
    let adding_button = document.getElementById('adding_button');
    adding_button.addEventListener('click', async function (e) {
        e.preventDefault();
        admin_page.style.display = 'none';
        logout.style.display = 'none';
        report.style.display = 'block';
        back.style.display = 'block';
        addPage.style.display = 'block';
        let add_button = document.getElementById("add_ticket_button")
        add_button.addEventListener('click', async function (e) {
            e.preventDefault()
            let booking_date = document.getElementById('bookDate')
            let booking_date_v = booking_date.value
            const dateTime = new Date(booking_date_v);
            const year = dateTime.getFullYear();
            const month = dateTime.getMonth() + 1;
            const day = dateTime.getDate();
            let formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            let purchase_date = new Date()
            const dateTime2 = new Date(purchase_date);
            const year2 = dateTime2.getFullYear();
            const month2 = dateTime2.getMonth() + 1;
            const day2 = dateTime2.getDate();
            let formattedDate2 = `${year2}-${month2.toString().padStart(2, '0')}-${day2.toString().padStart(2, '0')}`;
            let weight = document.getElementById('weight')
            let pid = document.getElementById('pid')
            let fid = document.getElementById('fid')
            let seat_number = document.getElementById('seat_number')
            let seat_type = document.getElementById('seat_type')
            let seat_type_v = seat_type.value
            let weight_v = weight.value
            let pid_v = pid.value
            let fid_v = fid.value
            let seat_number_v = seat_number.value
            await fetch('http://localhost:3000/addedTicket', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    booking_date: formattedDate,
                    weight: weight_v,
                    purchase_date: formattedDate2,
                    pid: pid_v,
                    fid: fid_v,
                    seat_number: seat_number_v,
                    seat_type : seat_type_v
                })
            }).then(response => {
                if (!response.ok) {
                    console.log("Error")
                    throw new Error("")
                }
                return response.text()
            }).then(data => {
                alert("Ticket added successfully")

            }).catch(error => {
                alert(error.message);
            });

            window.location.href = "/admin"
        })
    });
    let removing_button = document.getElementById('removing_button');
    removing_button.addEventListener('click', async function (e) {
        e.preventDefault();
        admin_page.style.display = 'none';
        logout.style.display = 'none';
        report.style.display = 'block';
        back.style.display = 'block';
        removePage.style.display = 'block';

    });

    let remove_button = document.getElementById('remove_button');

    remove_button.addEventListener('click', async function (e) {
        e.preventDefault();
        let removed_ticket = document.getElementById('tid');
        let tid = removed_ticket.value;
        console.log(tid)
        await fetch('http://localhost:3000/allTicketsID', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tid: tid }) // Send 'tid' in the request body
        }).then(response => {
            if (response.ok) {
                // Handle successful response (status 200)
                alert("Ticket successfully deleted!");
                location.reload(); // Reload the page if needed
            } else {
                // Handle other HTTP error statuses
                alert("Failed to delete ticket!");
            }
        }).catch(error => {
            // Handle network or other errors
            console.error("Error deleting ticket:", error);
            alert("Failed to delete ticket!");
        });

    });


}
