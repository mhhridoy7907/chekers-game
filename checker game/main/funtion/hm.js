function toggleMode() {
    const body = document.body;
    if(body.style.filter === "brightness(0.7)") {
        body.style.filter = "brightness(1)";
    } else {
        body.style.filter = "brightness(0.7)";
    }
}
