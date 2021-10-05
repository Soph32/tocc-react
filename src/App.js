import React, { useState, useEffect } from 'react';

import './App.css';

function App() {
  const currentDate = new Date();
  let latestMonth = currentDate.getFullYear() + "-" + (("0" + (parseInt(currentDate.getMonth())-1)).slice(-2)); // specifially set to two months prior to current month as data isn't availble for current or previous month

  // keeping these top level as they're used in multiple funcs, if the endpoints ever change they will only need to be changed once here
  const streetCrimesEndpoint = "https://data.police.uk/api/crimes-street/all-crime";  // https://data.police.uk/api/crimes-street/all-crime?lat=[lat]&lng=[long]&date=[yyyy-mm](optional)

  const [data, setData] = useState(null);
  const [dataCopy, setDataCopy] = useState([]);
  const [filter, setFilter] = useState({office: "all", category: "all", location: "", outcome: "all", date: latestMonth});


  // runs on initial street crime data setup and when month is changed
  useEffect(() => {
    const fetchWalesStreetCrimeData = async(date) => {
      try {
        let url = streetCrimesEndpoint + "?lat=52.515249&lng=-3.316378&date=" + date;

        const response = await fetch(url);
        const json = await response.json();
        
        json.forEach(crime => {
          crime["office"] = "Wales";
          crime["outcome"] = crime.outcome_status ? crime.outcome_status.category : "N/A";
        });

        return json;

      } catch(error) {
        console.log("Error fetching Wales street crime data: ", error);
      }
    };

    const fetchSussexStreetCrimeData = async(date) => {
      try {
        let url = streetCrimesEndpoint + "?lat=50.827741&lng=-0.138776&date=" + date;

        const response = await fetch(url);
        const json = await response.json();
        
        json.forEach(crime => {
          crime["office"] = "Sussex";
          crime["outcome"] = crime.outcome_status ? crime.outcome_status.category : "N/A";
        });

        return json;

      } catch(error) {
        console.log("Error fetching Sussex street crime data: ", error);
      }
    };

    const fetchNorfolkStreetCrimeData = async(date) => {
      try {
        let url = streetCrimesEndpoint + "?lat=52.906099&lng=1.088307&date=" + date;

        const response = await fetch(url);
        const json = await response.json();

        json.forEach(crime => {
          crime["office"] = "Norfolk";
          crime["outcome"] = crime.outcome_status ? crime.outcome_status.category : "N/A";
        });

        return json;
        
      } catch(error) {
        console.log("Error fetching Norfolk street crime data: ", error);
      }
    };

    const fetchYorkshireStreetCrimeData = async(date) => {
      try {
        let url = streetCrimesEndpoint + "?lat=54.486599&lng=-0.615556&date=" + filter.date;

        const response = await fetch(url);
        const json = await response.json();

        json.forEach(crime => {
          crime["office"] = "Yorkshire";
          crime["outcome"] = crime.outcome_status ? crime.outcome_status.category : "N/A";
        });

        return json;
        
      } catch(error) {
        console.log("Error fetching Yorkshire street crime data: ", error);
      }
    };

    Promise.all([
      fetchWalesStreetCrimeData(filter.date),
      fetchSussexStreetCrimeData(filter.date),
      fetchNorfolkStreetCrimeData(filter.date),
      fetchYorkshireStreetCrimeData(filter.date)
    ])
    .then(
      function(data) {
        setData([...data[0], ...data[1], ...data[2], ...data[3]]);      // filtered data to be passed to table rows
        setDataCopy([...data[0], ...data[1], ...data[2], ...data[3]]);  // full data to be filtered each time

        // setting filters to avoid bug where you try to filter but it thinks you're already viewing that data because this hasn't been updated - allows for date to be chnaged on filtered data
        setFilter({office: filter.office, category: filter.category, location: filter.location, outcome: filter.outcome, date: filter.date}); 
      }
    );

  }, [filter.date]);


  function handleChange(e) {
    setFilter({office: e.office, category: e.category, location: e.location, outcome: e.outcome, date: e.date});
  }

  // runs on filter changes
  useEffect(() => {
    let filteredData;

    filteredData = dataCopy.filter(row => 
      (filter.office !== "all" ? row.office.toLowerCase() === filter.office : row) && 
      (filter.category !== "all" ? row.category === filter.category : row) &&
      (filter.location !== "" ? row.location.street.name.toLowerCase().includes(filter.location) : row) &&
      (filter.outcome !== "all" ? row.outcome === filter.outcome : row) 
    );
    
    setData(filteredData);

  }, [filter]);


  // getting possible values for select filers
  const [categories, setCategories] = useState([]);
  const [outcomes, setOutcomes] = useState([]);

  useEffect(() => {
    if (dataCopy) { 
      getCategoriesAvailable(dataCopy);
      getOutcomesAvailable(dataCopy);
    }
  }, [dataCopy]);
  

  function getCategoriesAvailable(data) {
    let categoriesAvailable = [];

    data.forEach(item => {
      categoriesAvailable.push(item.category);
    });
    categoriesAvailable = [...new Set(categoriesAvailable)];

    setCategories(categoriesAvailable);
  }

  function getOutcomesAvailable(data) {
    let outcomesAvailable = [];
 
    data.forEach(item => {
      if (item.outcome) {
        outcomesAvailable.push(item.outcome);
      } else {
        outcomesAvailable.push("N/A");
      }
    });
    outcomesAvailable = [...new Set(outcomesAvailable)];

    setOutcomes(outcomesAvailable);
  }


  return (
    <div className="app">
      <h1>Street Crime Data</h1>
      <Filters handleChange={handleChange} filterState={filter} categories={categories} outcomes={outcomes}></Filters>
      <StreetCrimeTable streetCrimeData={data}></StreetCrimeTable>
    </div>
  );
}

// street crime data table filters
function Filters({handleChange, filterState, categories, outcomes}) {
  const [date, setDate] = useState("");

  let filters = filterState;

  function handleOfficeChange(event) {
    filters["office"] = event.target.value;
    handleFilterChange();
  }

  function handleDateChange(event) {
    filters["date"] = event.target.value;
    setDate(event.target.value); // refactor this - not neccessary?
    handleFilterChange();
  }

  function handleCategoryChange(event) {
    filters["category"] = event.target.value;
    handleFilterChange();
  }

  function handleLocationSearch(event) {
    filters["location"] = event.target.value;
    handleFilterChange();
  }

  function handleOutcomeChange(event) {
    filters["outcome"] = event.target.value;
    handleFilterChange();
  }

  function handleFilterChange() {
    handleChange(filters);
  }

  return (
    <div className="filters">
      <label className="filter-label">
        Office:
        <select className="filter-option" onChange={handleOfficeChange}>
          <option value="all">All</option>
          <option value="wales">Wales</option>
          <option value="sussex">Sussex</option>
          <option value="norfolk">Norfolk</option>
          <option value="yorkshire">Yorkshire</option>
        </select>
      </label>

      <label className="filter-label">
        Category:
        <select className="filter-option" onChange={handleCategoryChange}>
          <option value="all">All</option>
          {categories.map(item => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </label>

      <label className="filter-label">
        Location:
        <input className="filter-option" type="text" value={filters.location} onChange={handleLocationSearch}></input>
      </label>

      <label className="filter-label">
        Outcome:
        <select className="filter-option" onChange={handleOutcomeChange}>
          <option value="all">All</option>
          {outcomes.map(item => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </label>

      <label className="filter-label">
        Date:
        <input className="filter-option" type="month" value={date} onChange={handleDateChange}></input>
      </label>
    </div>
  )
}

// table format for street crime data
function StreetCrimeTable({streetCrimeData}) {
  const [sortedField, setSortedField] = useState({field: null, ascending: true});

  if (streetCrimeData) {
    let sortedData = [...streetCrimeData];

    if (sortedField.field !== null) {
      sortedData.sort((a, b) => {
        let afields = a[sortedField.field];
        let bfields = b[sortedField.field];

        if(sortedField.field === "location") { 
          afields = a[sortedField.field]["street"]["name"];
          bfields = b[sortedField.field]["street"]["name"];
        } 

        if (!sortedField.ascending) {
          if (afields < bfields) {
            return -1;
          }
          if (afields > bfields) {
            return 1;
          }
        } else {
          if (afields > bfields) {
            return -1;
          }
          if (afields < bfields) {
            return 1;
          }
        }

        return 0;
      });
    }

    streetCrimeData = sortedData;


    return (
      <table>
        <thead>
          <tr>
            <th>
              Office
              <button className="fa fa-sort" onClick={() => setSortedField({field: "office", ascending: !sortedField.ascending})}></button>
            </th>
            <th>
              Category
              <button className="fa fa-sort" onClick={() => setSortedField({field: "category", ascending: !sortedField.ascending})}></button>
            </th>
            <th>
              Location
              <button className="fa fa-sort" onClick={() => setSortedField({field: "location", ascending: !sortedField.ascending})}></button>  
            </th>
            <th>
              Outcome
              <button className="fa fa-sort" onClick={() => setSortedField({field: "outcome", ascending: !sortedField.ascending})}></button>
            </th>
            <th>
              Month
              <button className="fa fa-sort" onClick={() => setSortedField({field: "month", ascending: !sortedField.ascending})}></button>
            </th>
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
            <td>{item.outcome}</td>
            <td>{item.month}</td>
          </tr>
        ))}
    </tbody>
  )
}


export default App;
