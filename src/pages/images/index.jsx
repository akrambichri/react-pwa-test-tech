import React, { Component } from "react";
import { Webcam } from "../../webcam";
import storage from "../../firebaseConfig";
import {
  ref,
  uploadString,
  StringFormat,
  listAll,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { toast } from "react-toastify";

class Images extends Component {
  constructor() {
    super();
    this.webcam = null;
    this.state = {
      capturedImage: null,
      captured: false,
      uploading: false,
      percent: 0,
      allImages: [],
      openCamera: false,
    };
  }

  componentDidMount() {
    // initialize the camera
    this.canvasElement = document.createElement("canvas");
    this.webcam = new Webcam(
      document.getElementById("webcam"),
      this.canvasElement
    );

    this.getAllImages();
  }

  captureImage = async () => {
    const capturedData = await this.webcam.takeBase64Photo({
      type: "png",
      quality: 0.8,
    });
    this.setState({
      captured: true,
      capturedImage: capturedData.base64,
    });
  };

  toggleCamera = () => {
    this.setState(
      {
        openCamera: !this.state.openCamera,
      },
      () => {
        if (this.state.openCamera)
          this.webcam.setup().catch(() => {
            toast("Error getting access to your camera");
          });
        else this.webcam.stopRecord();
      }
    );
  };

  discardImage = () => {
    this.setState({
      captured: false,
      capturedImage: null,
      uploading: false,
    });
  };

  deleteSelectedImage = (imageUrl) => {
    // eslint-disable-next-line
    var matches = imageUrl.match(/\/([^\/?#]+)[^\/]*$/);
    let filename = null;
    if (matches.length > 1) {
      filename = matches[1].substring(matches[1].search("react_pwa"));
    }
    if (this.props.offline) {
      toast("PLease try again once internet connection is detected");
    } else if (filename) {
      // Create a reference to the file to delete
      const desertRef = ref(storage, "images/" + filename);

      // Delete the file
      deleteObject(desertRef)
        .then(() => {
          // File deleted successfully
          this.setState((prevState) => {
            return {
              allImages: prevState.allImages.filter((e) => e !== imageUrl),
            };
          });
          toast("Image deleted");
        })
        .catch((error) => {
          // Uh-oh, an error occurred!
          toast("Error occured, try again later");
        });
    } else {
      toast("Error occured, try again later");
    }
  };

  uploadImage = () => {
    // create a random string with a prefix
    const prefix = "react_pwa_";
    // create random string
    const rs = Date.now();
    if (this.props.offline) {
      localStorage.setItem(`${prefix}${rs}`, this.state.capturedImage);
      toast(
        "Image saved locally, it will be uploaded to Firebase once internet connection is detected"
      );

      this.discardImage();
      // save image to local storage
    } else {
      this.setState({ uploading: true });
      const storageRef = ref(storage, `/images/${prefix}${rs}.png`);
      // progress can be paused and resumed. It also exposes progress updates.
      // Receives the storage reference and the file to upload.
      uploadString(storageRef, this.state.capturedImage, StringFormat.DATA_URL)
        .then((snapshot) => {
          this.updateImages(storageRef);
          this.discardImage();
          toast("Image Uploaded to Firebase");
        })
        .catch(() => {
          toast("Sorry, we encountered an error uploading your image");
        });
    }
  };

  updateImages = (ref) => {
    getDownloadURL(ref)
      .then((url) => {
        // Insert url into an <img> tag to "download"
        const newImages = [...new Set([url, ...this.state.allImages])];
        this.setState({ allImages: newImages });
      })
      .catch((error) => {
        toast("Error occured, try again later");
      });
  };

  getAllImages = () => {
    const listRef = ref(storage, "images");
    listAll(listRef)
      .then((res) => {
        res.items.forEach((itemRef) => {
          // All the items under listRef.
          this.updateImages(itemRef);
        });
      })
      .catch((error) => {
        toast("Error occured, try again later");
      });
  };

  render() {
    const imageDisplay = this.state.capturedImage ? (
      <img
        src={this.state.capturedImage}
        alt="captured"
        width="350"
        className="h-full"
      />
    ) : (
      <span />
    );

    const gallery = this.state.allImages?.map((item, i) => (
      <div
        key={i}
        className="flex flex-wrap sm:w-1/2 md:w-1/3 w-full justify-end"
      >
        <button
          type="button"
          aria-label="delete image button"
          className="float-right bg-red-500 rounded-full px-2"
          onClick={() => this.deleteSelectedImage(item)}
        >
          X
        </button>
        <div key={i} className="w-full p-2 pt-0">
          <img
            src={item}
            className="block object-cover object-center w-full h-full rounded-lg"
            key={i}
            alt="img from firebase"
          />
        </div>
      </div>
    ));

    const buttons = (
      <div className="flex justify-center items-center space-x-2 py-4">
        {this.state.captured ? (
          <>
            <button
              type="button"
              aria-label="descard capture image button"
              className="mt-5 p-2 pl-5 pr-5 bg-orange-600 text-white rounded"
              onClick={this.discardImage}
            >
              Delete Photo
            </button>
            <button
              type="button"
              aria-label="upload capture image button"
              className="mt-5 p-2 pl-5 pr-5 bg-blue-700 text-white rounded"
              onClick={this.uploadImage}
            >
              Upload Photo
            </button>
          </>
        ) : (
          <button
            type="button"
            aria-label="captue new image button"
            className="mt-5 p-2 pl-5 pr-5 bg-blue-700 text-white rounded"
            onClick={this.captureImage}
          >
            Take Picture
          </button>
        )}
      </div>
    );

    const uploading = this.state.uploading ? (
      <div>
        <p> Uploading Image, please wait ... </p>
      </div>
    ) : (
      <span />
    );

    return (
      <div className="container mx-auto px-4 justify-center items-center">
        <div className="flex w-full justify-end">
          <button
            type="button"
            aria-label="toggle camera button"
            className="m-5 p-2 text-white rounded-full border-2 border-orange-300"
            onClick={this.toggleCamera}
          >
            <img
              src={!this.state.openCamera ? "camera128.png" : "close128.png"}
              alt="icon camera 128px"
              className="h-6 w-6"
              height="24"
              width="24"
            />
          </button>
        </div>
        {uploading}
        <video
          className="mx-auto mb-2"
          autoPlay
          playsInline
          muted
          hidden={!this.state.openCamera}
          id="webcam"
          width="350"
          height="auto"
        />
        {this.state.capturedImage && (
          <div className="mt-5 w-full flex justify-center">{imageDisplay}</div>
        )}
        {this.state.openCamera && <div>{buttons}</div>}
        <h3 className="mt-16 font-bold mb-8">List uploaded images</h3>
        <div className="flex flex-wrap -m-1 md:-m-2">{gallery}</div>
      </div>
    );
  }
}

export default Images;
