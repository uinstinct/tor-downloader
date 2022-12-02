# Setting up google drive credentials

**Original Blog - https://blog.tericcabrel.com/upload-file-to-google-drive-with-nodejs/**

Google Drive is a storage service available for Google users and allows you to store all kinds of files. All users have 15GB for free after creating their Google account, and all you need to do is log in at [https://drive.google.com](https://drive.google.com) and then upload your files inside.

For advanced users (developers), there is an API available to programmatically performs actions like **Creating a folder, adding a file, searching files, etc...** It can be useful in some cases:

-   Backup your database and upload it to your drive
-   Set a Cron job to look up inside a folder and upload the files inside
-   Receive an email when you reach the storage threshold
-   Delete all files older than a specific date

## What we want to achieve

We have a `.jpg` file on our server that we want to upload into our Google Drive inside a folder named `Picture`. If the folder doesn't exist, we will create it, and finally, when the file is successfully updated, we delete it on the server.

## Get API Credentials

The first step is to get our Google Drive credentials which are:

-   A **Client Id** and a **Client Secret**
-   A **redirect URI** and **refresh token**

You need to have a Google account for the steps below:

### Step one

Go to [https://console.cloud.google.com/cloud-resource-manager](https://console.cloud.google.com/cloud-resource-manager) and click on the button **"Create Project"**.

Give a name to the project, click on **"Create"** to submit, and wait for the creation to complete.

![](https://blog.tericcabrel.com/content/images/2021/04/1--gd.png)

Create a new project on the Google Cloud Platform

### Step two

Once the project is created, select it. You will be redirected to the console dashboard. On the sidebar menu, click on the menu **"APIs & Services"**;  
Locate the button labeled **"ENABLE APIS AND SERVICES"** and click on it.

![](https://blog.tericcabrel.com/content/images/2021/04/2--gd.png)

Enable APIs & Services on the Google Cloud Platform

### Step three

You will be redirected to a page that lists all the Google APIs. Search for _"Google Drive API"_ and click on it in the result list.

On the next page, click on the button **"Enable"**, you will be redirected to a page where the API will be enabled.

### Step four

On the new page, click on the menu in the sidebar labeled **"Credentials".** On the next page, locate the drop-down button labeled **"CREATE CREDENTIALS"** click on it, and select the drop-down menu labeled **"OAuth client ID"**.

![](https://blog.tericcabrel.com/content/images/2021/04/3--gd.png)

Create OAuth Client ID

### Step five

On the new page, click on the button **"CONFIGURE CONSENT SCREEN"** and then check **"External"** for the User Type.

You can select **"Internal"** if the account you use is inside an organization which is not my case. Click on the button **"Create"**.

![](https://blog.tericcabrel.com/content/images/2021/04/4--gd.png)

Configure consent screen: select user type

On the new page, we have a page with four steps.

In step one, give your application the name and select your email address as the value for the input labeled **"User support email"**.

Also, give your email address as the value for the input labeled **"Developer contact information"**. You can ignore other inputs since they aren't mandatory. Click on **"Save and Continue"**

![](https://blog.tericcabrel.com/content/images/2021/04/5--gd.png)

Configure consent screen: Provide application information.

In step two, no change to do, so click on **"Save and Continue."**.

In step three, add a Test user with your email address; you can add up to 100.

Click on **"Save and Continue"**.

![](https://blog.tericcabrel.com/content/images/2021/04/6--gd.png)

Configure consent screen: Add test users.

Step four is just a summary of the previous steps.

Click on the button **"BACK TO DASHBOARD"**.

### Step six

On the new page, click on the menu in the sidebar labeled **"Credentials"**. On the next page, locate the drop-down button labeled **"CREATE CREDENTIALS".**

Click on it and select the drop-down menu labeled **"OAuth client ID"**.

On the next page, select **"Web Application"** as the input value labeled **"Application type".**

Give a name to our Web Application.

In the section **"Authorized redirect URIs,"** click on **"ADD URI"** and fill in the input with this value: [https://developers.google.com/oauthplayground](https://developers.google.com/oauthplayground)

![](https://blog.tericcabrel.com/content/images/2021/04/7--gd.png)

Create OAuth client ID for a Web Application

Click on **"CREATE"** to submit.

Hooray 🎉 We have our **Client ID** and **Client Secret**.

![Client ID and Client secret created successfully](https://blog.tericcabrel.com/content/images/2021/04/8--gd.png)

Client ID and Client secret created successfully

At this step, we already have:

-   Client ID ✅
-   Client Secret ✅
-   Redirect URI ✅ ([https://developers.google.com/oauthplayground](https://developers.google.com/oauthplayground))
-   Refresh Token ❌

### Step seven

To get the refresh token, go to [https://developers.google.com/oauthplayground](https://developers.google.com/oauthplayground)

![](https://blog.tericcabrel.com/content/images/2021/04/9--gd.png)

Get the refresh token

You will be redirected to our Google Account to authorize the app to access our Google Drive.

Authorize the application, and you will be redirected to a page with the content below:

![](https://blog.tericcabrel.com/content/images/2021/04/10--gd.png)

Get the refresh token: Exchange authorization code for tokens.

When the request is completed, you will have your refresh token 🎉

![](https://blog.tericcabrel.com/content/images/2021/04/11--gd.png)

Refresh token generated successfully!

## Project structure

We have everything to start interacting with Google Drive API. We will use the Node.js project we created with Typescript in [this tutorial](https://blog.tericcabrel.com/blog/set-up-a-nodejs-project-with-typescript-eslint-and-prettier/).

Clone the repository at this [link](https://github.com/tericcabrel/node-ts-starter.git), then go inside.

```bash

git clone https://github.com/tericcabrel/node-ts-starter.git node-gdrive-api

cd node-gdrive-api

yarn install


```

Clone repository containing the minimal setup

At the root folder, create a directory named "public" and copy a picture file inside, which will be uploaded to Google Drive.

I took this [picture](https://unsplash.com/photos/uj3hvdfQujI) on Unsplash by SpaceX.

```bash
├── public
│   ├── spacex-uj3hvdfQujI-unsplash.jpg
├── src
│   ├── index.ts
├── .eslintrc.js
├── .prettierrc.js
├── README.md
├── package.json
├── tsconfig.json
└── yarn.lock
```

Directory structure

## Set up environment variables

We need the previously created credentials to interact with Google Drive API, and to avoid using them raw, we need to load them from a configuration file; we will use the [dotenv](https://www.npmjs.com/package/dotenv) package.

We also need the **[Node.js SDK for Google API](https://developers.google.com/drive/api/quickstart/nodejs)**. So, inside the terminal at the project root directory, run the code below to install them:

```bash

yarn add dotenv googleapis
yarn add -D @types/node


```

Install dotenv and googleapis

Create a file named `.env` then add the content below:

```text

GOOGLE_DRIVE_CLIENT_ID=<YOUR_CLIENT_ID>
GOOGLE_DRIVE_CLIENT_SECRET=<YOUR_CLIENT_SECRET>
GOOGLE_DRIVE_REDIRECT_URI=https://developers.google.com/oauthplayground
GOOGLE_DRIVE_REFRESH_TOKEN=<YOUR_REFRESH_TOKEN>


```

Configuration files with Google Drive API credentials

Open `src/index.ts` and type the code below, save and run `yarn start` to see the result:

```ts

import dotenv from 'dotenv';

dotenv.config();

console.log(process.env.GOOGLE_DRIVE_CLIENT_ID);
console.log(process.env.GOOGLE_DRIVE_CLIENT_SECRET);
console.log(process.env.GOOGLE_DRIVE_REDIRECT_URI);
console.log(process.env.GOOGLE_DRIVE_REFRESH_TOKEN);



```

Content of src/index.ts

## Interact with Google Drive API

We will create a file named `googleDriveService` which 4 methods:

-   **createDriveClient()**: create a client with the credentials generated before, and we will use it to make calls to Google Drive API.
-   **searchFolder()**: search a folder inside Google Drive.
-   **createFolder()**: create a new folder inside Google Drive.
-   **saveFile()**: create a new file in a folder inside Google Drive.

```ts
import fs from 'fs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { google } = require('googleapis');

/**
 * Browse the link below to see the complete object returned for folder/file creation and search
 *
 * @link https://developers.google.com/drive/api/v3/reference/files#resource
 */
type PartialDriveFile = {
  id: string;
  name: string;
};

type SearchResultResponse = {
  kind: 'drive#fileList';
  nextPageToken: string;
  incompleteSearch: boolean;
  files: PartialDriveFile[];
};

export class GoogleDriveService {
  private driveClient;

  public constructor(clientId: string, clientSecret: string, redirectUri: string, refreshToken: string) {
    this.driveClient = this.createDriveClient(clientId, clientSecret, redirectUri, refreshToken);
  }

  createDriveClient(clientId: string, clientSecret: string, redirectUri: string, refreshToken: string) {
    const client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

    client.setCredentials({ refresh_token: refreshToken });

    return google.drive({
      version: 'v3',
      auth: client,
    });
  }

  createFolder(folderName: string): Promise<PartialDriveFile> {
    return this.driveClient.files.create({
      resource: {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
      },
      fields: 'id, name',
    });
  }

  searchFolder(folderName: string): Promise<PartialDriveFile | null> {
    return new Promise((resolve, reject) => {
      this.driveClient.files.list(
        {
          q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}'`,
          fields: 'files(id, name)',
        },
        (err, res: { data: SearchResultResponse }) => {
          if (err) {
            return reject(err);
          }

          return resolve(res.data.files ? res.data.files[0] : null);
        },
      );
    });
  }

  saveFile(fileName: string, filePath: string, fileMimeType: string, folderId?: string) {
    return this.driveClient.files.create({
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
  }
}
```

Content of file src/googleDriveService.ts

Now let's use the GoogleDriveService in our `index.ts` file, so replace the content with the one below:

```ts
import dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

import { GoogleDriveService } from './googleDriveService';

dotenv.config();

const driveClientId = process.env.GOOGLE_DRIVE_CLIENT_ID || '';
const driveClientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET || '';
const driveRedirectUri = process.env.GOOGLE_DRIVE_REDIRECT_URI || '';
const driveRefreshToken = process.env.GOOGLE_DRIVE_REFRESH_TOKEN || '';

(async () => {
  const googleDriveService = new GoogleDriveService(driveClientId, driveClientSecret, driveRedirectUri, driveRefreshToken);

  const finalPath = path.resolve(__dirname, '../public/spacex-uj3hvdfQujI-unsplash.jpg');
  const folderName = 'Picture';

  if (!fs.existsSync(finalPath)) {
    throw new Error('File not found!');
  }

  let folder = await googleDriveService.searchFolder(folderName).catch((error) => {
    console.error(error);
    return null;
  });

  if (!folder) {
    folder = await googleDriveService.createFolder(folderName);
  }

  await googleDriveService.saveFile('SpaceX', finalPath, 'image/jpg', folder.id).catch((error) => {
    console.error(error);
  });

  console.info('File uploaded successfully!');

  // Delete the file on the server
  fs.unlinkSync(finalPath);
})();
```

Content of file src/index.ts

Run `yarn start` to start the application and see the result:

![](https://blog.tericcabrel.com/content/images/2021/04/12--gd.png)

The picture was uploaded to Google Drive successfully 🎉

## Wrap up

We saw how to use the Google Drive SDK to upload a file to Google Drive from Node.js, and you do more with SDK. Check out [the documentation](https://developers.google.com/drive/api/guides/about-files) to learn more.

You can find the code source on the [GitHub repository](https://github.com/tericcabrel/blog-tutorials/tree/main/node-gdrive-api).

Follow me on [Twitter](https://twitter.com/intent/user?screen_name=tericcabrel) or subscribe to [my newsletter](https://newsletter.tericcabrel.com) to avoid missing the upcoming posts and the tips and tricks I occasionally share.Google Drive is a storage service available for Google users and allows you to store all kinds of files. All users have 15GB for free after creating their Google account, and all you need to do is log in at [https://drive.google.com](https://drive.google.com) and then upload your files inside.

For advanced users (developers), there is an API available to programmatically performs actions like **Creating a folder, adding a file, searching files, etc...** It can be useful in some cases:

-   Backup your database and upload it to your drive
-   Set a Cron job to look up inside a folder and upload the files inside
-   Receive an email when you reach the storage threshold
-   Delete all files older than a specific date

## What we want to achieve

We have a `.jpg` file on our server that we want to upload into our Google Drive inside a folder named `Picture`. If the folder doesn't exist, we will create it, and finally, when the file is successfully updated, we delete it on the server.

## Get API Credentials

The first step is to get our Google Drive credentials which are:

-   A **Client Id** and a **Client Secret**
-   A **redirect URI** and **refresh token**

You need to have a Google account for the steps below:

### Step one

Go to [https://console.cloud.google.com/cloud-resource-manager](https://console.cloud.google.com/cloud-resource-manager) and click on the button **"Create Project"**.

Give a name to the project, click on **"Create"** to submit, and wait for the creation to complete.

![](https://blog.tericcabrel.com/content/images/2021/04/1--gd.png)

Create a new project on the Google Cloud Platform

### Step two

Once the project is created, select it. You will be redirected to the console dashboard. On the sidebar menu, click on the menu **"APIs & Services"**;  
Locate the button labeled **"ENABLE APIS AND SERVICES"** and click on it.

![](https://blog.tericcabrel.com/content/images/2021/04/2--gd.png)

Enable APIs & Services on the Google Cloud Platform

### Step three

You will be redirected to a page that lists all the Google APIs. Search for _"Google Drive API"_ and click on it in the result list.

On the next page, click on the button **"Enable"**, you will be redirected to a page where the API will be enabled.

### Step four

On the new page, click on the menu in the sidebar labeled **"Credentials".** On the next page, locate the drop-down button labeled **"CREATE CREDENTIALS"** click on it, and select the drop-down menu labeled **"OAuth client ID"**.

![](https://blog.tericcabrel.com/content/images/2021/04/3--gd.png)

Create OAuth Client ID

### Step five

On the new page, click on the button **"CONFIGURE CONSENT SCREEN"** and then check **"External"** for the User Type.

You can select **"Internal"** if the account you use is inside an organization which is not my case. Click on the button **"Create"**.

![](https://blog.tericcabrel.com/content/images/2021/04/4--gd.png)

Configure consent screen: select user type

On the new page, we have a page with four steps.

In step one, give your application the name and select your email address as the value for the input labeled **"User support email"**.

Also, give your email address as the value for the input labeled **"Developer contact information"**. You can ignore other inputs since they aren't mandatory. Click on **"Save and Continue"**

![](https://blog.tericcabrel.com/content/images/2021/04/5--gd.png)

Configure consent screen: Provide application information.

In step two, no change to do, so click on **"Save and Continue."**.

In step three, add a Test user with your email address; you can add up to 100.

Click on **"Save and Continue"**.

![](https://blog.tericcabrel.com/content/images/2021/04/6--gd.png)

Configure consent screen: Add test users.

Step four is just a summary of the previous steps.

Click on the button **"BACK TO DASHBOARD"**.

### Step six

On the new page, click on the menu in the sidebar labeled **"Credentials"**. On the next page, locate the drop-down button labeled **"CREATE CREDENTIALS".**

Click on it and select the drop-down menu labeled **"OAuth client ID"**.

On the next page, select **"Web Application"** as the input value labeled **"Application type".**

Give a name to our Web Application.

In the section **"Authorized redirect URIs,"** click on **"ADD URI"** and fill in the input with this value: [https://developers.google.com/oauthplayground](https://developers.google.com/oauthplayground)

![](https://blog.tericcabrel.com/content/images/2021/04/7--gd.png)

Create OAuth client ID for a Web Application

Click on **"CREATE"** to submit.

Hooray 🎉 We have our **Client ID** and **Client Secret**.

![Client ID and Client secret created successfully](https://blog.tericcabrel.com/content/images/2021/04/8--gd.png)

Client ID and Client secret created successfully

At this step, we already have:

-   Client ID ✅
-   Client Secret ✅
-   Redirect URI ✅ ([https://developers.google.com/oauthplayground](https://developers.google.com/oauthplayground))
-   Refresh Token ❌

### Step seven

To get the refresh token, go to [https://developers.google.com/oauthplayground](https://developers.google.com/oauthplayground)

![](https://blog.tericcabrel.com/content/images/2021/04/9--gd.png)

Get the refresh token

You will be redirected to our Google Account to authorize the app to access our Google Drive.

Authorize the application, and you will be redirected to a page with the content below:

![](https://blog.tericcabrel.com/content/images/2021/04/10--gd.png)

Get the refresh token: Exchange authorization code for tokens.

When the request is completed, you will have your refresh token 🎉

![](https://blog.tericcabrel.com/content/images/2021/04/11--gd.png)

Refresh token generated successfully!

## Project structure

We have everything to start interacting with Google Drive API. We will use the Node.js project we created with Typescript in [this tutorial](https://blog.tericcabrel.com/blog/set-up-a-nodejs-project-with-typescript-eslint-and-prettier/).

Clone the repository at this [link](https://github.com/tericcabrel/node-ts-starter.git), then go inside.

```bash

git clone https://github.com/tericcabrel/node-ts-starter.git node-gdrive-api

cd node-gdrive-api

yarn install


```

Clone repository containing the minimal setup

At the root folder, create a directory named "public" and copy a picture file inside, which will be uploaded to Google Drive.

I took this [picture](https://unsplash.com/photos/uj3hvdfQujI) on Unsplash by SpaceX.

```bash
├── public
│   ├── spacex-uj3hvdfQujI-unsplash.jpg
├── src
│   ├── index.ts
├── .eslintrc.js
├── .prettierrc.js
├── README.md
├── package.json
├── tsconfig.json
└── yarn.lock
```

Directory structure

## Set up environment variables

We need the previously created credentials to interact with Google Drive API, and to avoid using them raw, we need to load them from a configuration file; we will use the [dotenv](https://www.npmjs.com/package/dotenv) package.

We also need the **[Node.js SDK for Google API](https://developers.google.com/drive/api/quickstart/nodejs)**. So, inside the terminal at the project root directory, run the code below to install them:

```bash

yarn add dotenv googleapis
yarn add -D @types/node


```

Install dotenv and googleapis

Create a file named `.env` then add the content below:

```text

GOOGLE_DRIVE_CLIENT_ID=<YOUR_CLIENT_ID>
GOOGLE_DRIVE_CLIENT_SECRET=<YOUR_CLIENT_SECRET>
GOOGLE_DRIVE_REDIRECT_URI=https://developers.google.com/oauthplayground
GOOGLE_DRIVE_REFRESH_TOKEN=<YOUR_REFRESH_TOKEN>


```

Configuration files with Google Drive API credentials

Open `src/index.ts` and type the code below, save and run `yarn start` to see the result:

```ts

import dotenv from 'dotenv';

dotenv.config();

console.log(process.env.GOOGLE_DRIVE_CLIENT_ID);
console.log(process.env.GOOGLE_DRIVE_CLIENT_SECRET);
console.log(process.env.GOOGLE_DRIVE_REDIRECT_URI);
console.log(process.env.GOOGLE_DRIVE_REFRESH_TOKEN);



```

Content of src/index.ts

## Interact with Google Drive API

We will create a file named `googleDriveService` which 4 methods:

-   **createDriveClient()**: create a client with the credentials generated before, and we will use it to make calls to Google Drive API.
-   **searchFolder()**: search a folder inside Google Drive.
-   **createFolder()**: create a new folder inside Google Drive.
-   **saveFile()**: create a new file in a folder inside Google Drive.

```ts
import fs from 'fs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { google } = require('googleapis');

/**
 * Browse the link below to see the complete object returned for folder/file creation and search
 *
 * @link https://developers.google.com/drive/api/v3/reference/files#resource
 */
type PartialDriveFile = {
  id: string;
  name: string;
};

type SearchResultResponse = {
  kind: 'drive#fileList';
  nextPageToken: string;
  incompleteSearch: boolean;
  files: PartialDriveFile[];
};

export class GoogleDriveService {
  private driveClient;

  public constructor(clientId: string, clientSecret: string, redirectUri: string, refreshToken: string) {
    this.driveClient = this.createDriveClient(clientId, clientSecret, redirectUri, refreshToken);
  }

  createDriveClient(clientId: string, clientSecret: string, redirectUri: string, refreshToken: string) {
    const client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

    client.setCredentials({ refresh_token: refreshToken });

    return google.drive({
      version: 'v3',
      auth: client,
    });
  }

  createFolder(folderName: string): Promise<PartialDriveFile> {
    return this.driveClient.files.create({
      resource: {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
      },
      fields: 'id, name',
    });
  }

  searchFolder(folderName: string): Promise<PartialDriveFile | null> {
    return new Promise((resolve, reject) => {
      this.driveClient.files.list(
        {
          q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}'`,
          fields: 'files(id, name)',
        },
        (err, res: { data: SearchResultResponse }) => {
          if (err) {
            return reject(err);
          }

          return resolve(res.data.files ? res.data.files[0] : null);
        },
      );
    });
  }

  saveFile(fileName: string, filePath: string, fileMimeType: string, folderId?: string) {
    return this.driveClient.files.create({
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
  }
}
```

Content of file src/googleDriveService.ts

Now let's use the GoogleDriveService in our `index.ts` file, so replace the content with the one below:

```ts
import dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

import { GoogleDriveService } from './googleDriveService';

dotenv.config();

const driveClientId = process.env.GOOGLE_DRIVE_CLIENT_ID || '';
const driveClientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET || '';
const driveRedirectUri = process.env.GOOGLE_DRIVE_REDIRECT_URI || '';
const driveRefreshToken = process.env.GOOGLE_DRIVE_REFRESH_TOKEN || '';

(async () => {
  const googleDriveService = new GoogleDriveService(driveClientId, driveClientSecret, driveRedirectUri, driveRefreshToken);

  const finalPath = path.resolve(__dirname, '../public/spacex-uj3hvdfQujI-unsplash.jpg');
  const folderName = 'Picture';

  if (!fs.existsSync(finalPath)) {
    throw new Error('File not found!');
  }

  let folder = await googleDriveService.searchFolder(folderName).catch((error) => {
    console.error(error);
    return null;
  });

  if (!folder) {
    folder = await googleDriveService.createFolder(folderName);
  }

  await googleDriveService.saveFile('SpaceX', finalPath, 'image/jpg', folder.id).catch((error) => {
    console.error(error);
  });

  console.info('File uploaded successfully!');

  // Delete the file on the server
  fs.unlinkSync(finalPath);
})();
```

Content of file src/index.ts

Run `yarn start` to start the application and see the result:

![](https://blog.tericcabrel.com/content/images/2021/04/12--gd.png)

The picture was uploaded to Google Drive successfully 🎉

## Wrap up

We saw how to use the Google Drive SDK to upload a file to Google Drive from Node.js, and you do more with SDK. Check out [the documentation](https://developers.google.com/drive/api/guides/about-files) to learn more.

You can find the code source on the [GitHub repository](https://github.com/tericcabrel/blog-tutorials/tree/main/node-gdrive-api).

Follow me on [Twitter](https://twitter.com/intent/user?screen_name=tericcabrel) or subscribe to [my newsletter](https://newsletter.tericcabrel.com) to avoid missing the upcoming posts and the tips and tricks I occasionally share.
