import React, { useState, useEffect } from 'react';

import './App.css';

function App() {
  // keeping these top level as they're used in multiple funcs, if the endpoints ever change they will only need to be changed once here
  const streetCrimesEndpoint = "https://data.police.uk/api/crimes-street/all-crime";  // https://data.police.uk/api/crimes-street/all-crime?lat=[lat]&lng=[long]

  const [walesCrime, setWalesCrime] = useState(null);
  const [sussexCrime, setSussexCrime] = useState(null);
  const [norfolkCrime, setNorfolkCrime] = useState(null);
  const [yorkshireCrime, setYorkshireCrime] = useState(null);

  let allCrime = [];

  // assuming here that the default view should show all area data, which can then be filtered on
  // TODO: ideally this would be paginated to reduce initial loading time
  // TODO: refactor with custom fetch hook to reduce repetitive code
  // TODO: is there a way of pulling only the fields we need from the json so less data is stored here?
  useEffect(() => {
    const fetchWalesStreetCrimeData = async() => {
      try {
        const response = await fetch(streetCrimesEndpoint + "?lat=52.515249&lng=-3.316378");
        const json = await response.json();
        
        json.forEach(crime => {
          crime["office"] = "Wales";
        });

        setWalesCrime(json);

      } catch(error) {
        console.log("Error fetching Wales street crime data: ", error);
      }
    };

    const fetchSussexStreetCrimeData = async() => {
      try {
        const response = await fetch(streetCrimesEndpoint + "?lat=50.827741&lng=-0.138776");
        const json = await response.json();
        
        json.forEach(crime => {
          crime["office"] = "Sussex";
        });

        setSussexCrime(json);

      } catch(error) {
        console.log("Error fetching Sussex street crime data: ", error);
      }
    };

    const fetchNorfolkStreetCrimeData = async() => {
      try {
        const response = await fetch(streetCrimesEndpoint + "?lat=52.906099&lng=1.088307");
        const json = await response.json();

        json.forEach(crime => {
          crime["office"] = "Norfolk";
        });

        setNorfolkCrime(json);
        
      } catch(error) {
        console.log("Error fetching Norfolk street crime data: ", error);
      }
    };

    const fetchYorkshireStreetCrimeData = async() => {
      try {
        const response = await fetch(streetCrimesEndpoint + "?lat=54.486599&lng=-0.615556");
        const json = await response.json();

        json.forEach(crime => {
          crime["office"] = "Yorkshire";
        });

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

  if (walesCrime && sussexCrime && norfolkCrime && yorkshireCrime) {
    allCrime = [...walesCrime, ...sussexCrime, ...norfolkCrime, ...yorkshireCrime];
  }

  return (
    <div className="App">
      <StreetCrimeTable streetCrimeData={allCrime}></StreetCrimeTable>
    </div>
  );
}


function StreetCrimeTable({streetCrimeData}) {
  if (streetCrimeData) {
    return (
      <table>
        <thead>
          <tr>
            <th>Office</th>
            <th>Category</th>
            <th>Location</th>
            <th>Outcome</th>
            <th>Month</th>
          </tr>
        </thead>
        <tbody>
          {streetCrimeData.map(item => (
            <tr key={item.id}>
              <td>{item.office}</td>
              <td>{item.category}</td>
              <td>{item.location.street.name}</td>
              <td>{item.outcomeStatus}</td>
              <td>{item.month}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  } else {
    return (
      <div>No table data found</div>
    )
  }
}


export default App;
