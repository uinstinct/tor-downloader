import fs from 'fs';
import { google } from 'googleapis';

import { CLIENT_ID, CLIENT_SECRET, DRIVE_DOWNLOAD_FOLDER, REDIRECT_URI, REFRESH_TOKEN } from './constants.js';
import { bar1 } from './utils.js'

/**
 * @typedef {{id: string; name: string;}} PartialDriveClient
 */

export default function getDriveClient() {
    const client = new google.auth.OAuth2({ clientId: CLIENT_ID, clientSecret: CLIENT_SECRET, redirectUri: REDIRECT_URI });
    client.setCredentials({ refresh_token: REFRESH_TOKEN });
    const driveClient = google.drive({ version: 'v3', auth: client });

    /**
     * @param {string} folderName 
     * @param {string?} folderId
     * @returns {Promise<PartialDriveClient>}
     */
    const createFolder = async (folderName = DRIVE_DOWNLOAD_FOLDER, folderId) => {
        return driveClient.files.create({
            resource: {
                name: folderName,
                mimeType: 'application/vnd.google-apps.folder',
                parents: folderId ? [folderId] : [],
            },
            fields: 'id,name'
        }).then(response => response.data);
    };

    /**
     * @param {string} folderName 
     * @returns {Promise<PartialDriveClient|null>}
     */
    const searchFolder = async (folderName = DRIVE_DOWNLOAD_FOLDER) => driveClient.files.list({
        q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}'`,
        fields: 'files(id, name)',
    }).then((response) => response.data.files ? response.data.files.at(0) : null)

    /**
     * @param {string} fileName 
     * @param {string} filePath 
     * @param {string} fileMimeType 
     * @param {PartialDriveClient['id']?} folderId 
     * @returns {Promise<PartialDriveClient>}
     */
    const saveFile = async (fileName, filePath, fileMimeType, folderId) => {
        console.log(`Uploading ${fileName} to Google Drive`);
        bar1.start();

        return driveClient.files.create({
            requestBody: {
                name: fileName,
                mimeType: fileMimeType,
                parents: folderId ? [folderId] : [],
            },
            media: {
                mimeType: fileMimeType,
                body: fs.createReadStream(filePath),
            },

        }, {
            onUploadProgress: (event) => bar1.update((event.bytesRead / fs.statSync(filePath).size) * 100)
        }).then(val => {
            bar1.stop();
            return val;
        });
    }

    return {
        createFolder,
        searchFolder,
        saveFile
    };
}