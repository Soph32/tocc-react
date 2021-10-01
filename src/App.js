import React, { useState, useEffect } from 'react';

import './App.css';

function App() {
  // keeping these top level as they're used in multiple funcs, if the endpoints ever change they will only need to be changed once here
  const streetCrimesEndpoint = "https://data.police.uk/api/crimes-street/all-crime";  // https://data.police.uk/api/crimes-street/all-crime?lat=[lat]&lng=[long]

  const [walseData, setWalesData] = useState([]);
  const [sussexData, setSussexData] = useState([]);
  const [norfolkData, setNorfolkData] = useState([]);
  const [yorkshireData, setYorkshireData] = useState([]);

  const [data, setData] = useState(null);
  const [dataCopy, setDataCopy] = useState([]);
  const [filter, setFilter] = useState({});

  // assuming here that the default view should show all area data, which can then be filtered on
  useEffect(() => {
    // initial street crime data setup
    const fetchWalesStreetCrimeData = async() => {
      try {
        const response = await fetch(streetCrimesEndpoint + "?lat=52.515249&lng=-3.316378");
        const json = await response.json();
        
        json.forEach(crime => {
          crime["office"] = "Wales";
        });

        setWalesData(json);
        return json;

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

        setSussexData(json);
        return json;

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

        setNorfolkData(json);
        return json;
        
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

        setYorkshireData(json);
        return json;
        
      } catch(error) {
        console.log("Error fetching Yorkshire street crime data: ", error);
      }
    };

    Promise.all([
      fetchWalesStreetCrimeData(),
      fetchSussexStreetCrimeData(),
      fetchNorfolkStreetCrimeData(),
      fetchYorkshireStreetCrimeData()
    ])
    .then(
      data => setDataCopy([...data[0], ...data[1], ...data[2], ...data[3]])
    );

    setData(dataCopy);

  }, [dataCopy]);



  function handleChange(e) {
    setFilter(e);
  }

  // on filter changes
  useEffect(() => {
      if (filter.office) {
        officeChange(filter.office.toLowerCase());
      }
  
      if (filter.date){
        dateChange(filter.date);
      }
  }, [dataCopy, filter]);


  function officeChange(office) {
    switch (office) {
      case "all":
        setData([...walseData, ...norfolkData, ...sussexData, ...yorkshireData]);
        break;
      case "wales":
        setData(walseData);
        break;
      case "sussex":
        setData(sussexData);
        break;
      case "norfolk":
        setData(norfolkData);
        break;
      case "yorkshire":
        setData(yorkshireData);
        break;
      default: 
      setData([...walseData, ...norfolkData, ...sussexData, ...yorkshireData]);
        break;
    }
  }

  function dateChange(date) {
    let filtered = dataCopy.filter(row => row.month === date);
    setData(filtered);
  }

  return (
    <div className="App">
      <Filters handleChange={handleChange}></Filters>
      <StreetCrimeTable streetCrimeData={data}></StreetCrimeTable>
    </div>
  );
}

function Filters({handleChange}) {
  const [date, setDate] = useState("");

  let filters  = {};

  function handleOfficeChange(event) {
    filters["office"] = event.target.value;
    handleFilterChange();
    // handleChange({office: event.target.value});
  }

  function handleDateChange(event) {
    // handleChange({date: event.target.value});
    filters["date"] = event.target.value;
    setDate(event.target.value);
    handleFilterChange();
  }

  function handleFilterChange() {
    handleChange(filters);
  }

  return (
    <div>
      <label>
        Office:
        <select onChange={handleOfficeChange}>
          <option value="all">All</option>
          <option value="wales">Wales</option>
          <option value="sussex">Sussex</option>
          <option value="norfolk">Norfolk</option>
          <option value="yorkshire">Yorkshire</option>
        </select>
      </label>

      <label>
        Date:
        <input type="month" value={date} onChange={handleDateChange}></input>
      </label>
    </div>
  )
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
        <TableRow data={streetCrimeData}></TableRow>
      </table>
    )
  } else {
    return (
      <div>No table data found</div>
    )
  }
}

function TableRow({data}) {
  return (
    <tbody>
      {data.map(item => (
          <tr key={item.id}>
            <td>{item.office}</td>
            <td>{item.category}</td>
            <td>{item.location.street.name}</td>
            <td>{item.outcome_status ? item.outcome_status.category : "N/A"}</td>
            <td>{item.month}</td>
          </tr>
        ))}
    </tbody>
  )
}


export default App;
