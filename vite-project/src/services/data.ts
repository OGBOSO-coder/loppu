import mqtt from "mqtt";

let client: mqtt.MqttClient | null = null;
let temperatureData: number | null = null;
let lightData: number | null = null;

// MQTT-yhteyden muodostaminen
export function connectToMQTT(brokerUrl: string = "ws://172.20.49.76:9001") {
  return new Promise((resolve, reject) => {
    try {
      client = mqtt.connect(brokerUrl);

      client.on("connect", () => {
        console.log("MQTT: Yhdistetty brokeriin:", brokerUrl);

        // Tilataan molemmat topicit
        client?.subscribe("ryhmä4/temperature");
        client?.subscribe("ryhmä4/light");

        console.log("MQTT: Tilattu topicit");
        resolve(true);
      });

      // Vastaanotetaan molempien sensoreiden data
      client.on("message", (topic, message) => {
        const value = parseFloat(message.toString());

        if (topic === "ryhmä4/temperature") {
          temperatureData = value;
          console.log("TEMP →", temperatureData);
        }

        if (topic === "ryhmä4/light") {
          lightData = value;
          console.log("LIGHT →", lightData);
        }
      });

      client.on("error", (err) => {
        console.error("MQTT: Virhe:", err);
        reject(err);
      });

    } catch (error) {
      reject(error);
    }
  });
}

export async function fetchData() {
  if (!client || !client.connected) {
    throw new Error("MQTT-yhteys ei ole muodostettu.");
  }

  return {
    temperature: temperatureData,
    light: lightData,
    timestamp: new Date().toISOString(),
  };
}

export function disconnectMQTT() {
  if (client) {
    client.end();
    client = null;
  }
}
