import React, { Component } from 'react';
import FilterLocation from './FilterLocation';
import ShowMap from './ShowMap';
import escapeRegExp from 'escape-string-regexp';

var foursquare = require('react-foursquare')({
  clientID: 'CEEUXJNP2ZJ33ITK2VO0SDF5TGW3DFK5VC5U1EJHFFP15CUM',
  clientSecret: 'NFAD2QOVVJ0BPITYSHYMEFCM0MWGAZ0DB5PNUO4OACUVC2B3'
});
//initial location details are provided
var params = {
  "near": "Waikiki,HI",
  "query": "food",
  "radius": 1000,
  "limit": 10,
  "v": 20181111
};
//defaultMarkers positions are provided
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
  //venue details are obtained using foursquare api
  componentDidMount() {
    foursquare.venues.getVenues(params)
      .then(res=> {
        this.setState({ allNearbyLocations: res.response.venues });
      })
      .catch(error => {
        console.error('Error retrieving the venues from the foursquare site:', error);
      });
  }




/**************** Querying *************************************************************/

  /**
   * update the markers on the page depending on the user query. filtering of the
   * locations is based on both defult markers and markers provided by foursquare.
   */
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

   /**
   * when user types a query, update the marker according to the query
   */
  getQuery = (query)=> {
    this.setState({query})
    this.updateMarkers(query);
  }

/*****************************************************************************/

  /**
   * set the formattedAddress[0] field of a location to " " if the location is undefined
   */
  setFormattedAddress(newLocations){
    newLocations.map((location)=> (
      (location===undefined) && (location.formattedAddress[0]= " ")
    ))
    return newLocations
  }






/**************** Markers *************************************************************/

 





  
  /**
   * based on the query, filter out the matching markers on the page and store
   * them as active markers.
   */
  findMarkers = (query, newLocations)=>{
    const match = new RegExp(escapeRegExp(query), 'i')
    var showLocations = newLocations.filter((location) => match.test(location.name))
    this.setState({activeMarkers:showLocations})
  }

  /**
   * when marker is clicked, show the infoWindow attaced to it
   */
  onMarkerClick = (props, marker, e) =>{
    this.setState({
      selectedPlace: props,
      currentMarker: marker,
      infoWindowOpen: true
    });
  }
  /**
   * when mouse is over marker, show the infoWindow attaced to it
   */
  onMouseoverMarker = (props, marker, e) =>{
    this.setState({
      selectedPlace: props,
      currentMarker: marker,
      infoWindowOpen: true
    });
  }
  /**
   * when mouse comes out of the marker, hide the infoWindow attaced to it
   */
  onMouseOutMarker = (e) =>
      this.setState({
        infoWindowOpen: false,
        currentMarker: null
    });

 /**
 * onMarkerClickFromList is called when user clicks the sidebar. Store the marker
 * selected as markerClickedFromList and create a new set of markers so that active
 * markers sent to the showMap does not contain the clicked marker
 */
  onMarkerClickFromList = (marker, index) =>{
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









  /**
   * when map is clicked other than marker, then hide any infoWindow being shown
   */
  onMapClicked = () =>{
  if (this.state.infoWindowOpen) {
      this.setState({
        infoWindowOpen: false,
        currentMarker: null
      })
    }
  };








  














  render() {
    return (
      <div className="App">
        <FilterLocation markers={this.state.activeMarkers} query={this.state.query}
        getQuery={this.getQuery} onMarkerClickFromList={this.onMarkerClickFromList}/>

        <ShowMap markers={this.state.activeMarkers} currentMarker={this.state.currentMarker}
        selectedPlace={this.state.selectedPlace} infoWindowOpen={this.state.infoWindowOpen}
        onMarkerClick={this.onMarkerClick} onMouseoverMarker={this.onMouseoverMarker}
        onMouseOutMarker={this.onMouseOutMarker} onMapClicked={this.onMapClicked}
        markerClickedFromList={this.state.markerClickedFromList}
        isListClicked={this.state.isListClicked} markerIndex={this.state.markerindex}
        newMarkers={this.state.newActiveMarkers}/>
      </div>
    );
  }
}

export default App;
