import logo from "./logo.svg";
import "./App.css";
import { PrimeReactProvider } from "primereact/api";
import CityInput from "./components/CityInput.tsx";
import DaysInput from "./components/DaysInput.tsx";
import WeatherCard from "./components/WeatherCard.tsx";
import ForecastTable from "./components/ForecastTable.tsx";
import WeatherChart from "./components/WeatherChart.tsx";


function App() {
  return (
    <div className="App">
      <WeatherCard />
      <WeatherChart/> 
      <ForecastTable />
    </div>
  );
}

export default App;
