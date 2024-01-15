// DEEP BISWAS
const playIcon = document.getElementById("play");
const pauseGroup = document.getElementById("pause");
const svgContainer = document.getElementById("svgContainer");
const audio = new Audio('./audio/psycho-dreams.mp3');
const playBall = document.getElementById("playBall");
const playTime = document.getElementById("playTime");

let isPlaying = false;
let startTime;
let pausedProgress = 0;

let countdownInterval;
const countdownElement = document.getElementById("countdown");
const songNameElement = document.getElementById("songName");

pauseGroup.style.opacity = 0;

const fileName = audio.src.split('/').pop();
let durationInSeconds = 0;

audio.addEventListener('loadedmetadata', function(){
    durationInSeconds = Math.floor(audio.duration);
    updateCountdown(durationInSeconds);

    const trimmedSongName = fileName.slice(0, -4);
    songNameElement.textContent = trimmedSongName;
});

audio.addEventListener('ended', function(){
    location.reload(true);
});

document.addEventListener("keydown", handleKeyPress);
svgContainer.addEventListener("click", handlePlayPause);

function handleKeyPress(event){
    if (event.code === "Space"){
        event.preventDefault();
        handlePlayPause();
    }
}

function addRotationAnimation(element){
    element.classList.add("rotate-animation");
}

function removeRotationAnimation(element){
    element.classList.remove("rotate-animation");
}

function playAudio(){
    if (!isPlaying) {
        if (pausedProgress === 0){
            startTime = Date.now();
        } else {
            startTime = Date.now() - pausedProgress * 1000;
            pausedProgress = 0;
        }

        isPlaying = true;
        audio.play();
    }
}

function pauseAudio(){
    if (isPlaying) {
        isPlaying = false;
        audio.pause();
    }
}

function toggleIcons(){
    if (pauseGroup.style.opacity == 0){
        playIcon.style.opacity = 0;
        pauseGroup.style.opacity = 1;
        addRotationAnimation(pauseGroup);
        removeRotationAnimation(playIcon);
    } else if (playIcon.style.opacity == 0){
        pauseGroup.style.opacity = 0;
        playIcon.style.opacity = 1;
        addRotationAnimation(playIcon);
        removeRotationAnimation(pauseGroup);
    }
}

function updateCountdown(seconds){
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    countdownElement.textContent = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

function startCountdown(){
    countdownInterval = setInterval(function (){
        durationInSeconds--;
        updateCountdown(durationInSeconds);

        if (durationInSeconds <= 0){
            stopCountdown();
        }
    }, 1000);
}

function stopCountdown(){
    clearInterval(countdownInterval);
}

function animatePlayBall(){
    const playHeadX = playTime.x.baseVal.value;
    const playHeadWidth = playTime.width.baseVal.value;

    function animationStep(){
        if (isPlaying) {
            const currentTime = audio.currentTime;
            const duration = audio.duration;
            const playBallPosition = (currentTime / duration) * playHeadWidth;

            playBall.setAttribute("cx", playHeadX + playBallPosition);

            if (currentTime < duration){
                requestAnimationFrame(animationStep);
            } else {
                startTime = Date.now();
            }
        }
    }

    audio.addEventListener('pause', function(){
        pausedProgress = audio.currentTime;
    });

    audio.addEventListener('play', function(){
        if (pausedProgress > 0){
            animatePlayBall();
        }
    });

    requestAnimationFrame(animationStep);
}

function pauseBallAnimation(){
    pausedProgress = (Date.now() - startTime) / 1000;
}

function handlePlayPause(){
    toggleIcons();

    if (playIcon.style.opacity == 0) {
        stopCountdown();
        startCountdown();
        animatePlayBall();
        playAudio();
    } else if (playIcon.style.opacity == 1) {
        stopCountdown();
        pauseBallAnimation();
        pauseAudio();
    }
}
