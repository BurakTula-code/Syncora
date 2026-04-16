const titleText = document.getElementById('title-text');
const artistText = document.getElementById('artist-text');
const tWrap = document.getElementById('t-wrap');
const aWrap = document.getElementById('a-wrap');
const artImg = document.getElementById('art-img');
const platIcon = document.getElementById('plat-icon');
const platName = document.getElementById('plat-name');
const playSvg = document.getElementById('play-svg');
const fill = document.getElementById('fill');
const timeCurr = document.getElementById('time-curr');
const timeTotal = document.getElementById('time-total');

// Kayan Yazı Kontrol Fonksiyonu
function updateMarquee(element, wrap) {
    if (element.scrollWidth > wrap.offsetWidth) {
        element.classList.add('scrolling');
        // Sonsuz döngü için metni ikiye katlıyoruz
        if (!element.innerHTML.includes(' &nbsp;&nbsp;&nbsp; ')) {
            element.innerHTML += ' &nbsp;&nbsp;&nbsp; ' + element.innerHTML;
        }
    } else {
        element.classList.remove('scrolling');
    }
}

const icons = {
    youtube: '<svg viewBox="0 0 24 24"><path d="M23.5 6.2c-.3-1.1-1.1-2-2.2-2.3C19.3 3.5 12 3.5 12 3.5s-7.3 0-9.3.4c-1.1.3-1.9 1.2-2.2 2.3C0 8.2 0 12 0 12s0 3.8.5 5.8c.3 1.1 1.1 2 2.2 2.3 2 1.5 9.3 1.5 9.3 1.5s7.3 0 9.3-.4c1.1-.3 1.9-1.2 2.2-2.3.5-2 .5-5.8.5-5.8s0-3.8-.5-5.8zM9.5 15.5V8.5l6.3 3.5-6.3 3.5z"/></svg>',
    spotify: '<svg viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.5 17.3c-.2.4-.7.5-1.1.3-2.8-1.7-6.4-2.1-10.6-1.1-.5.1-.9-.2-1-.7-.1-.5.2-.9.7-1 4.6-1 8.6-.6 11.7 1.3.4.2.5.7.3 1.2zm1.5-3.3c-.3.4-.8.6-1.3.3-3.2-2-8.2-2.6-12-1.4-.5.1-1-.2-1.2-.7s.2-1 .7-1.2c4.4-1.3 10-1 13.5 1.5.5.2.6.8.3 1.5zm.1-3.4c-3.9-2.3-10.3-2.5-14.1-1.4-.6.2-1.2-.2-1.4-.8-.2-.6.2-1.2.8-1.4 4.4-1.3 11.5-1.1 16 1.6.5.3.7 1 .4 1.5-.3.5-1 .7-1.7.5z"/></svg>'
};

window.electronAPI.on('media-data', (dataRaw) => {
    const data = JSON.parse(dataRaw);
    
    const themeColor = data.source === 'spotify' ? '#1ed760' : '#ff0000';
    document.documentElement.style.setProperty('--theme-color', themeColor);
    
    if (data.source === 'spotify') {
        platIcon.innerHTML = icons.spotify; platName.innerText = "Spotify Player";
    } else {
        platIcon.innerHTML = icons.youtube;
        platName.innerText = data.source === 'yt-music' ? "YouTube Music Player" : "YouTube Player";
    }

    // Metin Güncelleme ve Kayan Yazı Tetikleme
    titleText.innerText = data.title || "Bağlantı Bekleniyor...";
    artistText.innerText = data.artist || "Sistem Sesi";
    updateMarquee(titleText, tWrap);
    updateMarquee(artistText, aWrap);

    if(data.art) { artImg.src = data.art; artImg.style.display = "block"; }

    if(data.current && data.total) {
        timeCurr.innerText = data.current; timeTotal.innerText = data.total;
        const curParts = data.current.split(':'); const totParts = data.total.split(':');
        if(curParts.length >= 2 && totParts.length >= 2) {
            const curSec = parseInt(curParts[0]) * 60 + parseInt(curParts[1]);
            const totSec = parseInt(totParts[0]) * 60 + parseInt(totParts[1]);
            fill.style.width = (totSec > 0 ? (curSec / totSec) * 100 : 0) + "%";
        }
    }
    playSvg.innerHTML = data.isPlaying ? '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>' : '<path d="M8 5v14l11-7z"/>';
});

document.getElementById('progress-bg').onclick = (e) => {
    const rect = document.getElementById('progress-bg').getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const parts = timeTotal.innerText.split(':');
    if (parts.length >= 2) {
        const totalSec = parseInt(parts[0]) * 60 + parseInt(parts[1]);
        window.electronAPI.send('send-command', `seek:${totalSec * percent}:${percent}`);
    }
};

document.getElementById('play-btn').onclick = () => window.electronAPI.send('send-command', 'playpause');
document.getElementById('next-btn').onclick = () => window.electronAPI.send('send-command', 'next');
document.getElementById('prev-btn').onclick = () => window.electronAPI.send('send-command', 'prev');
document.getElementById('vol-slider').oninput = (e) => window.electronAPI.send('send-command', `volume:${e.target.value}`);
document.getElementById('op-slider').oninput = (e) => window.electronAPI.send('set-opacity', e.target.value);
document.getElementById('vol-icon').onclick = () => document.getElementById('vol-popup').classList.toggle('show');
document.getElementById('op-icon').onclick = () => document.getElementById('op-popup').classList.toggle('show');