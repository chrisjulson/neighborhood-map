import React, { Component } from 'react';
import './App.css';
import Map from './Map';
import * as FoursquareAPI from './FoursquareAPI';
import escapeRegExp from 'escape-string-regexp';
import QueryBox from './QueryBox';
import PlacesList from './PlacesList';
import DBHelper from './DBHelper';

class App extends Component {

  state = {
            query: "",
            selectedPlace: -1,
            highlightedPlace: -1,
            places: [],
            reloadPlaces: 0
          }


  /*
   * Any set or reset of a flag will cause the map to reload its places on map update 
  */
  requireReloadPlaces = (value) => {
    this.setState({reloadPlaces: value})
  }

  /*
   * Append forsquare data to places kept in state
   */
  loadThirdPartyData(places) {

    // load foursquare data
    places.forEach((place, idx) => {
      // set fsqId for for easier refrence
      const fsqId = place.foursquareId;
      // if key is available and data is missing fetch data
      if(fsqId &&
           (!place.foursquareData ||
             place.foursquareData === "Error" ||
            !(place.foursquareData.meta.code === 200))) {
        // get data from API
        place.foursquareData = 'Loading';
        this.forceUpdate();
        FoursquareAPI.getById(place.foursquareId)
          .then(data => {
            // if data received, make sure it has what is required
            if(data.meta && data.meta.code) {
              // it has, so apply it to the state
              this.setState((prevState) => {
                // update the right property in the previous state, and return it as the new version
                prevState.places =
                  prevState.places.map(place => {
                    // the fsqId will help locate the right spot (place) to update
                    if(place.foursquareId === fsqId)
                      place.foursquareData = data;
                    return place;
                  })
                return {places: prevState.places};
              });
            } else {
              console.log("4sq response code: "+ data.meta.code);
            }
          }).catch(err => {
            place.foursquareData = 'Error';
            this.forceUpdate();
            console.log("4sq error: "+err);
          })
      }
    });
  }

  componentDidMount() {

    DBHelper.fetchPlaces()
      .then(data => this.addPlaces(data.places));
  }

   // Executed when place is focused or hovered 
  highlightPlaceByIdx = (idx) => {
    this.setState({ highlightedPlace: idx });
  }

   // Executed when place is clicked. This marks place to be reloaded.
  selectPlaceByIdx = (idx) => {
    this.setState({ selectedPlace: idx });
  }

   // Executed when map marker or listed place is clicked
  clickItemByIdx = (idx) => {
    this.highlightPlaceByIdx(idx);
    this.selectPlaceByIdx(idx);
    if(idx > -1) {
      const singleItemList = [];
      singleItemList.push(this.state.places[idx]);
      this.loadThirdPartyData(singleItemList);
    }
  }

   // Add single place to a state
  addPlace = (placeData) => {
    this.setState((state) => { return state.places.push(placeData); });
    this.requireReloadPlaces(1);
  }

  // Add places to a state
  addPlaces = (placesList) => {
    // deletes map references from places so they are recreated
    // with newly added places to map
    placesList.forEach(place => {
      if(place.mapref)
        delete(place.mapref);
    });
    // replace old places with new places in state
    this.setState({ places: placesList });
    // unselect place if any
    this.clickItemByIdx(-1);

   //loading runs on click, to save API query limits
    this.requireReloadPlaces(1);
  }

   // Update state when text in query box changes
  filterPlacesByQuery = (query) => {
    this.setState({query});
    if(query) {
      // Select places matching every (partial) word in the query.
      // The queried words are expected to be separated by spaces or commas.
      // the final regexp: (?=.*food)(?=.*cafe)(?=.*art).+
      let q = "(?=.*" + escapeRegExp(query)
          .trim()
          .replace(new RegExp(",","g"), " ")  // ignore commas
          .replace(new RegExp(" +","g"), ")(?=.*")+").+";

      const match = new RegExp(q, "i");
      DBHelper.fetchPlaces()
        .then(data => this.addPlaces(
            data.places.filter(place =>
              match.test(place.description) ||
              (place.keywords && match.test(place.keywords))
          )
        ));
    }
    else {
      // for empty query take all places
      DBHelper.fetchPlaces()
        .then(data => this.addPlaces(data.places));
    }
    // reset focus
    this.highlightPlaceByIdx(-1);
  }

  render() {
    return (
      <div className="App">

        <header className="App-header">
          <h1 className="App-title">Neighborhood Map</h1>
        </header>

        <a href="#places-filter" className="skip-map">
          Skip the map
        </a>

        <main id="maincontent">
          <section id="map-container">
            <Map
              mapid="themap"
              markers={this.state.places}
              reloadMarkers={this.state.reloadPlaces}
              setReloadMarkers={this.requireReloadPlaces}
              selectedMarker={this.state.highlightedPlace}
              markerOnClick={this.clickItemByIdx}
            ></Map>
          </section>
          <section id="places-container">
            <QueryBox
              id="places-filter"
              query={this.state.query}
              updateQuery={this.filterPlacesByQuery}
            ></QueryBox>
            <PlacesList
              places={this.state.places}
              highlightedPlace={this.state.highlightedPlace}
              selectedPlace={this.state.selectedPlace}
              placeOnClick={this.clickItemByIdx}
              placeOnFocus={this.highlightPlaceByIdx}
              selectPlaceByIdx={this.selectPlaceByIdx}
            ></PlacesList>
          </section>
        </main>
      </div>
    );
  }
}

export default App;