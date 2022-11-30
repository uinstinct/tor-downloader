import fs from 'fs';

function clearDownloadsFolder() {
    console.log(fs.existsSync('./torrent-downloads'), '<-- result');
    // const files = fs.readdirSync('./torrent-downloads');
    
    // console.log(files);
}

clearDownloadsFolder();