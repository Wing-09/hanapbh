
<div align="center">
  
[![hanapbh](https://github.com/Wilfreno/hanapbh/blob/main/client/public/hanapbh-logo-120.png)](https://hanapbh.vercel.app/)
</div>

<div align="center">

[![Hanap BH](https://readme-typing-svg.demolab.com?font=Fira+Code&size=40&duration=1000&pause=1000&color=222222&center=true&vCenter=true&repeat=false&width=435&lines=%F0%9D%99%83%F0%9D%99%96%F0%9D%99%A3%F0%9D%99%96%F0%9D%99%A5+%F0%9D%98%BD%F0%9D%99%83)](https://hanapbh.vercel.app/)
</div>

<p align="center" >A complete Full-Stack Web Application that help filipinos locate the nearest lodgings on their vicinity </p>

# The Motivation

<p>In the Philippines it is common for students to enroll to a School / University / College far away from home to get a better quality of education. As a result, it is a struggle for students to find a decent home for them to rest. With <b>Hanap-BH</b> finding the right lodging for them is a breeze.<p/>

# Website 

:globe_with_meridians: <https://hanapbh.vercel.app/>

# Features

- Utilizes the [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript) to have an interactive map to locate the nearest lodgings
- Utilizes the [Google Places API](https://developers.google.com/maps/documentation/places/web-service/overview) to provide reliable data for the lodgings

# Technologies Used

- [Next.js](https://nextjs.org/)
- [React.js](https://react.dev/)
- [React-Redux](https://react-redux.js.org/)
- [React-google-maps](https://github.com/visgl/react-google-maps)
- [Tailwind-css](https://tailwindcss.com/)
- [Mongoose.js](https://mongoosejs.com/)
- [Express.js](https://expressjs.com/)

# Run the App Locally

you can run the app locally by [cloning](#clone-the-repository) or with [docker compose](#run-with-docker-compose)

## Clone the Repository

:warning: **Disclaimer** The application is using [GOOGLE Places API](https://developers.google.com/maps/documentation/places/web-service) and [GOOGLE Maps API](https://developers.google.com/maps/documentation/javascript). Running the application locally by only cloning the repository requires a [GOOGLE CLOUD](https://console.cloud.google.com/welcome/new) account
with [BILLING](https://console.cloud.google.com/billing) enabled. It is recommended to [run the app locally with docker compose](#with-docker-compose)

- Clone the github [repository](https://github.com/Wilfreno/hanapbh)

```bash 
git clone https://github.com/Wilfreno/hanapbh.git
```
- go to the project root directory
```bash
cd ./hanapbh
```
### Configure Client

- go to the client directory
```bash
cd ./client
```
- install dependencies

:warning: The project is using pnpm as a package manager to use pnpm you have tp install it via npm
```bash
npm install pnpm -g
```
```bash 
pnpm install
```

- Give the client environment variables 

create a **.env.local** file inside the client directory and paste the environment variables

**./client/.env.local**

```env
GOOGLE_CLIENT_ID = 
GOOGLE_CLIENT_SECRET = 
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY = 


NEXT_PUBLIC_SERVER = http://127.0.0.1:8000
SERVER_URL = http://127.0.0.1:8000
ClIENT_URL = http://127.0.0.1:3000

NEXTAUTH_SECRET = 
NEXTAUTH_URL = http://127.0.0.1:3000
```

**GOOGLE_CLIENT_ID** and **GOOGLE_CLIENT_SECRET** is required for [auth.js](https://authjs.dev/) to work with GOOGLE OAUTH.
to get them you can read the [auth.js with google provider document](https://authjs.dev/getting-started/providers/google) or follow the steps:

- got to the [credentials page](https://console.cloud.google.com/apis/credentials) on GOOGLE Cloud Console's APIs & Services
- click **Create Credentials** and choose **OAuth Client ID** 

If this is your first time using google OAUTH you might have to create [OAuth Consent Screen](https://console.cloud.google.com/apis/credentials/consent), fill out the required information and select **External**
for User type and continue creating the OAuth Client ID.

- choose **Web Application** for application type
- name your OAuth Client ID
- add to the Authorized JavaScript origins

```
http://localhost:3000
```
```
http://127.0.0.1:3000
```
- add to Authorized redirect URIs

```
http://localhost:3000/api/auth/callback/google
```
```
http://127.0.0.1:3000/api/auth/callback/google
```
- click **create**
- copy the provided **CLIENT ID** and **CLIENT SECRET**

**GOOGLE_PLACES_API_KEY** is required to display nearby lodgings, to create one: 

- got to the [credentials page](https://console.cloud.google.com/apis/credentials) on GOOGLE Cloud Console's APIs & Services
- click **Create Credentials** and choose **API KEY** 
- and copy the provided key

**NEXTAUTH_SECRET** is a string to be used as the has key for JSON Web Token(JWT) to have a random generated string you can run:

```bash 
node
```

```bash 
require("crypto").randomBytes(64).toString("hex")
```

- Start the client project
```bash
pnpm build
pnpm start
```
### Configure Server

- go back to the root directory
```bash 
cd ..
```

- navigate to server directory
```bash
cd ./server
```

- install dependencies 
```bash
pnpm install
```

- give the server environment variables

create a **.env** file inside the server directory and paste the environment variables

```env
GOOGLE_PLACES_API_KEY = 
GOOGLE_GEOCODE_API_KEY = 

MONGODB_URI = 
GMAIL_2F_AUTH_APP_PASS = 
```
**GOOGLE_PLACES_API_KEY** is required to display nearby lodgings, to create one: 

- got to the [credentials page](https://console.cloud.google.com/apis/credentials) on GOOGLE Cloud Console's APIs & Services
- click **Create Credentials** and choose **API KEY** 
- and copy the provided key

**GOOGLE_GEOCODE_API_KEY** is required to verify users location,
If you did not restrict the GOOGLE_PLACES_API_KEY you can reuse it. otherwise:

- got to the [credentials page](https://console.cloud.google.com/apis/credentials) on GOOGLE Cloud Console's APIs & Services
- click **Create Credentials** and choose **API KEY** 
- and copy the provided key

The server uses [mongodb](https://www.mongodb.com/) as the database system and [mongoose.js](https://mongoosejs.com/) as its Object Data Modeling (ODM) 

the **MONGODB_URI** is the mongodb connection string, you can follow the mongodb [Get Your Free MongoDB Atlas Cluster!](https://www.youtube.com/watch?v=VkXvVOb99g0) youtube guide to get your own connection string 

- build and run server
```bash
pnpm build
pnpm start
```

## Run With Docker Compose

This step would require for you to have a docker installed in your machine. the easiest way to install docker is to [ install docker desktop](https://docs.docker.com/desktop/install/windows-install/)

- clone the repository
```bash 
git clone https://github.com/Wilfreno/hanapbh.git
```

Make sure docker engine is running by running Docker Desktop

- navigate to the project root directory and run docker compose

```bash
cd ./hanapbh
docker-compose up

```
:warning: Don't forget to close the running containers

```bash
docker-compose down
```
## Run Docker Image Individually

### CLient Image
```bash
docker pull wing09/hanapbh-client:v1.0.45
```

### Server Image

```bash
docker pull wing09/hanapbh-server:v1.0.45
```
