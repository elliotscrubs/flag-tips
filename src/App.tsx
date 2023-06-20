import React, { useState, useEffect, useMemo } from 'react';
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

function currentDate() {
  const date = new Date(); // megadjuk aa mostani dátumot
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

function App() {
  const localStorageLastUsedDateLabel = 'flagTips-lastUsedDate';
  const localStorageSolutionCountryCodeLabel = 'flagTips-solutionCountryCode';
  const localStorageSelectedOptionsLabel = 'flagTips-selectedOptions';

  const [isCleanSheet, setIsCleanSheet] = useState<boolean>(() => {
    const savedLastUsedDate =
      localStorage.getItem(localStorageLastUsedDateLabel) || '{}';

    const lastUsedDate = JSON.parse(savedLastUsedDate);
      localStorage.setItem(
      localStorageLastUsedDateLabel,
      JSON.stringify(currentDate())
    );

    if (lastUsedDate !== currentDate()) {
      return true;
    } else {
      return false;
    }
  });

  const solutionCountryCode = useMemo<string>(() => {
    const savedSolutionCountryCode = localStorage.getItem(
      localStorageSolutionCountryCodeLabel
    );

    const initialSolutionCountryCode = savedSolutionCountryCode
      ? JSON.parse(savedSolutionCountryCode)
      : undefined;

    if (!isCleanSheet && initialSolutionCountryCode) {
      return initialSolutionCountryCode;
    } else {
      const countryCodes = Object.keys(countries); // Országkódok (rövidített nevek) lekérése
      const randomCountryCode =
        countryCodes[Math.floor(Math.random() * countryCodes.length)];

      localStorage.setItem(
        localStorageSolutionCountryCodeLabel,
        JSON.stringify(randomCountryCode)
      );
      setIsCleanSheet(false);
      return randomCountryCode; // Véletlenszerű országkód kiválasztása
    }
  }, [isCleanSheet]);


  const defaultOptions: Array<Option> = Array(6).fill({
    country: '',
    isWinner: null,
  });

  const [selectedOptions, setSelectedOptions] = useState<Array<Option>>(() => {
    
    const savedSelectedOptions = localStorage.getItem(
      localStorageSelectedOptionsLabel
    );
    const initialSelectedOptions = savedSelectedOptions
      ? JSON.parse(savedSelectedOptions)
      : defaultOptions;

    if (!isCleanSheet && initialSelectedOptions) {
      return initialSelectedOptions;
    } else {
      localStorage.setItem(
        localStorageSelectedOptionsLabel,
        JSON.stringify(defaultOptions)
      );
      return defaultOptions;
    }
  });

  useEffect(() => {
    localStorage.setItem(
      localStorageSelectedOptionsLabel,
      JSON.stringify(selectedOptions)
    );
  }, [selectedOptions]);

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

    const lastCountry: string = selectedOptions.pop()?.country || '';
    const notSuccess: boolean = lastCountry !== solutionCountryCode;
    const notEmpty: boolean = lastCountry !== '';

    if (notSuccess && notEmpty) {
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
    }
  }

  function getNextFlag() {
    setIsCleanSheet(true)
    setSelectedOptions(defaultOptions)
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
            float: 'left',
          }}
          onClick={checkGuesses}>
          Guess
        </Button>
        <Button // ez a Next gomb css-e
          style={{
            color: 'black',
            fontSize: '15px',
            fontWeight: 'bold',
            border: '3px solid rgba(0, 0, 0, 0.2)',
            background: 'grey',
            float: 'right',
          }}
          onClick={getNextFlag}
          >
          Next
        </Button>
      </div>
    </div>
  );
}

export default App;
export type { Option };
