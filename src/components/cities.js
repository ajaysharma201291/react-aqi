import React from 'react';
import moment from 'moment';
import City from './city';
 
const Cities = (props) => {
 
    //using this to categorize data to respective class...
    const getCategorisedData = aqi => {
        let className = 'unknown';
        let impact = 'unknown';
 
        if (aqi === '') {
            impact = 'Unknown(No Results Found)';
            className = 'Unknown';
        } else if (aqi >= 0 && aqi <= 50) {
            impact = 'Good';
            className = 'good';
        } else if (aqi > 50 && aqi <= 100) {
            impact = 'Moderate';
            className = 'moderate';
        } else if (aqi > 100 && aqi <= 150) {
            impact = 'Unhealthy for Sensitive Groups';
            className = 'unhealthy-sentitive';
        } else if (aqi > 150 && aqi <= 200) {
            impact = 'Unhealthy';
            className = 'unhealthy';
        } else if (aqi > 200 && aqi <= 300) {
            impact = 'Very Unhealthy';
            className = 'very-unhealthy';
        } else if (aqi > 300) {
            impact = 'Hazardous';
            className = 'hazardous';
        }
 
        let catagorized = {};
        catagorized['impact'] = impact;
        catagorized['className'] = className;
 
        return catagorized;
    };
 
    return (<React.Fragment>
        <div style={{ fontSize: '2em' }}>Click on any city to get that city latest 10 Record(s) on chart</div>
        <table>
            <thead>
                <tr>
                    <th className="city">City</th>
                    <th className="aqi_index aqiImpact">Current AQI (Status)</th>
                    <th>Last Updated</th>
                </tr>
            </thead>
            <tbody>
                {props.citiesAqi.map((cityAqi, index) => (
                    <tr key={index} className={getCategorisedData(cityAqi.aqi).className} onClick={() => props.showCityData(cityAqi.city)}>
                        <td className="city">{cityAqi.city}</td>
                        <td className="aqi_index aqiImpact">{cityAqi.aqi.toFixed(2)} ({(getCategorisedData(cityAqi.aqi).impact)})</td>
                        <td>{moment(cityAqi.updated).fromNow()}</td>
                    </tr>
                ))}
            </tbody>
            <tfoot>
                <tr>
                    <td colSpan={3} className={"aqi_index aqiImpact "}>Colors Indicator Below</td>
                </tr>
                <tr>
                    <td colSpan={3} className={"aqi_index aqiImpact " + getCategorisedData(50).className}>AQI between 0 to 50 : Good</td>
                </tr>
                <tr>
                    <td colSpan={3} className={"aqi_index aqiImpact " + getCategorisedData(100).className}>AQI between 50+ to 100 : Moderate</td>
                </tr>
                <tr>
                    <td colSpan={3} className={"aqi_index aqiImpact " + getCategorisedData(150).className}>AQI between 100+ to 150 : Unhealthy for Sensitive Groups</td>
                </tr>
                <tr>
                    <td colSpan={3} className={"aqi_index aqiImpact " + getCategorisedData(200).className}>AQI between 150+ to 200 : Unhealthy</td>
                </tr>
                <tr>
                    <td colSpan={3} className={"aqi_index aqiImpact " + getCategorisedData(300).className}>AQI between 200+ to 300 : Very Unhealthy</td>
                </tr>
                <tr>
                    <td colSpan={3} className={"aqi_index aqiImpact " + getCategorisedData(350).className}>AQI greater than 300 : Hazardous</td>
                </tr>
                <tr>
                    <td colSpan={3} className={"aqi_index aqiImpact " + getCategorisedData('').className}>AQI data not available : Unknown</td>
                </tr>
            </tfoot>
        </table>
        {props.selectedCity ? <City selectedCityData={props.selectedCityData} clearCityData={props.clearCityData}
            selectedCity={props.selectedCity} /> : null}
    </React.Fragment>)
}
 
export default Cities;
