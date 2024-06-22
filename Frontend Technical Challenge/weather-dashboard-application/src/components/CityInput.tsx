import React, { useState } from "react";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { AutoComplete } from "primereact/autocomplete";
import { Button } from "primereact/button";

interface CityInputProps {
  onCityChange: (city: string) => void;
}

export default function CityInput({ onCityChange }: CityInputProps) {
  const [value, setValue] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleCitySubmit = () => {
    onCityChange(value);
  };

  const fetchCitySuggestions = async (query: string) => {
    if (query.length > 2) {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${query}`
      );
      const data = await response.json();
      const cityNames = data.results.map((result: any) => result.name);
      setSuggestions(cityNames || []);
    }
  };

  const handleAutoCompleteChange = (e: { query: string }) => {
    setValue(e.query);
    fetchCitySuggestions(e.query);
  };

  const handleSelect = (e: { value: string }) => {
    setValue(e.value);
    onCityChange(e.value);
  };

  return (
    <div className="city-input-container">
      <div className="card flex justify-content-center">
        <AutoComplete
          className="autocomplete"
          value={value}
          suggestions={suggestions}
          completeMethod={handleAutoCompleteChange}
          onChange={(e) => setValue(e.value)}
          onSelect={handleSelect}
        />
        <Button
          className="submit-button"
          label="City"
          onClick={handleCitySubmit}
        />
      </div>
    </div>
  );
}
