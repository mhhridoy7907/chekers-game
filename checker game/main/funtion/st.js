const uploadImg=document.getElementById("uploadImg");
const profilePic=document.getElementById("profilePic");
const playerName=document.getElementById("playerName");
const musicToggle=document.getElementById("musicToggle");
const volumeSlider=document.getElementById("volumeSlider");

// Load existing settings
if(localStorage.getItem("playerImage")) profilePic.src = localStorage.getItem("playerImage");
if(localStorage.getItem("playerName")) playerName.value = localStorage.getItem("playerName");
if(localStorage.getItem("music")==="on") musicToggle.classList.add("active");
volumeSlider.value = localStorage.getItem("volume") || 50;

// Device image select
uploadImg.addEventListener("change", function(){
    const file=this.files[0];
    if(file){
        const reader=new FileReader();
        reader.onload=function(e){
            profilePic.src=e.target.result;
            localStorage.setItem("playerImage", e.target.result);
        }
        reader.readAsDataURL(file);
    }
});

// Save name
playerName.addEventListener("input",()=>localStorage.setItem("playerName",playerName.value));

// Music toggle
musicToggle.addEventListener("click",()=>{
    musicToggle.classList.toggle("active");
    localStorage.setItem("music", musicToggle.classList.contains("active")?"on":"off");
});

// Volume
volumeSlider.addEventListener("input",()=>localStorage.setItem("volume",volumeSlider.value));

// Back
function goBack(){window.history.back();}
