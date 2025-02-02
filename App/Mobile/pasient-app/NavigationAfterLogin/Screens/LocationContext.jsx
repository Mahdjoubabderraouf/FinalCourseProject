import React, { createContext, useState, useEffect } from "react";

import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import io from "socket.io-client";
import { getData } from "../../localStorage";

const LocationContext = createContext();

const LOCATION_TASK_NAME = "background-location-task";
const SOCKET_SERVER_URL = `http://${process.env.SERVER_IP}`;

const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [socket, setSocket] = useState(null);
  const [patientId, setPatientId] = useState(null);

  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL);
    setSocket(socket);

    // Emit a test message to the server
    socket.emit("test message", "test");

    setPatientId(getData("patientId"));
    return () => {
      if (socket !== null) {
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const Permission = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          throw new Error("Permission to access location was denied");
        }
        let backgroundStatus =
          await Location.requestBackgroundPermissionsAsync();

        if (backgroundStatus.status !== "granted") {
          throw new Error(
            "Permission to access background location was denied"
          );
        }
        console.log("hi");
        if (socket !== null) {
          setTimeout(async () => {
            let location = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Highest,
              timeInterval: 10000, // Update every 10 seconds
              distanceInterval: 10, // Update every 10 meters
            });
            const { longitude, latitude } = location.coords;
            socket.emit("locationUpdate", { longitude, latitude });
            setLocation(location);
            console.log(location);
          }, 2000);
        }

        // treat error
      } catch (error) {
        setErrorMsg(error.message);
      }
    };

    Permission();
  }, [location]);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <LocationContext.Provider value={{ text, errorMsg }}>
      {children}
    </LocationContext.Provider>
  );
};

export { LocationProvider, LocationContext };

// TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
//   console.log("hello");
//   if (error) {
//     // Error occurred - check `error.message` for more details.
//     return;
//   }
//   if (data) {
//     const { locations } = data;

//     console.log("locations", locations);

//     // do something with the locations captured in the background
//   }
// });
