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
        nameHeader.textContent = 'Ticket ID';
        originHeader.textContent = 'Seat Number';
        destHeader.textContent = 'Seat Type';
        tickets.forEach(item => {
            const row = table.insertRow();
            const nameCell = row.insertCell();
            const originCell = row.insertCell();
            const destCell = row.insertCell();
            nameCell.textContent = item.tid;
            originCell.textContent = item.seat_number;
            destCell.textContent = item.seat_type;
        });
        para.appendChild(table);

    })

}
