import React, { Component } from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

class ShowMap extends Component {

  // show marker animation & display infoWindow
  activateMarker = (props, marker, e) =>{
    // console.log('activated')
      if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
        
      } else {
        marker.setAnimation(this.props.google.maps.Animation.BOUNCE);
      }



      this.props.showInfoWindow(props, marker, e)
  }



  render() {
    const {google, markers, showInfoWindow,
      onMapClicked, currentMarker, selectedPlace, infoWindowOpen,
      markerClickedFromList, isListClicked, markerIndex, newMarkers} = this.props;

    // get the markers on the page based on the user clicked on sidebar or map
    var newActiveMarkers = isListClicked ? newMarkers : markers
    
    
    return (
      <div className="map-container">
        <Map  google={google} 
              initialCenter={{
                  lat: 21.278701,
                  lng: -157.827652
                }}
              zoom={17}
              onClick={(props)=> onMapClicked(props)}
          >
          {  // get all the active markers on the page
            newActiveMarkers.map((mapLocation, index) => (
              <Marker key={index}
               id={mapLocation.id}
               name={mapLocation.name}
               address={mapLocation.location.formattedAddress[0]}
               position={mapLocation.location.labeledLatLngs[0]}

               onClick={(props, mapLocation, e) => this.activateMarker(props, mapLocation, e)}
               onMouseover={(props, mapLocation, e) => showInfoWindow(props, mapLocation)}
               onMouseleave={() => {
                 alert('hello');
               }}
               
               animation = {isListClicked?null:this.props.google.maps.Animation.DROP}
              />
            ))
          }

          
          { // show the marker of the venue clicked from the List View
           (markerClickedFromList !== {}&&isListClicked===true)&&(
              <Marker key={markerIndex}
               id={markerClickedFromList.id}
               name={markerClickedFromList.name}
               address={markerClickedFromList.location.formattedAddress[0]||[]}
               position={markerClickedFromList.location.labeledLatLngs[0]||{}}
               animation = {this.props.google.maps.Animation.BOUNCE}
              />
            )
          }
          
          <InfoWindow
            marker={currentMarker}
            visible={infoWindowOpen}>
              <div className="infoWindow-container">
                <p className="info-title" >{selectedPlace.name}</p>
                <p>{selectedPlace.address}</p>
              </div>
         </InfoWindow>
        </Map>
      </div>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: ("AIzaSyBKB1JNeGT7tiLlNKdvSfnoXndV1UT8QIw")
})(ShowMap);
