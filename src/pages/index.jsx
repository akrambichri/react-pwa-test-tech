import React from "react";

const Home = () => {
  return (
    <>
      <div className="bg-indigo-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">React JS PWA App.</span>
            <span className="block">
              Test de développement FrontEnd pour DELTA PROCESS.
            </span>
          </h2>
          <p className="mt-4 text-2xl leading-6 text-white font-bold pt-8 pb-4 ">
            Objectifs
          </p>
          <div className="flex justify-center">
            <ul className="list-none text-left text-white text-lg">
              <li>
                Comprendre les méthodes de développement utilisées par le
                candidat
              </li>
              <li> Mesurer la qualité du code produit </li>
              <li>
                Evaluer la capacité à créer une PWA et à gérer le son et
                l’image.
              </li>
              <li> Qualifier l’usage raisonné des librairies tierce </li>
              <li> Evaluer la capacité de travail </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gray-600">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Bibliothèques choisies dans ce projet</span>
          </h2>

          <div className="flex justify-center py-8">
            <ul className="list-none text-left text-white text-lg">
              <li className="py-6">
                The Create react app PWA template (cra-template-pwa)
              </li>
              <li className="py-6">
                API WebRTC Pour l'appareil photo, on utilise
                navigator.mediaDevices.getUserMedia() pour capturer MediaStream,
                puis dessine la photo sur une canvas
              </li>
              <li className="py-6">
                react-media-recorder est un composant de react avec render prop,
                ou react hook, qui peut être utilisé pour enregistrer de
                l'audio/vidéo à l'aide de l'API MediaRecorder.
                <br /> L'interface MediaRecorder de l'API MediaStream Recording
                fournit des fonctionnalités permettant d'enregistrer facilement
                des médias.
              </li>
              <li className="py-6">
                Cloud Storage pour Firebase, pour télécharger les médias
                capturés et les lister plus tard
              </li>
              <li className="py-6">
                TailwindCss Pour un cadre de style pour faciliter le style des
                composants et des pages
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
