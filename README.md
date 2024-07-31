
<div align="center">
<a href="https://hanapbh.vercel.app/" align="center">

<svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="128" height="128" rx="64" fill="black"/>
<g clip-path="url(#clip0_6_9)">
<path d="M19.032 54.1738C19.032 53.3884 19.5285 52.6887 20.2699 52.4294L106.488 22.2698C107.916 21.7704 109.306 23.1038 108.867 24.551L107.058 30.5095C106.885 31.0792 106.454 31.5285 105.891 31.72C78.4194 41.053 41.4161 53.1503 37.9425 54.8871C34.8459 56.4354 27.725 58.4358 21.4815 60.4527C20.2767 60.8419 19.032 59.9486 19.032 58.6823L19.032 54.1738Z" fill="white"/>
<path d="M27.501 61.0402C27.501 59.7592 26.2291 58.8666 25.0244 59.3023L23.1581 59.9774L45.1499 52.308L39.2158 54.1339C38.4555 54.3679 37.9301 55.0622 37.9118 55.8576L36.7829 104.835C36.7597 105.839 35.9394 106.641 34.9353 106.641H29.349C28.3284 106.641 27.501 105.813 27.501 104.793V61.0402Z" fill="white"/>
<path d="M37.1193 96.8135C37.3397 97.2843 37.8126 97.5852 38.3326 97.5852H106.413C107.433 97.5852 108.261 98.4126 108.261 99.4333V104.793C108.261 105.813 107.433 106.641 106.413 106.641H34.7911C33.6099 106.641 32.7319 105.548 32.9865 104.394L34.5979 97.0927C34.8736 95.8432 36.5768 95.6545 37.1193 96.8135Z" fill="white"/>
<path d="M45.7967 83.7248C45.7967 82.7042 46.6241 81.8768 47.6447 81.8768H101.608C102.628 81.8768 103.456 82.7042 103.456 83.7248V87.6058C103.456 88.6264 102.628 89.4538 101.608 89.4538H47.6447C46.6241 89.4538 45.7967 88.6264 45.7967 87.6058V83.7248Z" fill="white"/>
</g>
<defs>
<clipPath id="clip0_6_9">
<rect width="90" height="84.6407" fill="white" transform="translate(19 22)"/>
</clipPath>
</defs>
</svg>

<a/>
</div>

<div style="text-align: center">

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

```.env.local
GOOGLE_CLIENT_ID = 
GOOGLE_CLIENT_SECRET = 
GOOGLE_PLACES_API_KEY = 


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
docker pull wing09/hanapbh-client:v1.0.29
```

### Server Image

```bash
docker pull wing09/hanapbh-server:v1.0.29
```