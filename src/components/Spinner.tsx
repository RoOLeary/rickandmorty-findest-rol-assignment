// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { EffectComposer, Pass } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const Spinner = () => {
  const mountRef = useRef(null);
  const [options, setOptions] = useState({
    exposure: 2.8,
    bloomStrength: 2.39,
    bloomThreshold: 0,
    bloomRadius: 0.38,
    color0: [1, 5, 1],
    color1: [2, 20, 2],
    color2: [44, 97, 15],
    color3: [14, 28, 5],
    color4: [255, 255, 255],
    color5: [74, 145, 0],
  });

  useEffect(() => {
    let scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.WebGLRenderer, controls, composer: EffectComposer, bloomPass: Pass, material: THREE.ShaderMaterial;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const vert = `/* vertex shader code */`;
    const frag = `/* fragment shader code */`;

    const init = () => {
      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        10000
      );
      camera.position.set(2.8, -3.2, 3.47);

      renderer = new THREE.WebGLRenderer();
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.autoClear = false;

      // Attach renderer to the DOM
      mountRef.current.appendChild(renderer.domElement);

      controls = new OrbitControls(camera, renderer.domElement);
      controls.update();

      material = new THREE.ShaderMaterial({
        uniforms: {
          time: { type: "f", value: 0.0 },
          perlinnoise: {
            type: "t",
            value: new THREE.TextureLoader().load(
              "https://raw.githubusercontent.com/pizza3/asset/master/noise9.png"
            ),
          },
          // Other textures here...
          color0: { value: new THREE.Vector3(...options.color0) },
          color1: { value: new THREE.Vector3(...options.color1) },
          color2: { value: new THREE.Vector3(...options.color2) },
          color3: { value: new THREE.Vector3(...options.color3) },
          color4: { value: new THREE.Vector3(...options.color4) },
          color5: { value: new THREE.Vector3(...options.color5) },
          resolution: { value: new THREE.Vector2(width, height) },
        },
        fragmentShader: frag,
        vertexShader: vert,
      });

      const renderScene = new RenderPass(scene, camera);

      bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        options.bloomStrength,
        options.bloomRadius,
        options.bloomThreshold
      );

      composer = new EffectComposer(renderer);
      composer.addPass(renderScene);
      composer.addPass(bloomPass);

      generateMesh();
      animate();
    };

    const generateMesh = () => {
      const planeGeometry = new THREE.PlaneGeometry(5, 5, 1, 1);
      const plane = new THREE.Mesh(planeGeometry, material);
      scene.add(plane);
    };

    const updateDraw = (deltaTime: number) => {
      material.uniforms.time.value = deltaTime / 5000;
      material.uniforms.color0.value = new THREE.Vector3(...options.color0);
      material.uniforms.color1.value = new THREE.Vector3(...options.color1);
      material.uniforms.color2.value = new THREE.Vector3(...options.color2);
      material.uniforms.color3.value = new THREE.Vector3(...options.color3);
      material.uniforms.color4.value = new THREE.Vector3(...options.color4);
      material.uniforms.color5.value = new THREE.Vector3(...options.color5);

      bloomPass.threshold = options.bloomThreshold;
      bloomPass.strength = options.bloomStrength;
      bloomPass.radius = options.bloomRadius;
    };

    const animate = () => {
      requestAnimationFrame(animate);
      const deltaTime = performance.now();
      updateDraw(deltaTime);
      composer.render();
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize, false);

    init();

    // Cleanup function
    return () => {
      mountRef.current.removeChild(renderer.domElement);
      window.removeEventListener("resize", handleResize);
    };
  }, [options]);

  return <div ref={mountRef} style={{ width: "100vw", height: "100vh" }} />;
};

export default Spinner;
