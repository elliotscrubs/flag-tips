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
  const localStorageGameCountLabel = 'flag-tips-gameCount';

  const [isCleanSheet, setIsCleanSheet] = useState<boolean>(() => { // nullázzon le mindent, ha új nap van
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

  // számoljuk a játékokat, mert egy nap csak 5-ször lehet játszani
  const [gameCount, setGameCount] = useState<number>(() => {
    // ha először nyitja meg az oldalt, akkor 0; egyébként annyi amennyit már játszott aznap

    const savedGameCount = localStorage.getItem(localStorageGameCountLabel);
    const initialGameCount = savedGameCount ? JSON.parse(savedGameCount) : 1;

    // játszott-e már aznap vagy nem
    if (!isCleanSheet && initialGameCount) {
      return initialGameCount;
    } else {
      localStorage.setItem(localStorageGameCountLabel, JSON.stringify(1));
      return 1; // alap érték
    }
  });

  useEffect(() => {
    localStorage.setItem(localStorageGameCountLabel, JSON.stringify(gameCount));
  }, [gameCount]);

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
        autoClose: 3000,
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
          autoClose: 4000,
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
    if (gameCount < 5) {
      setGameCount(gameCount + 1);
      setIsCleanSheet(true);
      setSelectedOptions(defaultOptions);
    } else if (gameCount >= 4) {
      toast.info('You have played 5 games today. Come back tomorrow! 😉', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    }
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
        <p
          style={{
            color: 'black',
            fontSize: '20px',
            fontWeight: 'bold',
            border: '3px solid rgba(0, 0, 0, 0.2)',
            background: 'white',
            float: 'right',
            margin: '0',
            borderRadius: '4px',
          }}>
          {gameCount} / 5
        </p>
        <Button // ez a Next gomb css-e
          style={{
            color: 'black',
            fontSize: '15px',
            fontWeight: 'bold',
            border: '3px solid rgba(0, 0, 0, 0.2)',
            background: 'grey',
          }}
          onClick={getNextFlag}>
          Next
        </Button>
      </div>
    </div>
  );
}

export default App;
export type { Option };
