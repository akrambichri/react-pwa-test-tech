import React, { Component, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Auth from "./pages/auth";
import storage from "./firebaseConfig";
import { ref, uploadString, StringFormat } from "firebase/storage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = lazy(() => import("./pages"));
const Audios = lazy(() => import("./pages/audios"));
const Videos = lazy(() => import("./pages/videos"));
const Images = lazy(() => import("./pages/images"));

class App extends Component {
  constructor() {
    super();
    this.state = {
      offline: false,
      token: null,
    };
  }
  componentDidMount() {
    window.addEventListener("online", () => {
      this.setState({ offline: false });
    });

    window.addEventListener("offline", () => {
      this.setState({ offline: true });
    });

    this.setState({ token: this.getToken() });
  }

  componentDidUpdate(prevProps) {
    let offlineStatus = !navigator.onLine;
    if (this.state.offline !== offlineStatus) {
      this.setState({ offline: offlineStatus });
    }

    if (!this.props.offline && prevProps.offline === true) {
      // if its online,
      this.batchUploads();
    }
  }
  findLocalItems = (query) => {
    var i,
      results = [];
    for (i in localStorage) {
      if (localStorage.hasOwnProperty(i)) {
        if (i.match(query) || (!query && typeof i === "string")) {
          const value = localStorage.getItem(i);
          results.push({ key: i, val: value });
        }
      }
    }
    return results;
  };

  batchUploads = () => {
    // this is where all the images saved can be uploaded as batch uploads
    const images = this.findLocalItems(/^react_pwa_/);
    let error = false;
    if (images.length > 0) {
      this.setState({ uploading: true });

      for (let i = 0; i < images.length; i++) {
        const storageRef = ref(storage, `/files/${images[i].key}.png`);

        uploadString(storageRef, images[i].val, StringFormat.DATA_URL)
          .then((snapshot) => {
            toast("Files Uploaded to Firebase");
          })
          .catch(() => {
            toast("Sorry, we encountered an error uploading your image");
          });
      }
      this.setState({ uploading: false });
      if (!error) {
        toast("All saved images have been uploaded to Firebase");
      }
    }
  };

  getToken = () => {
    const tokenString = localStorage.getItem("token");
    const userToken = JSON.parse(tokenString);
    return userToken?.token;
  };

  saveToken = (userToken) => {
    localStorage.setItem("token", JSON.stringify(userToken));
    this.setState({ token: userToken.token });
  };

  removeToken = () => {
    localStorage.removeItem("token");
    this.setState({ token: null });
    toast("Log out success");
  };

  render() {
    if (!this.state.token) {
      return (
        <>
          <ToastContainer />
          <Auth offline={this.state.offline} setToken={this.saveToken} />
        </>
      );
    }
    return (
      <Suspense fallback={<span>loading....</span>}>
        <Router>
          <Navbar logOut={this.removeToken} />
          <ToastContainer />
          <Routes>
            <Route
              exact
              path="/"
              element={<Home offline={this.state.offline} />}
            />
            <Route
              path="/audios"
              element={<Audios offline={this.state.offline} />}
            />
            <Route
              path="/videos"
              element={<Videos offline={this.state.offline} />}
            />
            <Route
              path="/images"
              element={<Images offline={this.state.offline} />}
            />
          </Routes>
        </Router>
      </Suspense>
    );
  }
}

export default App;
