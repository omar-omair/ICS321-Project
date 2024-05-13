window.onload = main();
async function main() {
    let logout=document.getElementById('logout');
    let para=document.getElementById('para')
    let back=document.getElementById('back');
    let report=document.getElementById('main-container');
    report.style.display='none';
    let admin_page=document.getElementById('admin_page');
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
        admin_page.style.display='none';
        logout.style.display='none';
        report.style.display='block';
        back.style.display='block';
        para.innerHTML = '';
        let flights_list = [];

        await fetch("http://localhost:3000/activeFlights").then(response => response.json()).then(data => { flights_list = data; });
        const heading = document.createElement('h1');
        heading.textContent = 'The Active Flights Report:';
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
            let result= currentDateTimestamp < givenDateTimestamp;
            if(result){
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
            window.location.href = '/report';
    });
    let payments = document.getElementById('payments');
    payments.addEventListener('click', async function (e) {
        e.preventDefault();
            window.location.href = '/report';
    });
    let waitlist = document.getElementById('waitlist');
    waitlist.addEventListener('click', async function (e) {
      
        admin_page.style.display='none';
        logout.style.display='none';
        report.style.display='block';
        back.style.display='block';
        para.innerHTML = '';
        let wait_list = [];

        await fetch("http://localhost:3000/waitlist").then(response => response.json()).then(data => { wait_list = data; });
        const heading = document.createElement('h1');
        heading.textContent = 'The Waitlist Report:';
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
            window.location.href = '/report';
    });

}
