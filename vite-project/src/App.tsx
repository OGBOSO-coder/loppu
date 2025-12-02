import './App.css'
import { connectToMQTT, fetchData, disconnectMQTT } from './services/data';
import { useEffect, useState } from 'react';

function App() {
  const [temperature, setTemperature] = useState<number | null>(null);
  const [light, setLight] = useState<number | null>(null);

  useEffect(() => {
    // Yhdistä MQTT:hen
    connectToMQTT("ws://172.20.49.76:9001")
      .then(() => {
        console.log("MQTT-yhteys muodostettu!");

        const interval = setInterval(() => {
          fetchData().then(data => {
            setTemperature(data.temperature ?? null);
            setLight(data.light ?? null)
          });
        }, 1000);

        // siivous
        return () => clearInterval(interval);
      })
      .catch(err => console.error("Virhe MQTT-yhteydessä:", err));

    // Kun komponentti suljetaan
    return () => {
      disconnectMQTT();
    };
  }, []);

  return (
    <div className="Main">
      <h2>Lämpötila-anturi</h2>
      <p>Tervetuloa lämpötila-anturin käyttöliittymään!</p>

      <p>Arvo:</p>
      <h1 style={{ fontSize: "3rem" }}>
        {temperature !== null ? `${temperature} °C` : "Ladataan..."}
      </h1>

      <div className='ligth_sensor'>
        <h2>Valoisuusanturi</h2>
        <p>Tervetuloa valoisuusanturin käyttöliittymään!</p>

        <p>Arvo:</p>
      <h1 style={{ fontSize: "3rem" }}>
        {light !== null ? `${light} arvo` : "Ladataan..."}
      </h1>

      </div>
    </div>
  );
}

export default App;
