import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FlagComponent from './FlagComponent';
import DropdownMenu from './DropdownMenu.';
import countriesData from './countries.json';

const countries: { [key: string]: string } = countriesData;

type Option = {
  country: string;
  isWinner: boolean | null;
};

function App() {
  const [solutionCountryCode, setSolutionCountryCode] = useState<string | null>(
    null
  );

  useEffect(() => {
    const countryCodes = Object.keys(countries); // Országkódok (rövidített nevek) lekérése
    setSolutionCountryCode(
      countryCodes[Math.floor(Math.random() * countryCodes.length)]
    ); // Véletlenszerű országkód kiválasztása
  }, []);

  // ez a legördülő menü
  const [selectedOptions, setSelectedOptions] = useState<Array<Option>>(
    Array(6).fill({ country: '', isWinner: null })
  );

  const handleMenuChange = (value: string | null, index: number) => {
    if (value) {
      setSelectedOptions(prevSelectedOptions => {
        const newSelectedOptions = [...prevSelectedOptions];
        newSelectedOptions[index] = {
          country: value,
          isWinner: newSelectedOptions[index].isWinner,
        };
        return newSelectedOptions;
      });
    }
  };

  function checkGuesses() {
    setSelectedOptions(
      selectedOptions.map(({ country, isWinner }) => ({
        country: country,
        isWinner: country === '' ? null : country === solutionCountryCode,
      }))
    );

    if (
      selectedOptions
        .map(option => option.country)
        .includes(solutionCountryCode || '')
    ) {
      toast.success('Great! You win! 🥳', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }

    /*
    } else {
       toast.error(
        `You lost! 😱 The solution is: ${countries[solutionCountryCode || '']}`,
        {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        }
      ); 
    } */
  }

  return (
    <div
      style={{
        // ez a zászló css-e
        width: '500px',
        margin: 'auto',
        textAlign: 'center',
      }}>
      <div
        style={{
          // ez a Flag-Tips felirat css-e
          textTransform: 'uppercase',
          fontSize: '40px',
          fontWeight: 'bold',
          borderBottom: '2px solid rgba(0, 0, 0, 0.11)',
          marginBottom: '10px',
          padding: '10px 0',
        }}>
        Flag - Tips
      </div>
      <ToastContainer />
      <FlagComponent countryCode={solutionCountryCode} />
      <DropdownMenu
        handleMenuChange={handleMenuChange}
        selectedOptions={selectedOptions}
      />
      <div>
        <Button // ez a Guess gomb css-e
          style={{
            color: 'black',
            fontSize: '15px',
            fontWeight: 'bold',
            border: '3px solid rgba(0, 0, 0, 0.2)',
            background: 'grey',
          }}
          onClick={checkGuesses}>
          Guess
        </Button>
      </div>
    </div>
  );
}

export default App;
export type { Option };
