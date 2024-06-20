# Server Skin Aja Capstone C241-PR567
## Team Member
#### (ML) M258D4KY1521-Muhammad Gus Nadir-Universitas Muhammadiyah Malang
#### (ML) M008D4KY2210-Rahmat Naufal Sahli-Universitas Gadjah Mada
#### (CC) C370D4KX0390-Zulfa Hana Aqliyah-STMIK IKMI Cirebon 
#### (CC) C007D4KY0480-Kaonang Sigit Prakoso-Universitas Dian Nuswantoro
#### (MD) A152D4KX4047-Triyanti Dwi Aryanti-Sekolah Tinggi Teknologi Bandung
# API Documentation
This document provides information on how to use the API endpoints and their functionalities.
## Setup Project
To run this project, install it locally using npm on your pc
```sh
# Clone repository
git clone https://github.com/username/proyek.git](https://github.com/C241-PR567/CC.git
# change directory to server-API-xdetect
$ cd CC
```
Please go to Google Cloud Console and create a service account with permissions for both Storage Object Admin and Storage Object Viewer
## Configure your .env
```sh
- Change configuration with your database (this app using Firebase) : 
    API_KEY=<YOUR_PRIVATE_KEY>
    AUTH_DOMAIN=<YOUR_PRIVATE_KEY>
    PROJECT_ID=<YOUR_PRIVATE_KEY>
    STORAGE_BUCKET=<YOUR_PRIVATE_KEY>
    MESSAGING_SENDER_ID=<YOUR_PRIVATE_KEY>
    APP_ID=<YOUR_PRIVATE_KEY>
    GOOGLE_CLOUD_PROJECT=<YOUR_CLOUD_PROJECT>
    GOOGLE_APPLICATION_CREDENTIALS=<YOUR_PATH_TO_SERVICE_ACCOUNT>
```
## Create folder called db-config

This folder is used to store 2 file including firebase-config.js and serviceAccount.json. Use serviceAccount.json from Google Cloud Project
```sh
- Create firebase-config.js :

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

- locate in line 4 file handler.js
```
## Configure Node Module

```sh
# in CC

# install all depencencies using `npm install`

# run the backend using `npm start` or if you want to use dev environment you can hit `npm run dev`
```
# Recap Endpoint Routes

|     Route               | HTTP Method   | Description                                  |
|:------------------------|:--------------|:---------------------------------------------|
| /signup                 | POST          | Sign up a new user                           |
| /signin                 | POST          | Sign in a user                               |
| /signout                | POST          | Sign out a user                              |
| /reset-password         | POST          | Reset user's password                        |
| /upload-profile-picture | POST          | Upload a profile picture for a user          |
| /predict                | POST          | Perform a prediction using an uploaded image |
| /list                   | GET           | Get all list                                 |

# Endpoints 
## POST /signup

Create a new user account.

#### Request

* Method: POST
* Path: /signup
* Body Parameters:
```sh
  {
    "name": "John Doe",
    "email": "johndoe@example.com",
    "phone": "1234567890",
    "password": "password123"
  }
```
#### Response

* Success (HTTP 200):

    * success (boolean): true
    * msg (string): "Berhasil SignUp, silakan SignIn"

* Failure (HTTP 400):

    * success (boolean): false
    * msg (string): "Email sudah terdaftar"

## POST /signin

Authenticate and sign in a user.

#### Request

* Method: POST
* Path: /signin
* Body Parameters:
```sh
{
  "email": "johndoe@example.com",
  "password": "password123"
}
```

#### Response

* Success (HTTP 200):

    * success (boolean): true
    * msg (string): "Berhasil Sign In"
    * data (object):
        * uid (string): User's unique ID.
        * email (string): User's email address.
* Failure (HTTP 404):

    * success (boolean): false
    * msg (string): "Error melakukan Sign In"
 
      
## POST /reset-password

Send a password reset email to the user.

#### Request

* Method: POST
* Path: /reset-password
* Body Parameters:
```sh
{
  "email": "johndoe@example.com"
}
```
#### Response

* Success (HTTP 200):

    * msg (string): "Link Reset Password Telah Dikirim Ke Email"
      
* Failure (HTTP 200):
  
    * msg (string): "Error melakukan reset password"
  
## POST /Signout

Sign out the currently authenticated user.

#### Request

* Method: POST
* Path: /Signout
#### Response

* Success (HTTP 200):

    * msg (string): "Sign out Berhasil"
* Failure (HTTP 500):

    * msg (string): "Gagal Melakukan Sign Out"

## POST /predict

Upload an image file for prediction.

#### Request

* Method: POST
* Path: /predict
* Body Parameters:
    * image (file): Image file to be uploaded.
#### Response

* Success (HTTP 200):
    * status (string): "Success"
    * message (string): "Profile picture berhasil ditambahkan"
    * fileName (string): Name of the uploaded file.
    * url (string): Public URL of the uploaded file.
    * file (file): JSON file containing additional information.
## POST /upload-profile-picture

Upload a profile picture image file.

#### Request

* Method: POST
* Path: /upload-profile-picture
* Body Parameters:
    * image (file): Image file to be uploaded.
#### Response

* Success (HTTP 200):
    * status (string): "Success"
    * message (string): "Profile picture berhasil ditambahkan"
    * fileName (string): Name of the uploaded file.
    * url (string): Public URL of the uploaded file.
    * file (file): JSON file containing additional information.

## GET /list
* Method: GET
* Path: /list
* Body Parameters: none

#### Response

* Success (HTTP 200):
    * success (boolean): true
    * msg (string): "Berhasil"
* Error (HTTP 500):
    * success (boolean): false
    * log : Error getting list
    * msg (string): "Terjadi kesalahan, tunggu beberapa saat"

 



