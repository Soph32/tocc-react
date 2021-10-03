import React, { useState, useEffect } from 'react';

import './App.css';

function App() {
  // keeping these top level as they're used in multiple funcs, if the endpoints ever change they will only need to be changed once here
  const streetCrimesEndpoint = "https://data.police.uk/api/crimes-street/all-crime";  // https://data.police.uk/api/crimes-street/all-crime?lat=[lat]&lng=[long]

  // const [walseData, setWalesData] = useState([]);
  // const [sussexData, setSussexData] = useState([]);
  // const [norfolkData, setNorfolkData] = useState([]);
  // const [yorkshireData, setYorkshireData] = useState([]);

  const [data, setData] = useState(null);
  const [dataCopy, setDataCopy] = useState([]);
  const [filter, setFilter] = useState({office: "all", date: "2021-08"});

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

        // setWalesData(json);
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

        // setSussexData(json);
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

        // setNorfolkData(json);
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

        // setYorkshireData(json);
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
      function(data) {
        setData([...data[0], ...data[1], ...data[2], ...data[3]]);
        setDataCopy([...data[0], ...data[1], ...data[2], ...data[3]]);
      }
    );

  }, []);



  function handleChange(e) {
    setFilter({office: e.office, date: e.date});
  }

  // runs on filter changes
  useEffect(() => {
    let filteredData;

    if (filter.office === "all") {
      filteredData = dataCopy.filter(row => 
        row.month === filter.date 
      );
    } else {
      filteredData = dataCopy.filter(row => 
        row.office.toLowerCase() === filter.office && 
        row.month === filter.date 
      );
    }
    
    setData(filteredData);

  }, [filter]);


  return (
    <div className="App">
      <Filters handleChange={handleChange} filterState={filter}></Filters>
      <StreetCrimeTable streetCrimeData={data}></StreetCrimeTable>
    </div>
  );
}

// street crime data table filters
function Filters({handleChange, filterState}) {
  const [date, setDate] = useState("");

  let filters = filterState;

  function handleOfficeChange(event) {
    filters["office"] = event.target.value;
    handleFilterChange();
  }

  function handleDateChange(event) {
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

// table format for street crime data
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

// data rows for street crime data table
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
