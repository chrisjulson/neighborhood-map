# Neighborhood Map project

For the final project in the FEND nanodegree program we were tasked with creating a single page application that featured a map of a neighborhood we would like to visit or of our own neighborhoods. The map is to include interesting locations and provide information about said location from a third party API like Foursquare. 

## Launching the Application

### Clone instructions

1. Clone the repository
2. Navigate to its location
3. Open a terminal window and type `npm install`
4. Once that has finished type `npm start` this should open the app in your browser
5. If the app has not opened in your browser navigate to `localhost:3000`

### Build instructions

1. Clone the repository
2. Navigate to its location
3. Open a terminal window and type `npm install`
4. Once that has finished type `npm run build`
5. Once that has finished type `npm install -g serve`
6. Once that has finished type `serve -s build`
7. For best results with the test server open an incognito/private tab/window and navigate to `http://localhost:5000`

## Application design

### Create React App

I used the code and file structure provided by the [create-react-app](https://github.com/facebookincubator/create-react-app) as the starting point for my application.
. You can find more information on how to perform common tasks [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

### Leaflet

I choose to use Leaflet as my mapping system. Leaflet is an open source JavaScript library for mobile-friendly interactive maps. It is well documented so it made it a developer friendly alternative to Google’s own mapping API.
