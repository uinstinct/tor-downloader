import fs from 'fs';

import { DOWNLOADS_FOLDER } from './constants.js';

function clearDownloadsFolder() {
    // console.log(fs.existsSync('./torrent-downloads'), '<-- result');
    const files = fs.readdirSync(DOWNLOADS_FOLDER);

    files.forEach(file => {
        if (file !== '.gitkeep') {
            fs.rmSync(DOWNLOADS_FOLDER + '/' + file, { recursive: true, force: true });
        }
    });
}

clearDownloadsFolder();