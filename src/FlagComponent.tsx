import React, { useState, useEffect } from 'react';
import './index.css';

const FlagComponent = ({ countryCode }: { countryCode: string | null }) => {
  const [currentFlag, setCurrentFlag] = useState(null);

  useEffect(() => {
    const importFlag = async () => {
      const response = await import(`./images/${countryCode}.svg`);
      setCurrentFlag(response.default); //  A zászló képének beállítása
    };

    importFlag();
  }, [countryCode]);

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
