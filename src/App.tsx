import { Button } from '@mui/material';
import FlagComponent from './FlagComponent';
import DropdownMenu from './DropdownMenu.';


function App() {
  const handleMenuChange = (index: number, value: string) => {
    // Itt kezelheted a kiválasztott országokat
    console.log(`Selected option ${index + 1}: ${value}`);
  };

  return (
    <div
      style={{ // ez a zászló css-e
        width: '500px',
        margin: 'auto',
        textAlign: 'center',
      }}
    >
      <div
        style={{ // ez a Flag-Tips felirat css-e
          textTransform: 'uppercase',
          fontSize: '40px',
          fontWeight: 'bold',
          borderBottom: '2px solid rgba(0, 0, 0, 0.11)',
          marginBottom: '10px',
          padding: '10px 0',
        }}
      >
        Flag - Tips
      </div>
      <FlagComponent />
      <DropdownMenu handleMenuChange={handleMenuChange} 
      />
      <div>
        <Button // ez a Guess gomb css-e
          style={{
            color: 'black',
            fontSize: '20px',
            fontWeight: 'bold',
            border: '3px solid rgba(0, 0, 0, 0.2)',
            background: 'grey',
          }}
          onClick={() => {}}
        >
          Guess
        </Button>
      </div>
    </div>
  );
}

export default App;
  
