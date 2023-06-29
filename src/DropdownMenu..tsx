import { Autocomplete, TextField } from '@mui/material';
import countriesData from './countries.json';
import type { Option } from './App';

const countries: { [key: string]: string } = countriesData; //a json fájlban nincs index definiálva, ezért nem tudja használni a string kifejezést. ezért kell ez a változó.

const DropdownMenu = ({
  handleMenuChange,
  selectedOptions,
}: {
  handleMenuChange: (value: string | null, index: number) => void;
  selectedOptions: Array<Option>;
}) => {
  function renderWinnerText(isWinner: boolean | null) {
    if (isWinner === true) {
      return ' ✔️';
    } else if (isWinner === false) {
      return ' ❌';
    } else {
      return '';
    }
  }

  function isDisabled(selectedOptions: Array<Option>, index: number) {
    // disabled lesz az a sor, amibe már írtál. mindig az aktuális sorba lehet írni
    const isWinnerArray: Array<boolean | null> = selectedOptions.map(
      option => option.isWinner
    );

    if (isWinnerArray.includes(true)) {
      return true;
    } else {
      if (isWinnerArray[index] === false) {
        return true;
      } else {
        const firstNullIsWinnerIndex: number | null = isWinnerArray.findIndex(
          isWinner => isWinner === null
        );
        if (firstNullIsWinnerIndex === index) {
          return false;
        } else {
          return true;
        }
      }
    }
  }

  const selectedCountries = selectedOptions.map(option => option.country);
  const eligibleCountries = Object.keys(countries).filter(
    country => !selectedCountries.includes(country)
  );

  return (
    <div>
      {selectedOptions.map((selectedOption, index) => (
        <div key={index}>
          <Autocomplete
            key={index}
            options={eligibleCountries}
            getOptionLabel={countryCode =>
              (countries[countryCode] || '') +
              renderWinnerText(selectedOption.isWinner)
            }
            value={selectedOption.country}
            disabled={isDisabled(selectedOptions, index)}
            onChange={(event, value) => handleMenuChange(value, index)}
            renderInput={params => <TextField {...params} />}
            style={{
              // legördülő menü csse
              color: 'black',
              fontWeight: 'bold',
              border: '3px solid rgba(0, 0, 0, 0.2)',
              marginBottom: '5px',
              marginTop: '5px',
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default DropdownMenu;
