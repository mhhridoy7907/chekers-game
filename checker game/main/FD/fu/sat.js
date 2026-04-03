const uploadImg = document.getElementById("uploadImg");
const profilePic = document.getElementById("profilePic");
const playerName = document.getElementById("playerName");
const musicToggle = document.getElementById("musicToggle");
const volumeSlider = document.getElementById("volumeSlider");


if(localStorage.getItem("playerImage")) profilePic.src = localStorage.getItem("playerImage");
if(localStorage.getItem("playerName")) playerName.value = localStorage.getItem("playerName");
if(localStorage.getItem("music") === "on") musicToggle.classList.add("active");
volumeSlider.value = localStorage.getItem("volume") || 50;


uploadImg.addEventListener("change", function(){
    const file = this.files[0];
    if(file){
        const reader = new FileReader();
        reader.onload = function(e){
            profilePic.src = e.target.result;
            try{
                localStorage.setItem("playerImage", e.target.result);
            } catch(err){
                console.warn("LocalStorage full বা অন্য error:", err);
            }
        }
        reader.readAsDataURL(file);
    }
});

playerName.addEventListener("input", ()=>{
    localStorage.setItem("playerName", playerName.value);
});

musicToggle.addEventListener("click", ()=>{
    musicToggle.classList.toggle("active");
    localStorage.setItem("music", musicToggle.classList.contains("active") ? "on" : "off");
});


volumeSlider.addEventListener("input", ()=>{
    localStorage.setItem("volume", volumeSlider.value);
});


function goBack(){
    window.history.back();
}


uploadImg.addEventListener("input", ()=>{
    if(uploadImg.files[0]){
        const reader = new FileReader();
        reader.onload = function(e){
            profilePic.src = e.target.result;
            try{
                localStorage.setItem("playerImage", e.target.result);
            } catch(err){
                console.warn("LocalStorage full বা অন্য error:", err);
            }
        }
        reader.readAsDataURL(uploadImg.files[0]);
    }
});
