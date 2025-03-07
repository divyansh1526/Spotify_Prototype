let currentsong = new Audio();
let songs;

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs() {
    let a = await fetch("http://127.0.0.1:5500/mysong/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let song = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            song.push(element.href.split("/mysong/")[1]);
        }
    }
    return song;
}

const playmusic = (track, pause = false) => {
    currentsong.volume = 0.5;
    vol.src = "high.svg";
    document.querySelector(".range").getElementsByTagName("input")[0].value = 50;
    document.querySelector(".songinfo").innerHTML = decodeURI(track.replaceAll(".mp3", ""));
    document.querySelector(".circle").style.left = "0%";
    currentsong.src = "/mysong/" + track + ".mp3";

    currentsong.addEventListener("loadedmetadata", () => {
        document.querySelector(".songtime").innerHTML = `00:00 / ${formatTime(currentsong.duration)}`;
    });

    if (!pause) {
        setTimeout(() => {
            currentsong.play();
            now.src = "pause.svg";
        }, 500);
    }
};

async function main() {
    songs = await getsongs();
    let present = songs[0];
    playmusic(present.replaceAll(".mp3",""),true)
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songul.innerHTML += `<li>
                            <img class="invert" src="music.svg" alt="Music">
                            <div class="info mauto">
                                <div class="name">${song.replaceAll("%20"," ").replaceAll(".mp3","")}</div>
                            </div>
                            <div class="playnow">
                                <span>Play now</span>
                                <img class="invert" src="play.svg">
                            </div>
                        </li>`;
    }

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })
    })

    now.addEventListener("click",()=>{
        if(currentsong.paused && currentsong.currentTime==0){
            currentsong.volume=document.querySelector(".range").getElementsByTagName("input")[0].value / 100;
            currentsong.play();
            now.src = "pause.svg";
            vol.src = "high.svg";
        }
        else if(currentsong.paused){
            if(vol.src.endsWith("low.svg")){
                currentsong.volume = 0.5;
                vol.src = "high.svg";
                currentsong.play();
                now.src = "pause.svg";
                document.querySelector(".range").getElementsByTagName("input")[0].value = 50;
            }
            else{
                currentsong.play();
                now.src = "pause.svg";
                currentsong.volume = document.querySelector(".range").getElementsByTagName("input")[0].value / 100;
                vol.src = "high.svg";
            }
        }
        else{
            currentsong.pause();
            now.src = "play.svg";
        }
    })
    
    currentsong.addEventListener("timeupdate", () => {
        if (!isNaN(currentsong.duration)) {
            document.querySelector(".songtime").innerHTML = `${formatTime(currentsong.currentTime)} / ${formatTime(currentsong.duration)}`;
            document.querySelector(".circle").style.left = ((currentsong.currentTime / currentsong.duration)) * 100 + "%";
        }
    });

    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent = e.offsetX/e.target.getBoundingClientRect().width * 100;
        document.querySelector(".circle").style.left = (percent) + "%";
        currentsong.currentTime = ((currentsong.duration)*percent)/100;
    })

    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0%";
    })

    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-120%";
    })

    prev.addEventListener("click",()=>{
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
        if(index==0){
            index = songs.length;
            playmusic(songs[index-1].replaceAll(".mp3",""));
        }
        playmusic(songs[index-1].replaceAll(".mp3",""));
    })

    next.addEventListener("click",()=>{
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
        if(index==songs.length-1){
            index = -1;
            playmusic(songs[index+1].replaceAll(".mp3",""));
        }
        playmusic(songs[index+1].replaceAll(".mp3",""));
    })

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",e=>{
        if(now.src.endsWith("pause.svg")){
        currentsong.volume = e.target.value/100;
        currentsong.play();
        vol.src = "high.svg";
        now.src = "pause.svg";
        }
        else if(now.src.endsWith("play.svg") && vol.src.endsWith("high.svg")){
            currentsong.volume = e.target.value/100;
            vol.src = "high.svg";
        }
        else if(currentsong.currentTime){
            currentsong.volume = e.target.value/100;
            currentsong.play();
            vol.src = "high.svg";
            now.src = "pause.svg";
        }
    })

    vol.addEventListener("click",()=>{
        if(currentsong.volume){
            currentsong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
            vol.src = "low.svg";
            currentsong.pause();
            now.src = "play.svg";
        }
        else{
            if(now.src.endsWith("pause.svg")){
                currentsong.volume = 1;
                vol.src = "high.svg";
                document.querySelector(".range").getElementsByTagName("input")[0].value = 100;
                currentsong.play();
            }
            else{
                if(currentsong.currentTime){
                    currentsong.play();
                    now.src = "pause.svg";
                }
                currentsong.volume = 1;
                vol.src = "high.svg";
                document.querySelector(".range").getElementsByTagName("input")[0].value = 100;
            }
        }
    })

    document.querySelector(".range").getElementsByTagName("input")[0].value = 50;

}

main();

