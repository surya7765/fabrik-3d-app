import { useState, useEffect, useRef } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import {PointerLockControls} from "three/examples/jsm/controls/PointerLockControls";
import {ArcballControls} from "three/examples/jsm/controls/ArcballControls";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

function loadGLTFModel(scene, glbPath, options) {
  const { receiveShadow, castShadow } = options;
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      glbPath,
      (gltf) => {
        const obj = gltf.scene;
        obj.name = "ThreedModel";
        obj.position.y = 0;
        obj.position.x = 0;
        obj.receiveShadow = receiveShadow;
        obj.castShadow = castShadow;
        scene.add(obj);

        obj.traverse(function (child) {
          if (child.isMesh) {
            child.castShadow = castShadow;
            child.receiveShadow = receiveShadow;
          }
        });

        resolve(obj);
      },
      undefined,
      function (error) {
        console.log(error);
        reject(error);
      }
    );
  });
}

// function easeOutCirc(x) {
//   return Math.sqrt(1 - Math.pow(x - 1, 1));
// }

const ThreedModel = (props) => {
  const refContainer = useRef();
  const [loading, setLoading] = useState(true);
  const [renderer, setRenderer] = useState();

  useEffect(() => {
    const { current: container } = refContainer;
    if (container && !renderer) {
      const scW = container.clientWidth;
      const scH = container.clientHeight;
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      renderer.setPixelRatio(window.devicePixelRatio*2);
      renderer.setSize(scW, scH);
      renderer.outputEncoding = THREE.sRGBEncoding;
      // console.log(container);
      container.appendChild(renderer.domElement);
      setRenderer(renderer);

      const scene = new THREE.Scene();
      const scale = 0.5; 
      const camera = new THREE.OrthographicCamera(
        -scale,
        scale,
        scale,
        -scale,
        1,
        500
      );
      const target = new THREE.Vector3(2, 2, 2);
      const initialCameraPosition = new THREE.Vector3(
        20 * Math.sin(0.2 * Math.PI),
        10,
        20 * Math.cos(0.2 * Math.PI)
      );
      const ambientLight = new THREE.AmbientLight(0xcccccc, 5);
      scene.add(ambientLight);
      const controls = new ArcballControls(camera, renderer.domElement,scene);
      controls.autoRotate = true;
      controls.target = target;

      var path = props.path;

      loadGLTFModel(scene, path, {
        receiveShadow: true,
        castShadow: true,
      }).then(() => {
        animate();
        setLoading(false);
      });

      let req = null;
      let frame = 0;
      const animate = () => {
        req = requestAnimationFrame(animate);
        frame = frame <= 100 ? frame + 1 : frame;

        if (frame <= 100) {
          const p = initialCameraPosition;
          // const rotSpeed = easeOutCirc(frame / 200);

          camera.position.y = 100;
          camera.position.x = 100;
          camera.position.z = 100;
          camera.lookAt(target);
        } else {
          controls.update();
        }

        renderer.render(scene, camera);
      };

      return () => {
        cancelAnimationFrame(req);
        renderer.dispose();
      };
    }
  }, []);

  return (
    <div
      style={{
        height: "540px",
        width: "540px",
        position: "relative",
        border: "1px solid #ccc",
      }}
      ref={refContainer}
    >
      {loading && (
        <span style={{ position: "absolute", left: "50%", top: "50%" }}>
          Loading...
        </span>
      )}
    </div>
  );
};

export default function ViewModel(props) {
  return (
    <div style={{ width: "100%", margin: "0 auto" }}>
      <p>Click and hold to move around</p>
      <p>File Path {props.model}</p>
      {typeof props.model === "string" ? (
        <ThreedModel path={props.model} />
      ) : (
        ""
      )}
    </div>
  );
}
