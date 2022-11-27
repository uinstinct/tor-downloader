import WebTorrent from 'webtorrent';
import cliProgress from 'cli-progress';

const client = new WebTorrent()

const magnetURI = 'magnet:?xt=urn:btih:CF6F1F769B23994C995FF0EF1B5510900769AE57&dn=My+Hero+Academia%3A+Two+Heroes+%282018%29+%5BBluRay%5D+%5B1080p%5D+%5BYTS%5D+%5BYIFY%5D&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969%2Fannounce&tr=udp%3A%2F%2F9.rarbg.com%3A2710%2Fannounce&tr=udp%3A%2F%2Fp4p.arenabg.com%3A1337&tr=udp%3A%2F%2Ftracker.internetwarriors.net%3A1337&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=http%3A%2F%2Ftracker.openbittorrent.com%3A80%2Fannounce&tr=udp%3A%2F%2Fopentracker.i2p.rocks%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.internetwarriors.net%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969%2Fannounce&tr=udp%3A%2F%2Fcoppersurfer.tk%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.zer0day.to%3A1337%2Fannounce'



const bar1 = new cliProgress.SingleBar({
    format: '{bar} | {percentage}% || Speed: {speed}'
}, cliProgress.Presets.shades_classic);


client.add(magnetURI, { path: './' }, (torrent) => {
    bar1.start(100, 0);

    const interval = setInterval(() => {
        bar1.update((torrent.progress * 100).toFixed(1), { speed: torrent.downloadSpeed });
    }, 1_000);

    torrent.on('done', () => {
        bar1.stop();
        clearInterval(interval);
        console.log('torrent download finished');
        process.exit(0);
    });
});