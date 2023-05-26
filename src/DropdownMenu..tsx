import React, { useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import countries from './countries.json';

interface AutocompleteOption {
    label: string;
  }

const DropdownMenu = () => { 
    const [selectedOption, setSelectedOption] = useState(null);
    
    const handleMenuChange = (event, target) => { 
        setSelectedOption(value);
    };


    return (
        <div>
            <Autocomplete
                options={Object.keys(countries)}
                getOptionLabel={(countryCode) => countries[countryCode]} // beállítjuk a megjelenített szöveget az országkódhoz tartozó országnév alapján
                value={selectedOption}
                onChange={handleMenuChange} // eseménykezelő, ami frissíti a kiválasztott opciót az állapotban (selectedOption)
                renderInput={(params) => <TextField {...params} label="What is your tip?"/>}
            />
        </div>
    );
};

export default DropdownMenu;