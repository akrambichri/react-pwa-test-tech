import React, { useState, useEffect, useReducer } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import storage from "../../firebaseConfig";
import {
  ref,
  uploadBytes,
  listAll,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { toast } from "react-toastify";

function reducer(state, action) {
  switch (action.type) {
    case "append":
      return [...new Set([...state, action.payload])];
    case "remove":
      return [...state.filter((e) => e !== action.payload)];
    default:
      return;
  }
}

const Videos = ({ offline }) => {
  const [allVideos, dispatch] = useReducer(reducer, []);

  const [isRecording, setIsRecording] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [capturedVideo, setCapturedVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);

  const onStop = (blobUrl, blob) => {
    setCapturedVideo(blob);
    setVideoPreview(blobUrl);
  };

  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ video: true, onStop: onStop });

  const toggleRecording = () => {
    if (status !== "recording") {
      startRecording();
      setIsRecording(true);
    } else {
      stopRecording();
      setIsRecording(false);
    }
  };

  // empty array makes sure that useEffect only run once
  useEffect(() => {
    getAllVideos();
    // eslint-disable-next-line
  }, []);

  const discardVideo = () => {
    setUploading(false);
    setCapturedVideo(null);
    setVideoPreview(null);
  };
  const deleteSelectedVideo = (videoUrl) => {
    // eslint-disable-next-line
    var matches = videoUrl.match(/\/([^\/?#]+)[^\/]*$/);
    let filename = null;
    if (matches.length > 1) {
      filename = matches[1].substring(matches[1].search("react_pwa"));
    }
    if (offline) {
      toast("PLease try again once internet connection is detected");
    } else if (filename) {
      // Create a reference to the file to delete
      const desertRef = ref(storage, "videos/" + filename);

      // Delete the file
      deleteObject(desertRef)
        .then(() => {
          // File deleted successfully
          dispatch({ type: "remove", payload: videoUrl });
          toast("Video deleted");
        })
        .catch((error) => {
          // Uh-oh, an error occurred!
          toast("Error occured, try again later");
        });
    } else {
      toast("Error occured, try again later");
    }
  };

  const uploadVideo = () => {
    // create a random string with a prefix
    const prefix = "react_pwa_";
    // create random string
    const rs = Date.now();
    if (offline) {
      toast("you're using in offline mode");
      localStorage.setItem(`${prefix}${rs}`, capturedVideo);
      toast(
        "Video saved locally, it will be uploaded to Firebase once internet connection is detected"
      );

      discardVideo();
    } else {
      setUploading(true);
      const storageRef = ref(storage, `/videos/${prefix}${rs}.mp4`);
      // progress can be paused and resumed. It also exposes progress updates.
      // Receives the storage reference and the file to upload.
      uploadBytes(storageRef, capturedVideo)
        .then((snapshot) => {
          updateVideos(storageRef);
          discardVideo();
          toast("Video Uploaded to Firebase");
        })
        .catch(() => {
          toast("Sorry, we encountered an error uploading your video");
        });
    }
  };

  const updateVideos = async (ref) => {
    try {
      const url = await getDownloadURL(ref);
      dispatch({ type: "append", payload: url });
    } catch (error) {
      toast("Error occured, try again later");
    }
  };

  const getAllVideos = async () => {
    const listRef = ref(storage, "videos");
    try {
      const res = await listAll(listRef);
      res.items.forEach(async (itemRef) => {
        // All the items under listRef.
        updateVideos(itemRef);
      });
    } catch (error) {
      toast("Error occured, try again later");
    }
  };

  useEffect(() => {
    if (mediaBlobUrl) setVideoPreview(mediaBlobUrl);
  }, [mediaBlobUrl]);

  const uploadingStatus = uploading ? (
    <div>
      <p> Uploading Video, please wait ... </p>
    </div>
  ) : (
    <span />
  );
  const gallery = allVideos?.map((item, i) => (
    <div
      key={i}
      className="flex flex-wrap sm:w-1/2 md:w-1/3 w-full justify-end"
    >
      <button
        type="button"
        aria-label="delete video button"
        className="float-right bg-red-500 rounded-full px-2"
        onClick={() => deleteSelectedVideo(item)}
      >
        X
      </button>

      <div key={i} className="w-full p-2 pt-0">
        <video
          className="block object-cover object-center w-full h-full rounded-lg"
          key={i}
          src={item}
          controls
        />
      </div>
    </div>
  ));

  return (
    <div className="container mx-auto px-4 justify-center items-center">
      {uploadingStatus}
      <p className="mx-auto max-w-fit font-bold text-lg">{status}</p>
      <div className="flex w-full justify-end">
        <button
          type="button"
          aria-label="toggle recorder button"
          className="m-5 p-2 text-white rounded-full border-2 border-orange-300"
          onClick={toggleRecording}
        >
          <img
            src={isRecording ? "pause128.png" : "play128.png"}
            alt="icon recording status 128px"
            className="h-6 w-6"
            height="24"
            width="24"
          />
        </button>
      </div>

      {capturedVideo && (
        <>
          <video src={videoPreview} controls autoPlay className="mx-auto" />
          <div className="flex justify-center items-center space-x-2 py-4">
            <button
              type="button"
              aria-label="discard recorded video button"
              className="mt-5 p-2 pl-5 pr-5 bg-orange-600 text-white rounded"
              onClick={discardVideo}
            >
              Delete Video
            </button>
            <button
              type="button"
              aria-label="upload recorded video button"
              className="mt-5 p-2 pl-5 pr-5 bg-blue-700 text-white rounded"
              onClick={uploadVideo}
            >
              Upload Video
            </button>
          </div>
        </>
      )}
      <h3 className="mt-16 font-bold mb-8">List uploaded videos</h3>
      <div className="flex flex-wrap -m-1 md:-m-2">{gallery}</div>
    </div>
  );
};

export default Videos;
