const darkModeToggle = document.getElementById('darkModeToggle');
console.log('Script loaded successfully!');

function toggleDarkMode() {
    const body = document.body;
    const adminPage = document.getElementById('admin_page');

    const elementsToChange = document.querySelectorAll('*'); // Select all elements

    elementsToChange.forEach(element => {
        if (element.style.borderColor === '#C94C4B') {
            element.style.borderColor = 'black';
        }

        if (element.style.backgroundColor === '#404040') {
            element.style.backgroundColor = 'antiquewhite';
        }
    });
}

darkModeToggle.addEventListener('click', toggleDarkMode);
