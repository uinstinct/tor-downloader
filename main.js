import WebTorrent from 'webtorrent';
import cliProgress from 'cli-progress';
import fs from 'fs';

const bar1 = new cliProgress.SingleBar({
    format: '{bar} | {percentage}% || Speed: {speed} MB/s || Downloaded: {downloaded} MB || Name: {torrentName}'
}, cliProgress.Presets.shades_classic);
const client = new WebTorrent();

const convertMbps = (byts) => byts / 1_000_000;

function startDownloadingMagnetLink(maglink) {
    console.log('downloading --> ', maglink, '\n');

    client.add(maglink, { path: './torrent-downloads/' }, (torrent) => {
        bar1.start(100, 0);

        const interval = setInterval(() => {
            bar1.update(torrent.progress * 100, { speed: convertMbps(torrent.downloadSpeed), downloaded: convertMbps(torrent.downloaded), torrentName: torrent.name });
        }, 1_000);

        torrent.on('done', () => {
            bar1.stop();
            clearInterval(interval);
            console.log('torrent download finished\n');
            process.exit(0);
        });
    });
}

const magnetLinks = fs.readFileSync('./magnets.txt')?.toString().split('\n') || [];
magnetLinks.forEach(maglink => startDownloadingMagnetLink(maglink));