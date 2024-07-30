<p align="center">
<a href="https://github.com/Wilfreno/Hanap-BH/blob/main/public/logo/hanap-bh-light.png" target="_blank">
<img src="https://github.com/Wilfreno/Hanap-BH/blob/main/public/logo/hanap-bh-light.png" alt="Hanap-BH" style="height:7vw;" /><a/>
<p/>

<p align="center">
<a href="https://hanap-bh.vercel.app/"><img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=40&duration=1000&pause=1000&color=222222&center=true&vCenter=true&repeat=false&random=false&width=435&lines=%F0%9D%99%83%F0%9D%99%96%F0%9D%99%A3%F0%9D%99%96%F0%9D%99%A5-%F0%9D%98%BD%F0%9D%99%83" alt="Hanap-BH" /></a>
<p/>

<p align="center" >A complete Full-Stack Web Application that help filipinos locate the nearest lodgings on their vicinity </p>

# The Motivation

<p>In the Philippines it is common for students to enroll to a School / University / College far away from home to get a better quality of education. As a result, it is a struggle for students to find a decent home for them to rest. With <b>Hanap-BH</b> finding the right lodging for them is a breeze.<p/>

# Website

<https://hanapbh.vercel.app/>

# Features

- Utilizes the [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript) to Have an interactive map to locate the nearest lodging / boarding houses
- Utilizes the [Google Places API](https://developers.google.com/maps/documentation/places/web-service/overview) to provide reliable data
- Users can log-in to add or claim a new or existing lodging / boarding house
- Has a simple responsive UI for better user experience

# Tools, Libraries & Framework used

- [Next.js](https://nextjs.org/)
- [React.js](https://react.dev/)
- [React-Redux](https://react-redux.js.org/)
- [Mongoose.js](https://mongoosejs.com/)
- [React-google-maps](https://github.com/visgl/react-google-maps)
- [Tailwind-css](https://tailwindcss.com/)

# Contributions

Before contributing you should be aware that the project is using services from [Google Maps Platform](https://developers.google.com/maps) and you may need payment credentials to create API key and access services. But don't worry, you're not going to pay anything; Google has a free 200$ service every month.

## Clone the repo

```bash
git clone https://github.com/Wilfreno/Hanap-BH.git
```

## Install Dependencies

```bash
npm install
```

## Set Environment Variable

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY =
NEXT_PUBLIC_GOOGLE_PLACE_API_KEY =

MONGODB_PASS =
MONGODB_USER =
MONGODB_HOSTNAME =
MONGODB_URI = mongodb+srv://$MONGODB_USER:$MONGODB_PASS@$MONGODB_HOSTNAME/Hanap-BH?retryWrites=true&w=majority

GOOGLE_CLIENT_ID =
GOOGLE_CLIENT_SECRET =

NEXTAUTH_URL = http://127.0.0.1:3000
NEXTAUTH_SECRET =

GMAIL_APP_2FAUTH_PASS =

REACT_EDITOR = code

```

### For:

#### [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript) & [Google Places API](https://developers.google.com/maps/documentation/places/web-service/overview)

- NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
- NEXT_PUBLIC_GOOGLE_PLACE_API_KEY

first [Set up your Google Cloud project](https://developers.google.com/maps/documentation/places/web-service/cloud-setup#console),
then Create your [Googpe Maps Credentials](https://console.cloud.google.com/apis/credentials?authuser=1&project=hanap-bh)

## Docker Images

- **Client:** Client: 
- **Server:** Server: 