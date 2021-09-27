import React, { useState, useEffect } from 'react';

import './App.css';

function App() {
  // keeping these top level as they're used in multiple funcs, if the endpoints ever change they will only need to be changed once here
  const streetCrimesEndpoint = "https://data.police.uk/api/crimes-street/all-crime";  // https://data.police.uk/api/crimes-street/all-crime?lat=[lat]&lng=[long]

  const [walesCrime, setWalesCrime] = useState(null);
  const [sussexCrime, setSussexCrime] = useState(null);
  const [norfolkCrime, setNorfolkCrime] = useState(null);
  const [yorkshireCrime, setYorkshireCrime] = useState(null);

  // assuming here that the default view should show all area data, which can then be filtered on
  // TODO: ideally this would be paginated to reduce initial loading time
  // TODO: refactor with custom fetch hook to reduce repetitive code
  useEffect(() => {
    const fetchWalesStreetCrimeData = async() => {
      try {
        const response = await fetch(streetCrimesEndpoint + "?lat=52.515249&lng=-3.316378");
        const json = await response.json();
        setWalesCrime(json);
      } catch(error) {
        console.log("Error fetching Wales street crime data: ", error);
      }
    };

    const fetchSussexStreetCrimeData = async() => {
      try {
        const response = await fetch(streetCrimesEndpoint + "?lat=50.827741&lng=-0.138776");
        const json = await response.json();
        setSussexCrime(json);
      } catch(error) {
        console.log("Error fetching Sussex street crime data: ", error);
      }
    };

    const fetchNorfolkStreetCrimeData = async() => {
      try {
        const response = await fetch(streetCrimesEndpoint + "?lat=52.906099&lng=1.088307");
        const json = await response.json();
        setNorfolkCrime(json);
      } catch(error) {
        console.log("Error fetching Norfolk street crime data: ", error);
      }
    };

    const fetchYorkshireStreetCrimeData = async() => {
      try {
        const response = await fetch(streetCrimesEndpoint + "?lat=54.486599&lng=-0.615556");
        const json = await response.json();
        setYorkshireCrime(json);
      } catch(error) {
        console.log("Error fetching Yorkshire street crime data: ", error);
      }
    };

    fetchWalesStreetCrimeData();
    fetchSussexStreetCrimeData();
    fetchNorfolkStreetCrimeData();
    fetchYorkshireStreetCrimeData();
  }, []);

  console.log(walesCrime);
  console.log(sussexCrime);
  console.log(norfolkCrime);
  console.log(yorkshireCrime);
  

  return (
    <div className="App">
      <StreetCrimeData></StreetCrimeData>
    </div>
  );
}

function StreetCrimeData() {

}


export default App;
