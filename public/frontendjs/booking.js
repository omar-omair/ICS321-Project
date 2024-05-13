window.onload = main

async function main() {
    searchButton = document.getElementById('search_button')
    originSelect = document.getElementById('origin')
    destSelect = document.getElementById('destination')
    dateLabel = document.getElementById('date_label')
    dateInput = document.getElementById('departure')

    var currentDate = new Date();
    var minDate = currentDate.toISOString().split('T')[0];
    dateInput.setAttribute("min", minDate);

    let originCities = [];

    await fetch("http://localhost:3000/origin").then(response => response.json()).then(data => { originCities = data; });

    originCities.forEach(origin => {
        originSelect.innerHTML += `<option value="${origin.src_city}">${origin.src_city}</option>`
    });

    changeEverything()

    originSelect.addEventListener('change', changeEverything);

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
            console.log(data)
            destCities = data
        }).catch(error => {
            alert(error.message);
        });

        destSelect.innerHTML = null

        destCities.forEach(dest => {
            destSelect.innerHTML += `<option value="${dest.dest_city}">${dest.dest_city}</option>`
        });

        dateLabel.innerHTML = "Date"
        dateInput.style.display = ""
    }

}

