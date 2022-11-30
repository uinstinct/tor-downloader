import WebTorrent from 'webtorrent';
import fs from 'fs';

import { bar1, bar2, convertMbps } from './utils.js';
import { PROGRESS_BAR_INTERVAL, PROGRESS_BAR_SWITCH_TIME } from './constants.js'

const client = new WebTorrent();

function startDownloadingMagnetLink(maglink) {
    console.log('downloading --> ', maglink, '\n');

    client.add(maglink, { path: './torrent-downloads/' }, (torrent) => {
        bar1.start(100, 0);
        bar2.start(100, 100);

        const interval1 = setInterval(() => {
            bar1.update(torrent.progress * 100);
        }, PROGRESS_BAR_INTERVAL);

        let interval2;

        setTimeout(() => {
            interval2 = setInterval(() => {
                bar2.update(100, { speed: convertMbps(torrent.downloadSpeed).toFixed(1), downloaded: convertMbps(torrent.downloaded).toFixed(0), peers: torrent.numPeers, torrentName: torrent.name });
            }, PROGRESS_BAR_INTERVAL);
        }, PROGRESS_BAR_SWITCH_TIME);

        torrent.on('done', () => {
            bar1.stop();
            bar2.stop();

            clearInterval(interval1);
            clearInterval(interval2);

            console.log('torrent download finished\n');
            process.exit(0);
        });
    });
}

const magnetLinks = fs.readFileSync('./magnets.txt')?.toString().split('\n') || [];
magnetLinks.forEach(maglink => startDownloadingMagnetLink(maglink));