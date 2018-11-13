import React, { Component } from 'react';
import ListView from './ListView';
import ShowMap from './ShowMap';
import escapeRegExp from 'escape-string-regexp';


// Foursquare API authentication
var foursquare = require('react-foursquare')({
  clientID: 'CEEUXJNP2ZJ33ITK2VO0SDF5TGW3DFK5VC5U1EJHFFP15CUM',
  clientSecret: 'NFAD2QOVVJ0BPITYSHYMEFCM0MWGAZ0DB5PNUO4OACUVC2B3'
});


// Initial location details
var params = {
  "near": "Waikiki,HI",
  "query": "food",
  "radius": 1000,
  "limit": 10,
  "v": 20181111
};
// Default marker positions
var defaultMarkers = [
  {id: 1, name: 'Food Galaxy Restaurant & Coffee Shop', location: {labeledLatLngs: [{
    lat: 21.278930138770743, lng: -157.8258705887782}], formattedAddress: ["2310 Kuhio Ave (btwn Nohonani St. & Nahua St.)"]}, animation: null },
  {id: 2, name: 'Hong Kong Fast Food', location: {labeledLatLngs: [{
    lat: 21.278702, lng: -157.827653}], formattedAddress: ["2301 Kuhio Ave"]}, animation: null},
  {id: 3, name: 'Food Pantry', location: {labeledLatLngs: [{
    lat: 21.278865, lng: -157.828685}], formattedAddress: ["2259 Kalakaua Ave"]}, animation: null},
  {id: 4, name: 'Arby\'s', location: {labeledLatLngs: [{
    lat: 21.279112176185322, lng: -157.8284204500371}], formattedAddress: ["2250 Kalakaua Ave"]}, animation: null},
  {id: 5, name: 'Princess Food Court', location: {labeledLatLngs: [{
    lat: 21.27944142606819, lng: -157.82939847985838}], formattedAddress: ["120 Kaiulani Ave"]}, animation: null}
];

class App extends Component {
  state = {
    activeMarkers: defaultMarkers,
    query : '',
    allNearbyLocations: [],
    currentMarker: {},
    selectedPlace: {},
    infoWindowOpen: false,
    markerClickedFromList: {},
    isListClicked: false,
    markerindex: 0,
    newActiveMarkers: []
  };

  // after component mounts, fetch data from Foursquare API
  componentDidMount() {
    foursquare.venues.getVenues(params)
      .then(res=> {
        this.setState({ allNearbyLocations: res.response.venues });
      })
      .catch(error => console.error('Error: ' + error));
  }

  // if a location isn't defined, leave the field blank
  setFormattedAddress(newLocations){
    newLocations.map((location)=> (
      (location===undefined) && (location.formattedAddress[0]= " ")
    ))
    return newLocations
  }
/**************** Querying *****************************************/

  // Filter selection based on user queries
  updateMarkers(query){
    var defaultMarkersFiltered = defaultMarkers
    this.state.allNearbyLocations.map((location)=>(
      defaultMarkersFiltered = defaultMarkersFiltered.filter((defaultLocation)=>
        (location.name!==defaultLocation.name)
      ))
    )

    //get all the locations removing common location from default marker
    var newLocations = defaultMarkersFiltered.concat(this.state.allNearbyLocations)
    newLocations=this.setFormattedAddress(newLocations)

    if(query!=='') {
      this.findMarkers(query, newLocations)
    }
    else{
      this.setState({activeMarkers: newLocations})
    }
  }

  // when user types a query, update the marker according to the query   
  getQuery = (query)=> {
    this.setState({query})
    this.updateMarkers(query);
  }

/**************** Markers ******************************************/

  // Make filtered locations active markers
  findMarkers = (query, newLocations)=>{
    const match = new RegExp(escapeRegExp(query), 'i')
    var showLocations = newLocations.filter((location) => match.test(location.name))
    this.setState({activeMarkers:showLocations})
  }

  /**************** Info Window ************************************/

  // display infoWindow when marker is clicked
  showInfoWindow = (props, marker) =>{
    this.setState({
      selectedPlace: props,
      currentMarker: marker,
      infoWindowOpen: true
    });
  }

  // hide infoWindow
  // hideInfoWindow = () =>
  //     this.setState({
  //       infoWindowOpen: false,
  //       currentMarker: null
  //   });

    hideInfoWindow = (props) =>{
      if (this.state.infoWindowOpen) { 
          this.setState({ infoWindowOpen: false, currentMarker: null })
        }};

  // Show InfoWindow from the list 
  showInfoWindowFromList = (marker, index) =>{
    this.setState({
      markerClickedFromList: marker,
      isListClicked: true,
      markerindex: index,
      newActiveMarkers: this.state.activeMarkers.filter((thisMarker)=>(
        thisMarker.id !== marker.id      
      ))
    })
  }

/*****************************************************************************/

  render() {
    return (
      <div className="App">
        <ListView 
          markers={this.state.activeMarkers} 
          query={this.state.query}
          getQuery={this.getQuery} 
          showInfoWindowFromList={this.showInfoWindowFromList} />

        <ShowMap 
          markers={this.state.activeMarkers} 
          currentMarker={this.state.currentMarker}
          markerIndex={this.state.markerindex}
          markerClickedFromList={this.state.markerClickedFromList}
          onMouseoverMarker={this.onMouseoverMarker}
          newMarkers={this.state.newActiveMarkers}

          showInfoWindow={this.showInfoWindow}           
          hideInfoWindow={this.hideInfoWindow} 
          infoWindowOpen={this.state.infoWindowOpen}          

          onMapClick={this.hideInfoWindow}          
          isListClicked={this.state.isListClicked} 

          selectedPlace={this.state.selectedPlace}
        />
      </div>
    );
  }
}

export default App;
