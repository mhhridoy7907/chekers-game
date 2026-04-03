function toggleMode() {
    const body = document.body;
    if(body.style.filter === "brightness(0.7)") {
        body.style.filter = "brightness(1)";
    } else {
        body.style.filter = "brightness(0.7)";
    }
}

const playerProfile = document.getElementById("playerProfile");
const playerNameShow = document.getElementById("playerNameShow");


window.addEventListener("load", () => {
    // Player Image
    const savedImage = localStorage.getItem("playerImage");
    if(savedImage) playerProfile.src = savedImage;

    // Player Name
    const savedName = localStorage.getItem("playerName");
    if(savedName) playerNameShow.textContent = savedName;

  
    const musicStatus = localStorage.getItem("music");
    if(musicStatus === "off") {
        console.log("Music is off"); 
    }


    const volume = localStorage.getItem("volume");
    if(volume) {
        console.log("Volume level:", volume); 
    }
});
