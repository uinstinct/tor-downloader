import fs from 'fs';

import { DOWNLOADS_FOLDER } from './constants.js';

export default function clearDownloadsFolder() {
    if(!fs.existsSync(DOWNLOADS_FOLDER)) {
        console.log(`Local Downloads Folder : ${DOWNLOADS_FOLDER} not present`);
        return ;
    }

    const files = fs.readdirSync(DOWNLOADS_FOLDER);

    files.forEach(file => {
        if (file !== 'README.md') {
            fs.rmSync(DOWNLOADS_FOLDER + '/' + file, { recursive: true, force: true });
        }
    });
}