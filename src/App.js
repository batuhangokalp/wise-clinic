import React, { useEffect } from "react";
import Routes from "./routes";

//Import Scss
import "./assets/scss/themes.scss";

//fackbackend
import fakeBackend from "./helpers/fake-backend";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { ToastContainer } from "react-toastify";

// //Firebase helper
// import { initFirebaseBackend } from "./helpers/firebase";

// TODO
fakeBackend();

// const firebaseConfig = {
// 	apiKey: process.env.REACT_APP_APIKEY,
// 	authDomain: process.env.REACT_APP_AUTHDOMAIN,
// 	databaseURL: process.env.REACT_APP_DATABASEURL,
// 	projectId: process.env.REACT_APP_PROJECTID,
// 	storageBucket: process.env.REACT_APP_STORAGEBUCKET,
// 	messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
// 	appId: process.env.REACT_APP_APPID,
// 	measurementId: process.env.REACT_APP_MEASUREMENTID,
// };

// // init firebase backend
// initFirebaseBackend(firebaseConfig);

function App() {
  const selectLayoutProperties = createSelector(
    (state) => state.Layout,
    (layout) => ({
      layoutMode: layout.layoutMode,
    })
  );

  const { layoutMode } = useSelector(selectLayoutProperties);

  useEffect(() => {
    layoutMode && localStorage.setItem("layoutMode", layoutMode);
  }, [layoutMode]);

  useEffect(() => {
    console.log("Mevcut bildirim izni:", Notification.permission);
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        console.log("Yeni izin durumu:", permission);
      });
    }
  }, []);

  return (
    <>
      <Routes />
      {/* Toast bildirimleri için container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;
