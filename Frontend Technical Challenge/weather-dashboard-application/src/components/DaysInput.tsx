import React, { useState } from "react";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

interface DaysInputProps {
  onDaysChange: (days: string) => void;
}

export default function DaysInput({ onDaysChange }: DaysInputProps) {
  const [value, setValue] = useState("");

  const handleDaysSubmit = () => {
    onDaysChange(value);
  };

  return (
    <div className="days-input-container">
      <div className="card flex justify-content-center">
        <InputText
          className="input-field"
          style={{ width: 200, height: 20 }}
          variant="filled"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button
          className="submit-button"
          label="Days"
          onClick={handleDaysSubmit}
        />
      </div>
    </div>
  );
}
