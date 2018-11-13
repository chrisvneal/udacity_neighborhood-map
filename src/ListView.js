import React, { Component } from 'react';
import { debounce } from 'throttle-debounce';

class ListView extends Component {
  state={
    isHamBurgerIconOn: false,
    viewCount: 0
  }
  updateQuery = (query) => {
    debounce(300,
      this.props.getQuery(query))
  }
  /**
   * show the sidebar when user clicks the hamburger icon.
   */
  getHamBurgerIcon=()=> {
    this.setState({
      isHamBurgerIconOn: true,
      viewCount: 1
    })
  }
  /**
   * hide the sidebar when user clicks the hamburger icon.
   */
  getBackHamburgerIcon =()=>{
    this.setState({
      isHamBurgerIconOn: false
    })
  }
  render() {
    const {markers, query, getQuery, showInfoWindowFromList} = this.props
    const {isHamBurgerIconOn, viewCount} = this.state
    return (
      <div className='list_view'>
      {(isHamBurgerIconOn === false) &&
        <div className="hamburger-icon-wrapper">
          <button className='hamburger-icon'
          aria-label='Expand to search places'
          onClick={()=> this.getHamBurgerIcon()}></button>
        </div>
      }
      {/*show the sidebar as default for the first time and then hide*/}
        {(isHamBurgerIconOn === true || viewCount===0) &&
        <div className='filter-location'>
          <div className="search-locations-input-wrapper">
            <input
              className='search-locations--input'
              type="text"
              name="search"
              aria-label="Search"
              placeholder="Search Location"
              aria-required="false"
              value={query}
              onChange={(event)=> this.updateQuery(event.target.value)}
            />
            {(query !== '') && (
              <button className='close-search'
              aria-label='cancel filter to search result'
              onClick={(event)=> getQuery('')}>Close</button>
            )}
            {(isHamBurgerIconOn === true) && (
              <button className='close-menu'
              aria-label='return to hamburger icon'
              onClick={()=> this.getBackHamburgerIcon()}>Close Menu</button>
            )}
        </div>


        {/* List of locations; load from markers on the map */}
        <ol className='locations-list'>
          {markers.map((marker, index) => (
            <li key={index} className='locations-list-item' role='treeitem' tabIndex={0} onClick={() => showInfoWindowFromList(marker, index)}>
              <div className='marker-details'
              // onClick={() => showInfoWindowFromList(marker, index)}
              >
              {marker.name}
              </div>
            </li>
          ))}
        </ol>
    </div>
  }
  </div>
    );
  }
}

export default ListView;
