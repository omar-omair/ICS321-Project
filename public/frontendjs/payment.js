window.onload = main();

function main() {
    let changePass = document.getElementById('payButton');
    changePass.addEventListener('click', async function (e) {
        e.preventDefault();
        let credit_number = document.getElementById('creditCardNum').value;
        let holder_name = document.getElementById('cardHolderName').value;
        let end_date = document.getElementById('endDate').value; // Access the value property
        let cvv = document.getElementById('cvv').value;

        // Ensure end_date is in the format YYYY-MM-DD
        // You might need additional logic to format the date correctly
        // For example, using the Date object to parse and format the date

        await fetch('http://localhost:3000/payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                credit_number: credit_number,
                holder_name: holder_name,
                end_date: end_date,
                cvv: cvv
            })
        }).then(response => {
            if (!response.ok) {
                console.log("invalid information");
                throw new Error("");
            }
            return response.text();
        }).then(data => {
            window.location.href = "/thanks";

        }).catch(error => {
            alert(error.message);
        });

    });
}

    // Get today's date in the format YYYY-MM-DD
    var today = new Date().toISOString().split('T')[0];
    // Set the minimum date for the input element
    document.getElementById("endDate").min = today;
    const numericInput1 = document.getElementById('creditCardNum');
    numericInput1.addEventListener('input', function(event) {
        // Remove any non-numeric characters
        this.value = this.value.replace(/\D/g, '');
    });
    const numericInput2 = document.getElementById('cvv');
    numericInput2.addEventListener('input', function(event) {
        // Remove any non-numeric characters
        this.value = this.value.replace(/\D/g, '');
    });