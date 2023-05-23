import React, { useState, useEffect } from 'react';
import countries from './countries.json';

const FlagComponent = () => {
  const [currentFlag, setCurrentFlag] = useState(null);

  useEffect(() => {
    const importFlag = async () => {
      const countryCodes = Object.keys(countries); // Országkódok (rövidített nevek) lekérése
      const randomCountry =
        countryCodes[Math.floor(Math.random() * countryCodes.length)]; // Véletlenszerű országkód kiválasztása
      const response = await import(`./images/${randomCountry}.svg`);

      setCurrentFlag(response.default); //  A zászló képének beállítása
    };

    importFlag();
  }, []);

  return (
    <div>
      {currentFlag && (
        <img
          style={{
            width: '100%',
          }}
          src={currentFlag}
          alt='Flag'
        />
      )}
    </div>
  );
};

export default FlagComponent;
