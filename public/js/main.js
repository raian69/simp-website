const button = document.getElementById('simp-shamer');
button.addEventListener('click', () => handleSimpShaming());
window.addEventListener('resize', () => simpLocation = locateSimp());

var simpLocation = null;
var localCount = 0;
initializeLocalCount();

var soundURLs = ['audio/vine-boom.mp3'];
var soundElements = [null];

const pointerUrl = 'images/pointer.png';
var pointerElement = null;

function handleSimpShaming() {
    localCount++;
    updateLocalCount();
    pointAndLaugh();
}

function updateLocalCount() {
    const countElement = document.getElementById('local-count');
    countElement.innerText = `${localCount}`;
    setLocalCountCookie();
}

function pointAndLaugh() {
    console.log(`HAHA #${localCount}`);
    spawnPointer();
    playSoundEffect();
}

function locateSimp() {
    if (simpLocation)
        return simpLocation;

    const simpImage = document.getElementsByClassName('simp')[0];

    return {
        x: simpImage.x + simpImage.width / 2,
        y: simpImage.y + simpImage.height / 2
    };
}

function spawnPointer() {
    if (pointerElement == null) {
        pointerElement = document.createElement('img');
        pointerElement.src = pointerUrl;
        pointerElement.alt = 'Finger pointing left';
        pointerElement.id = 'pointer'
    }

    const pointer = pointerElement.cloneNode();
    document.body.appendChild(pointer);

    let rx = Math.random() * (window.innerWidth - pointer.width);
    let ry = Math.random() * (window.innerHeight - pointer.height);
    pointer.style.left = `${rx}px`
    pointer.style.top = `${ry}px`

    // calculate rotation to point at simp
    if (simpLocation === null)
        simpLocation = locateSimp();

    let x = simpLocation.x - (pointer.x + pointer.width / 2);
    let y = simpLocation.y - (pointer.y + pointer.height / 2);
    let rotation = Math.atan(y / x) + (x >= 0 ? 3.1 : 0);
    console.log(x, y, rotation);
    pointer.style.transform = `rotate(${rotation}rad)`

    setTimeout(() => {
        document.body.removeChild(pointer);
    }, 1000)
}

function playSoundEffect() {
    const ri = Math.floor(Math.random() * soundElements.length);
    if (soundElements[ri] === null) {
        soundElements[ri] = new Audio(soundURLs[ri])
    }
    let sound = soundElements[ri].cloneNode();
    sound.play();
}

function initializeLocalCount() {
    const cookies = document.cookie.split(';');

    if (cookies[0].length == 0)
        setLocalCountCookie();
    else
        localCount = getLocalCountCookie();

    updateLocalCount();
}

function getLocalCountCookie() {
    const cookies = document.cookie.split(';');
    let localCountCookieValue = null;

    if (cookies[0].length == 0)
        setLocalCountCookie();

    cookies.forEach(cookie => {
        if (cookie.startsWith('local-count'))
            localCountCookieValue = cookie.trim().replace('local-count=', '');
    })

    return localCountCookieValue ? parseInt(localCountCookieValue) : localCountCookieValue;
}

function setLocalCountCookie() {
    document.cookie = `local-count=${localCount}; SameSite=strict`;
}
