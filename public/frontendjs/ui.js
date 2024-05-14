window.onload = main();
async function main() {
    let logout = document.getElementById('logout');
    let back = document.getElementById('back');
    let booking_button = document.getElementById('booking_button');
    let admin_page = document.getElementById('admin_page');
    let para = document.getElementById('para');
    let main_container = document.getElementById('main-container');
    main_container.style.display = 'none';
    booking_button.addEventListener('click', async function (e) {
        e.preventDefault();
        window.location.href = '/booking';
    });
    back.addEventListener('click', async function (e) {
        e.preventDefault();
        location.reload();
    });

    show = document.getElementById('adding_button');

    show.addEventListener('click', async function (e) {
        main_container.style.display = 'block';
        admin_page.style.display = 'none';
        logout.style.display = 'none';
        back.style.display = 'block';
        para.innerHTML = ''
        tickets = []
        await fetch("http://localhost:3000/userTickets").then(response => response.json()).then(data => { tickets = data; });


        const heading = document.createElement('h1');
        heading.textContent = 'My Tickets:';
        para.appendChild(heading);
        const table = document.createElement('table');
        table.classList.add('activeFlights-table');

        const headerRow = table.createTHead().insertRow();
        const nameHeader = headerRow.insertCell();
        const originHeader = headerRow.insertCell();
        const destHeader = headerRow.insertCell();
        const canceltick = headerRow.insertCell();
        nameHeader.textContent = 'Ticket ID';
        originHeader.textContent = 'Seat Number';
        destHeader.textContent = 'Seat Type';
        canceltick.textContent = 'Cancel Ticket';


        tickets.forEach(item => {
            const row = table.insertRow();
            const nameCell = row.insertCell();
            const originCell = row.insertCell();
            const destCell = row.insertCell();
            const canc = row.insertCell();
            nameCell.textContent = item.tid;
            originCell.textContent = item.seat_number;
            destCell.textContent = item.seat_type;
            const promoteButton = document.createElement('button');
            promoteButton.textContent = 'Cancel';
            promoteButton.classList.add('promote_button');
            promoteButton.addEventListener('click', async () => {
                await fetch('http://localhost:3000/cancelUserTicket', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ tid: item.tid })
                }).then(response => {
                    if (response.ok) {
                        alert("Ticket successfully Cancelled!");
                        location.reload();
                    } else {
                        alert("Failed to cancel ticket!");
                    }
                }).catch(error => {
                    console.error("Error cancelling ticket:", error);
                    alert("Failed to cancel ticket!");
                });

            });
            canc.appendChild(promoteButton);

            para.appendChild(table);

        });

    })
}
