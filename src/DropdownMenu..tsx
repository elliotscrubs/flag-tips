import { Autocomplete, TextField } from '@mui/material';
import countriesData from './countries.json';
import type { Option } from './App';

const countries: { [key: string]: string } = countriesData; // mivel a json fájlban nincs index definiálva, ezért nem tudja használni a string kifejezést. ezért kell ez a változó.

const DropdownMenu = ({
  handleMenuChange,
  selectedOptions,
}: {
  handleMenuChange: (value: string | null, index: number) => void;
  selectedOptions: Array<Option>;
}) => {
  const defaultLabel = "What's your tip?";

  return (
    <div>
      {selectedOptions.map((selectedOption, index) => (
        <Autocomplete
          key={index}
          options={Object.keys(countries)}
          getOptionLabel={countryCode => countries[countryCode] || defaultLabel} // beállítjuk a megjelenített szöveget az országkódhoz tartozó országnév alapján
          value={selectedOption.country}
          onChange={(event, value) =>
            handleMenuChange(value ? value : null, index)
          }
          renderInput={params => <TextField {...params} />}
          style={{
            color: 'black',
            fontWeight: 'bold',
            border: '3px solid rgba(0, 0, 0, 0.2)',
            marginBottom: '5px',
            marginTop: '5px',
          }}
        />
      ))}
    </div>
  );
};

export default DropdownMenu;
