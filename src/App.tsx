import { css, Skeleton } from "@mui/material";
import flag from "./images/hu.svg";

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
  <Skeleton
    animation={false}
    variant="rounded"
    sx={{
      height: "30px",
      margin: "5px 0",
    }}
  />
);

function App() {
  return (
    <div
      style={{
        width: "500px",
        margin: "auto",
        textAlign: "center",
      }}
    >
      <div
        style={{
          textTransform: "uppercase",
          fontSize: "40px",
          fontWeight: "bold",
          borderBottom: "2px solid rgba(0, 0, 0, 0.11)",
          marginBottom: "20px",
          padding: "10px 0",
        }}
      >
        header
      </div>
      <div>
        <img style={{ width: "100%" }} src={flag} alt="" />
      </div>
      <div>
        {Array(6)
          .fill(null)
          .map((_, i) => (
            <FlagSelector key={i} />
          ))}
      </div>
    </div>
  );
}

export default App;
