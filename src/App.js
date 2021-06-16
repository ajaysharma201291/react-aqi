import React, { Component } from 'react';
import * as _ from 'lodash';
import Cities from './components/cities';
import './App.css';
 
class App extends Component {
 
  constructor(props) {
    super(props);
    this.state = {
      ws: null,
      citiesAqi: [],
      selectedCity: null,
      historicalCitiesAqi: [],
      selectedCityData: null
    };
  }
 
  // single websocket instance for the own application and constantly trying to reconnect.
  componentDidMount = () => {
    this.connect();
  }
 
  /**
     * @function connect
     * This function establishes the connect with the websocket and also ensures constant reconnection if connection closes
     */
  connect = () => {
    let ws = new WebSocket("ws://city-ws.herokuapp.com/");
    let that = this;// cache the this
    let connectInterval;
 
    // websocket onopen event listener
    ws.onopen = () => {
      // console.log("connected websocket in app component");
      this.setState({ ws: ws });
      that.timeout = 250; // reset timer to 250 on open of websocket connection 
      clearTimeout(connectInterval); // clear Interval on on open of websocket connection
    }
 
    // websocket onmessage event listener
    ws.onmessage = (evt) => {
      // listen to data sent from the websocket server
      const data = JSON.parse(evt.data);
      // console.log(data);
      this.handleDataChange(data);
    }
 
    // websocket onclose event listener
    ws.onclose = (evt) => {
      // console.log(`Socket is closed. Reconnect will be attempted in ${Math.min(10000 / 1000, (that.timeout + that.timeout) / 1000)} second.`, evt.reason);
      that.timeout = that.timeout + that.timeout;//increment retry interval
      connectInterval = setTimeout(this.check, Math.min(10000, that.timeout)); //call check function after timeout
    }
 
    // websocket onerror event listener
    ws.onerror = (err) => {
      console.error("Socket encountered error: ", err.message, "Closing socket");
      ws.close();
    }
  }
 
  /**
   * utilited by the @function connect to check if the connection is close, if so attempts to reconnect
   */
  check = () => {
    const { ws } = this.state;
    //check if websocket instance is closed, if so call `connect` function.
    if (!ws || ws.readyState == WebSocket.CLOSED) {
      this.connect();
    }
  }
 
  handleDataChange = (data) => {
    const { citiesAqi, historicalCitiesAqi } = this.state;
    data.forEach(({ city, aqi }) => {
      // console.log(`The AQI of ${city} is ${aqi}`);
      const currentIndex = _.findIndex(citiesAqi, { city: city });
      // console.log("currentIndex : " + currentIndex);
      if (currentIndex > -1) {
        citiesAqi[currentIndex].updated = new Date();
      } else {
        citiesAqi.push({ city: city, aqi: aqi, updated: new Date() });
      }
      const historicalCurrentIndex = _.findIndex(historicalCitiesAqi, city);
      // console.log("historicalCurrentIndex : " + historicalCurrentIndex);
      if (historicalCurrentIndex > -1) {
        // console.log(historicalCitiesAqi[historicalCurrentIndex][city]);
        if (historicalCitiesAqi[historicalCurrentIndex][city].length > 9) {
          historicalCitiesAqi[historicalCurrentIndex][city].pop();
        }
        historicalCitiesAqi[historicalCurrentIndex][city].unshift({ aqi: aqi, updated: new Date() });
      } else {
        historicalCitiesAqi.push({ [city]: [{ aqi: aqi, updated: new Date() }] });
      }
    });
 
    this.setState({
      citiesAqi: citiesAqi,
      historicalCitiesAqi: historicalCitiesAqi
    })
  }
 
  showCityData = (city) => {
    const { historicalCitiesAqi } = this.state;
    const historicalCurrentIndex = _.findIndex(historicalCitiesAqi, city);
    if (historicalCurrentIndex > -1) {
      // console.log(historicalCitiesAqi[historicalCurrentIndex][city]);
      this.setState({
        selectedCity: city,
        selectedCityData: historicalCitiesAqi[historicalCurrentIndex][city]
      })
    }
  }
 
  clearCityData = () => {
    this.setState({
      selectedCity: null,
      selectedCityData: null
    })
  }
 
  render() {
    const { citiesAqi, selectedCity, selectedCityData } = this.state;
 
    return (<div className="App" id="content">
      <h1>Air Quality Monitoring</h1>
      {citiesAqi.length > 0 ? <Cities citiesAqi={citiesAqi} selectedCity={selectedCity} selectedCityData={selectedCityData}
        showCityData={this.showCityData} clearCityData={this.clearCityData} />
        : (<div className="header">
          <h1> No Result Found</h1>
        </div>)}
    </div>);
  }
}
 
export default App;