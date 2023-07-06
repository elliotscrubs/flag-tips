const Result = ({ score }: { score: number }) => {
  return (
    <div
    style={{
        width: '500px',
        margin: 'auto',
        textAlign: 'center',
        color: 'blue',
        fontSize: 'xxx-large',
        backgroundColor: "yellow"
      }}>
      <div className='result'>
        <div className='text'>
          <p>Congrats! 🏆 Your points:</p>
          <p>{score} / 5</p>
          <p>Play tomorrow too! 😎</p>
        </div>
      </div>
    </div>
  );
};

export default Result;