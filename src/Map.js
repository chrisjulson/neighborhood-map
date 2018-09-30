import React, { Component } from 'react';
import L from 'leaflet';
import PropTypes from 'prop-types';

// leaflet.js is not required for app to work but leaflet.css is still required


class Map extends Component {

   markerRefs = [];

   highlightSelectedMarker() {
      if(this.props.markers) {
         this.props.markers.forEach(( marker, idx ) => {
            if(marker.mapref) {
               if(this.props.selectedMarker === idx) {
                  L.DomUtil.addClass(marker.mapref._icon, 'blinking');
                  marker.mapref.setZIndexOffset(1000);
                  marker.mapref.openPopup();
               } else {
                  marker.mapref.setZIndexOffset(1);
                  L.DomUtil.removeClass(marker.mapref._icon, 'blinking');
               }
            }
         });
      }
   }


   markerOnClick(idx) {
      this.props.markerOnClick(idx);
   }

   removeMarkersFromMap() {
      this.markerRefs.foreach((markerRef, inx) => {
         if(markerRef) {
            markerRef.remove();
         }
      });
      this.markerRefs = [];
   }

   loadMarkersToMap(markers) {
    this.props.markers.forEach((marker, idx) => {
         /* !!DO NOT USE setState here!! this is only a completion of mapref and is not considered a state change */
         if (!marker.mapref) {
            marker.mapref = L.marker(marker.position)
            .bindPopup(marker.description)
            .on('click', (e) => {
               //click and scroll the list of locations
               this.markerOnClick(idx);
               // returns focus to the map marker
               e.originalEvent.target.focus();
            })
            .on('keypress', (e) => {
               if(e.originalEvent.key === 'Enter')
               // select and scroll the list of locations 
               this.markerOnClick(idx);
               e.originalEvent.target.focus();
            })
            .addTo(this.map);
         }
         this.markerRefs.push(marker.mapref);
      });
   }

   componentDidMount() {
      this.map = L.map(this.props.mapid).setView([43.041070, -81.909420], 14);

      const theMapUrl ='https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic2lsM250NWFtIiwiYSI6ImNqbGVyZm85ZTA1cDMzcXAxcWt6d2Y1bXUifQ.EZHvZaGIYJelxbla1E_STA';

      L.tileLayer(theMapUrl, {
         attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
         maxZoom: 18,
         id: 'mapbox.streets',
         accessToken: 'your.mapbox.access.token'
      }).addTo(this.map);

      this.loadMarkersToMap(this.props.markers);
   }

   /*
   Runs when parent's state changes are copied to map which happens when 
   new markers are added or a marker selection 
   */

   componentDidUpdate = (prevProps, prevState) => {
      if(this.props.reloadMarkers) {
         this.removeMarkersFromMap();
         this.loadMarkersToMap();
         this.props.setReloadMarkers(0);
      }
      this.highlightSelectedMarker();
   }

   render() {
      return (
         <div
            className='leaflet-map'
            role='application'
            aria-label='Map with locations'
            id={this.props.mapid}>
         </div>
      )
   }
}

Map.propTypes = {
    markers: PropTypes.array.isRequired,
    reloadMarkers: PropTypes.number.isRequired,
    setReloadMarkers: PropTypes.func.isRequired,
    selectedMarker: PropTypes.number.isRequired,
    markerOnClick: PropTypes.func.isRequired
};

export default Map;