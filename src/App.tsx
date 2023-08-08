import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FlagComponent from './FlagComponent';
import DropdownMenu from './DropdownMenu';
import countriesData from './countries.json';
import Result from './Result';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

const countries: { [key: string]: string } = countriesData;

type Option = {
  country: string;
  isWinner: boolean | null;
};

type History = {
  solutionCountryCode: string; // megoldás
  selectedOptions: Array<Option>; // válaszlehetőségek
  date: string;
  gameCount: number;
};

function currentDate() {
  const date = new Date(); // megadjuk aa mostani dátumot
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

function App() {
  const [score, setScore] = useState(0); // számoljuk az 5 játékból mennyit talált el

  const localStorageLastUsedDateLabel = 'flagTips-lastUsedDate';
  const localStorageSolutionCountryCodeLabel = 'flagTips-solutionCountryCode';
  const localStorageSelectedOptionsLabel = 'flagTips-selectedOptions';
  const localStorageGameCountLabel = 'flag-tips-gameCount';

  const [isCleanSheet, setIsCleanSheet] = useState<boolean>(() => {
    // nullázzon le mindent, ha új nap van
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

  // számoljuk a j átékokat, mert egy nap csak 5-ször lehet játszani
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

  const [history, setHistory] = useState<Array<History>>([]);

  useEffect(() => {
    if (
      history.length === 0 ||
      history[0].date !== new Date().toISOString().split('T')[0] ||
      history[0].gameCount !== gameCount
    ) {
      const newGame = {
        solutionCountryCode: solutionCountryCode,
        selectedOptions: selectedOptions,
        date: new Date().toISOString().split('T')[0],
        gameCount: gameCount,
      };
      const updatedHistory = [newGame, ...history];
      setHistory(updatedHistory);
    } else {
      const newGame = {
        solutionCountryCode: solutionCountryCode,
        selectedOptions: selectedOptions,
        date: new Date().toISOString().split('T')[0],
        gameCount: gameCount,
      };
      const updatedHistory = [newGame, ...history.slice(1)];
      setHistory(updatedHistory);
    }
  }, [selectedOptions, gameCount, solutionCountryCode]);

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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      checkGuesses();
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
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      setScore(score + 1);
    }

    const lastCountry: string = selectedOptions.pop()?.country || '';
    const notSuccess: boolean = lastCountry !== solutionCountryCode;
    const notEmpty: boolean = lastCountry !== '';

    if (notSuccess && notEmpty) {
      toast.error(
        `You lost! 😱 The solution is: ${countries[solutionCountryCode || '']}`,
        {
          position: 'top-center',
          autoClose: 2000,
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
    if (gameCount < 6) {
      setGameCount(gameCount + 1);
      setIsCleanSheet(true);
      setSelectedOptions(defaultOptions);
    }
  }

  // Modal réaznek a statje meg a css-e
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '700px',
    bgcolor: 'white',
    border: '2px solid black',
    boxShadow: 24,
    overflow: 'scroll',
  };

  return gameCount === 6 ? (
    <Result score={score} />
  ) : (
    <div
      style={{
        // ez a zászló css-e
        width: '500px',
        margin: 'auto',
        textAlign: 'center',
      }}>
      <div
        style={{
          // ez a flag-tips felirat és a history gomb css-e
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Button
          style={{
            color: 'black',
            fontSize: '10px',
            fontWeight: 'bold',
            border: '3px solid rgba(0, 0, 0, 0.2)',
            background: 'grey',
            marginLeft: '30px',
          }}
          onClick={handleOpen}>
          History
        </Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'>
          <Box sx={style}>
            <div
              className='container' // modal rész container css-e
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '3px solid rgba(0, 0, 0, 0.2)',
              }}>
              {history.map((historyItem, index) => (
                <div key={index}>
                  <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                   }}>
                  {historyItem.date} / {historyItem.gameCount}
                  </div>
                  <div 
                  style={{
                    width: '100px',
                    marginTop: '5px'
                  }}>
                  <FlagComponent countryCode={historyItem.solutionCountryCode} />                 
                  </div>
                </div>                
              ))}
            </div>
          </Box>
        </Modal>
        <div
          style={{
            // ez a Flag-Tips felirat css-e
            textTransform: 'uppercase',
            fontSize: '40px',
            fontWeight: 'bold',
            borderBottom: '2px solid rgba(0, 0, 0, 0.11)',
            marginBottom: '10px',
            padding: '10px 0',
            marginRight: '30px',
          }}>
          Flag - Tips
        </div>
      </div>
      <ToastContainer />
      <FlagComponent countryCode={solutionCountryCode} />
      <DropdownMenu
        handleMenuChange={handleMenuChange}
        handleKeyDown={handleKeyDown}
        selectedOptions={selectedOptions}
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Button // ez a Guess gomb css-e
          style={{
            color: 'black',
            fontSize: '15px',
            fontWeight: 'bold',
            border: '3px solid rgba(0, 0, 0, 0.2)',
            background: 'grey',
            marginLeft: '30px',
          }}
          onClick={checkGuesses}>
          Guess
        </Button>
        <div
          style={{
            color: 'black',
            fontSize: '20px',
            fontWeight: 'bold',
            padding: '10px',
          }}>
          {gameCount} / 5
        </div>
        <Button // ez a Next gomb css-e
          style={{
            color: 'black',
            fontSize: '15px',
            fontWeight: 'bold',
            border: '3px solid rgba(0, 0, 0, 0.2)',
            background: 'grey',
            marginRight: '30px',
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
export type { History };
