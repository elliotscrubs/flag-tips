import { css, Button } from '@mui/material';
import FlagComponent from './FlagComponent';
import DropdownMenu from './DropdownMenu.';


const headerCss = css`
  text-transform: uppercase;
  font-size: 40px;
  font-weight: bold;
  border-bottom: 2px solid rgba(0, 0, 0, 0.11);
  margin-bottom: 20px;
  padding: 10px 0;
`;



function App() {
  const handleMenuChange = (index: number, value: string) => {
    // Itt kezelheted a kiválasztott országokat
    console.log(`Selected option ${index + 1}: ${value}`);
  };

  return (
    <div
      style={{
        width: '500px',
        margin: 'auto',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          textTransform: 'uppercase',
          fontSize: '40px',
          fontWeight: 'bold',
          borderBottom: '2px solid rgba(0, 0, 0, 0.11)',
          marginBottom: '20px',
          padding: '10px 0',
        }}
      >
        Flag - Tips
      </div>
      <FlagComponent />
      <DropdownMenu handleMenuChange={handleMenuChange} 
      />
      <div>
        <Button
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
  
