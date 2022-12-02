import { google } from 'googleapis';
import { CLIENT_ID, CLIENT_SECRET, DRIVE_DOWNLOAD_FOLDER, REDIRECT_URI, REFRESH_TOKEN } from './constants.js'

/**
 * @typedef {{id: string; name: string;}} PartialDriveClient
 */

export default function getDriveClient() {
    const client = new google.auth.OAuth2({ clientId: CLIENT_ID, clientSecret: CLIENT_SECRET, redirectUri: REDIRECT_URI });
    client.setCredentials({ refresh_token: REFRESH_TOKEN });
    const driveClient = google.drive({ version: 'v3', auth: client });

    /**
     * @param {string} folderName 
     * @returns {Promise<PartialDriveClient>}
     */
    const createFolder = async (folderName = DRIVE_DOWNLOAD_FOLDER) => {
        return driveClient.files.create({
            resource: {
                name: folderName,
                mimeType: 'application/vnd.google-apps.folder',
            },
            fields: 'id,name'
        });
    };

    /**
     * @param {string} folderName 
     * @returns {Promise<PartialDriveClient|null>}
     */
    const searchFolder = async (folderName = DRIVE_DOWNLOAD_FOLDER) => {
        driveClient.files.list({
            q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}'`,
            fields: 'files(id, name)',
        }).then((response) => response.data.files ? response.data.files.at(0) : null);
    }

    /**
     * @param {string} fileName 
     * @param {string} filePath 
     * @param {string} fileMimeType 
     * @param {PartialDriveClient['id']} folderId 
     * @returns {PartialDriveClient}
     */
    const saveFile = async (fileName, filePath, fileMimeType, folderId) => driveClient.files.create({
        requestBody: {
            name: fileName,
            mimeType: fileMimeType,
            parents: folderId ? [folderId] : [],
        },
        media: {
            mimeType: fileMimeType,
            body: fs.createReadStream(filePath),
        },
    });

    return {
        createFolder,
        searchFolder,
        saveFile
    };
}

// async function run() {
//     const client = new google.auth.OAuth2({ clientId: CLIENT_ID, clientSecret: CLIENT_SECRET, redirectUri: REDIRECT_URI });
//     client.setCredentials({ refresh_token: REFRESH_TOKEN });

//     const driveClient = google.drive({ version: 'v3', auth: client });

//     const res = await driveClient.files.list({ pageSize: 10 });

//     console.log(res.data.files);
// }

// run();