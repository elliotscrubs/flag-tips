import React, { useState } from 'react';
import { css, Autocomplete, TextField } from '@mui/material';
import countriesData from './countries.json';

const countries: { [key: string]: string } = countriesData; // mivel a json fájlban nincs index definiálva, ezért nem tudja használni a string kifejezést. ezért kell ez a változó.

interface AutocompleteOption {
  label: string;
}

const DropdownMenu = ({
  handleMenuChange,
}: {
  handleMenuChange: (index: number, value: string) => void;
}) => {
  // ez a legördülő menü
  const [selectedOptions, setSelectedOptions] = useState<Array<string>>(
    Array(6).fill('')
  );

  const handleChange = (
    event: React.ChangeEvent<{}>,
    value: AutocompleteOption | null,
    index: number
  ) => {
    if (value) {
      setSelectedOptions(prevSelectedOptions => {
        const newSelectedOptions = [...prevSelectedOptions];
        newSelectedOptions[index] = value.label;
        return newSelectedOptions;
      });
      handleMenuChange(index, value.label);
    }
  };

  return (
    <div>
      {selectedOptions.map((selectedOption, index) => (
        <Autocomplete
          key={index}
          options={Object.keys(countries)}
          getOptionLabel={countryCode => countries[countryCode]} // beállítjuk a megjelenített szöveget az országkódhoz tartozó országnév alapján
          value={selectedOption}
          onChange={(event, value) =>
            handleChange(event, value ? { label: value } : null, index)
          }
          renderInput={params => (
            <TextField {...params} />
          )}
          style={{
            color: 'black',
            fontWeight: 'bold',
            border: '3px solid rgba(0, 0, 0, 0.2)',
            marginBottom: '5px',
            marginTop: '5px'
          }}
        />
      ))}
    </div>
  );
};

export default DropdownMenu;
