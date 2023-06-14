import { Autocomplete, TextField } from '@mui/material';
import countriesData from './countries.json';
import type { Option } from './App';
import { css } from "@mui/material";

const countries: { [key: string]: string } = countriesData; // mivel a json fájlban nincs index definiálva, ezért nem tudja használni a string kifejezést. ezért kell ez a változó.

const renderWinnerText = css`

  
`

const DropdownMenu = ({
  handleMenuChange,
  selectedOptions,
}: {
  handleMenuChange: (value: string | null, index: number) => void;
  selectedOptions: Array<Option>;
}) => {
  const defaultLabel = "What's your tip?";

  function renderWinnerText(isWinner: boolean | null) {
    if (isWinner === true) {
      return '✔️';
    } else if (isWinner === false) {
      return '❌';
    } else {
      return null;
    }
  }

  function isDisabled(selectedOptions: Array<Option>, index: number) {
    if(selectedOptions.find(option => option.isWinner === true)) { 
      return true
    } else {
      if(selectedOptions[index].isWinner === false) {
        return true
      } else { 
        return false
      }
    }


    
  }


  return (
    <div>
      {selectedOptions.map((selectedOption, index) => (
        <div key={index} 
        /* style={{
          flexDirection: 'row',
          display: 'flex'
        }} */
        >
          <Autocomplete
            key={index}
            options={Object.keys(countries)}
            getOptionLabel={countryCode => countries[countryCode] || defaultLabel} // beállítjuk a megjelenített szöveget az országkódhoz tartozó országnév alapján
            value={selectedOption.country}
            disabled={isDisabled(selectedOptions, index)}
            onChange={(event, value) => handleMenuChange(value, index)}
            renderInput={params => <TextField {...params} />}
            style={{
              color: 'black',
              fontWeight: 'bold',
              border: '3px solid rgba(0, 0, 0, 0.2)',
              marginBottom: '5px',
              marginTop: '5px',
            }}
          />
          <p>{renderWinnerText(selectedOption.isWinner)}</p>
        </div>
      ))}
    </div>
  );
};

export default DropdownMenu;
