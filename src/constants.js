import * as dotenv from 'dotenv';

dotenv.config();

// google drive
export const CLIENT_ID = process.env.GOOGLE_CLOUD_CLIENT_ID;
export const CLIENT_SECRET = process.env.GOOGLE_CLOUD_CLIENT_SECRET;
export const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
export const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
export const DRIVE_DOWNLOAD_FOLDER = 'gdrive-torrent-downloads';

// progress bar
export const PROGRESS_BAR_INTERVAL = 4_000;
export const PROGRESS_BAR_SWITCH_TIME = 2_000;

// folders
export const DOWNLOADS_FOLDER = './torrent-downloads';