window.onload = main();

async function main() {
    let p = [];
    await fetch("http://localhost:3000/").then(response => response.json()).then(data => { p = data; });
    console.log(p);
    document.querySelector(".container").innerHTML += `<p> ${p[0]} </p>`
}

