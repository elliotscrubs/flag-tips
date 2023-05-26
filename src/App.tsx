import { css, Skeleton, Button } from '@mui/material';
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

const FlagSelector = () => (
  // majd ez fog allapottol fuggoen Autocomplete-et megjeleniteni
  // ez a rész a 6 válasz lehetőség
  <Skeleton
    animation={false}
    variant='rounded'
    sx={{
      height: '30px',
      margin: '20px 0',
    }}
  />
);

function App() {
  return (
    <div
      style={{
        // ez a rész a zászló képe
        width: '500px',
        margin: 'auto',
        textAlign: 'center',
      }}>
      <div
        style={{
          // ez a rész a Flag-tips szöveg
          textTransform: 'uppercase',
          fontSize: '40px',
          fontWeight: 'bold',
          borderBottom: '2px solid rgba(0, 0, 0, 0.11)',
          marginBottom: '20px',
          padding: '10px 0',
        }}>
        Flag - Tips
      </div>
      <FlagComponent />
      <DropdownMenu  /> 
      <div>
        {Array(6)
          .fill(null)
          .map((_, i) => (
            <FlagSelector key={i} />
          ))}
        <Button // tipp leadás gombja 
          style={{
            color: 'black',
            fontSize: '20px',
            fontWeight: 'bold',
            border: '3px solid rgba(0, 0, 0, 0.2)',
            background: 'grey',
          }}
          onClick={() =>{} }>
          Guess
        </Button>
      </div>
    </div>
  );
}

export default App;
