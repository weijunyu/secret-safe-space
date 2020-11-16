import React from "react";
import SecretPathSelector from "./components/SecretPathSelector";
function App() {
  return (
    <div className="app">
      <header className="app-header">This is header</header>
      <main>
        <section>
          <h1>Secrits</h1>
          <SecretPathSelector />
        </section>
      </main>
    </div>
  );
}

export default App;
