import "./App.css";

function App() {
  fetch("http://localhost:3000/api/data")
    .then((response) => response.json())
    .then((data) => {
      console.log(JSON.stringify(data, null, 2));
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

  return (
    <>
      <div className="App"></div>
    </>
  );
}

export default App;
