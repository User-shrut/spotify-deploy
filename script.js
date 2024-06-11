console.log("lets write javascript")
let currentSong = new Audio();
let songs;
let currfolder;

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  var minutes = Math.floor(seconds / 60);
  var remainingSeconds = Math.floor(seconds % 60);

  // Add leading zero if necessary
  var minutesStr;
  if (minutes < 10) {
    minutesStr = "0" + minutes;
  } else {
    minutesStr = minutes;
  }
  var secondsStr;

  if (remainingSeconds < 10) {
    secondsStr = "0" + remainingSeconds;
  } else {
    secondsStr = remainingSeconds;
  }
  return minutesStr + ":" + secondsStr;
}
async function getSongs(folder) {
  currfolder = folder;
  let a = await fetch(`/${currfolder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1])
    }
  }


  //play the first song


  //show all the song in playlist
  let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
  songUL.innerHTML = ""
  for (const song of songs) {
    songUL.innerHTML = songUL.innerHTML + `<li> 
      
       <img class="invert" src="img/music.svg" alt="">
       <div class="info">
         <div> ${song.replaceAll("%20", " ")}</div>
         <div>shruti</div>
       </div>
       <div class="playnow">
           <span>Play Now</span>
           <img class="invert" src="img/play.svg" alt="">
       </div>
      
  
       </li>`;
  }
  //attach an event listner to each song
  Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
    //it will give all list,e is element
    //console.log(e);
    //mtbl jo 
    e.addEventListener("click", element => {
     // console.log(e.querySelector(".info").firstElementChild.innerHTML);
      //TRIM()=IT WILL REMOVE ALL EXTRA SPACES
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
    })

  })
  return songs;

}
const playMusic = (track, pause = false) => {
  //let audio=new Audio("/songs/"+track);
  currentSong.src = `/${currfolder}/` + track;
  if (!pause) {
    currentSong.play();
  }

  play.src = "pause.svg";

  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00/00:00"
}

async function displayAlbums() {
  let a = await fetch(`/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer");

let array=Array.from(anchors);
for (let index = 0; index < array.length; index++) {
  const e = array[index];
  

    
 // console.log(e);
    if (e.href.includes("/songs/")) {
      let folder = e.href.split("/").slice(-1)[0];
      console.log(folder)
      //get the metadata of the folder
      let a = await fetch(`/songs/${folder}/info.json`);
      let response = await a.json();
      console.log(response);

      cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
    <div  class="play">
        <svg class="iconplay" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24"
            height="24" color="#000000" fill="none">
            <path
                d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                fill="#000" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
        </svg>
    </div>
    <img src="/songs/${folder}/cover.jpg" alt="">
    <h2>${response.title}</h2>
    <p>${response.description}</p>
</div>`
    }
  }


  //load the pplaylist whenever card is clicked
  Array.from(document.getElementsByClassName("card")).forEach(e => {
    e.addEventListener("click", async item => {
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
playMusic(songs[0])
    })
  })
}


  async function main() {

    //get the list of all the songs
    await getSongs("songs/ncs");
    console.log(songs);

    playMusic(songs[0], true);


    //display all the albums on the page
     await displayAlbums();
    //attatch  an event listner to play,next and previous
    //play is id
    //mtlb jb hum platy pe click karenhe to agr pause hoga to click krne pe play hoga and vice versa
    play.addEventListener("click", () => {
      if (currentSong.paused) {
        currentSong.play();
        play.src = "pause.svg";
      }
      else {
        currentSong.pause();
        play.src = "play.svg";
      }
    })

    //listen to timeupdate event
    currentSong.addEventListener("timeupdate", () => {
      // console.log(currentSong.currentTime, currentSong.duration);
      document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
      document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    //add event listner to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
      let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
      document.querySelector(".circle").style.left = percent + "%";
      currentSong.currentTime = (currentSong.duration) * percent / 100;

    })

    //add an event listner for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
      document.querySelector(".left").style.left = "0";
    })

    //add an event listner for close button
    document.querySelector(".close").addEventListener("click", () => {
      document.querySelector(".left").style.left = "-120%";
    })


    //add an event listner to previous 
    previous.addEventListener("click", () => {
      currentSong.pause();
      console.log("privios clicked");
      let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
      if ((index - 1) >= 0) {
        playMusic(songs[index - 1])
      }
    })

    //add an event listner to next
    next.addEventListener("click", () => {
      currentSong.pause();
      console.log("next clicked");
      let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
      if ((index + 1) <= (songs.length - 1)) {
        playMusic(songs[index + 1])
      }
    })

    //add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
     // console.log("setting volume to:", e.target.value, "/100");
      currentSong.volume = parseInt(e.target.value) / 100;
    })


  }

//add event listner to mute the track
document.querySelector(".volume>img").addEventListener("click",e=>{
  console.log(e.target);
  console.log("changing",e.target.src);
  if(e.target.src.includes("volume.svg")){
    e.target.src=e.target.src.replace("volume.svg","mute.svg");
    currentSong.volume=0;
    document.querySelector(".range").getElementsByTagName("input")[0].value=0;

  }
  else{
    //string are immutable,so we have to store it first
    e.target.src=e.target.src.replace("mute.svg","volume.svg");
    currentSong.volume=.10;
    document.querySelector(".range").getElementsByTagName("input")[0].value=10
  }
})



  main();

//Some of the more commonly used properties of the audio element include src, currentTime, duration, paused, muted, and volume. This snippet copies the audio file's duration to a variable:
//play the first song
//   var audio = new Audio(songs[2]);
//   // audio.play();


//    //loadeddata==it will fire only in single time
//    audio.addEventListener("loadeddata", () => {
//   //  let duration = audio.duration;
//    // console.log(duration);
//     // The duration variable now holds the duration (in seconds) of the audio clip
//     console.log(audio.duration,audio.src,audio.currentTime);

