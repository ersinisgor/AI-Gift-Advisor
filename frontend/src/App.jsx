import GiftForm from "./components/GiftForm";

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="title-group">
          <img src="/genie.svg" className="genie-icon-img" />
          <h1>Gift Genie</h1>
        </div>
      </header>

      <main className="main-content">
        <GiftForm />
      </main>
    </div>
  );
}

export default App;
