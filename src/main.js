import WebTorrent from 'webtorrent';
import fs from 'fs';
import mime from 'mime-types';

import { bar1, bar2, convertMbps } from './utils.js';
import { DOWNLOADS_FOLDER, PROGRESS_BAR_INTERVAL, PROGRESS_BAR_SWITCH_TIME } from './constants.js'
import getDriveClient from './upload-to-drive.js';

const client = new WebTorrent();

/**
 * @param {string} maglink 
 * @returns {Promise<string|null>}
 */
async function startDownloadingMagnetLink(maglink) {
    return new Promise((resolve, reject) => {
        console.log('downloading --> ', maglink, '\n');

        client.add(maglink, { path: DOWNLOADS_FOLDER }, (torrent) => {
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

                resolve(torrent.name);
            });

            torrent.on('error', (err) => {
                console.log('\n the error was ', err);
                reject(null);
            });
        });
    });
}

/**
 * @param {ReturnType<typeof import('./upload-to-drive').default>} driveClient
 * @param {string} filePath
 * @param {string} parentFolderId
 */
async function uploadContentsInFolder(driveClient, filePath, parentFolderId) {
    const dirents = fs.readdirSync(filePath, { withFileTypes: true });
    for (const dirent of dirents) { // upload files/folders one by one
        const currentFilePath = filePath + '/' + dirent.name;
        if (dirent.isDirectory()) {
            const { id: currentFolderId } = await driveClient.createFolder(dirent.name, parentFolderId);
            await uploadContentsInFolder(driveClient, currentFilePath, currentFolderId);
        } else {
            await driveClient.saveFile(dirent.name, currentFilePath, mime.contentType(dirent.name), parentFolderId);
        }
    };
}

async function main() {
    console.log('Initializing drive client ...');
    const driveClient = getDriveClient();
    console.log('Checking if gdrive folder is present?');
    let folder = await driveClient.searchFolder();
    if (!folder) {
        console.log('Creating download folder on drive >');
        folder = await driveClient.createFolder();
    } else {
        console.log('Download Folder present on drive!');
    }
    console.log(`Folder Details :: ID: ${folder.id} | Name: ${folder.name}`);

    const magnetLinks = fs.readFileSync('./magnets.txt')?.toString().split('\n') || [];

    await startDownloadingMagnetLink(magnetLinks.at(0));

    await uploadContentsInFolder(driveClient, DOWNLOADS_FOLDER, folder.id);

    process.exit(0);
}

main();
