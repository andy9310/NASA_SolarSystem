// import * as THREE from 'three'
// var MoonURL = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/lroc_color_poles_1k.jpg"; 
// var MoonsurfaceURL = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/ldem_3_8bit.jpg"; 
// var galaxyURL = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/hipp8_s.jpg"

// export function Moon(){
//   const moon_geometry = new THREE.SphereGeometry( 2,60,60 );
//   var textureLoader = new THREE.TextureLoader();
//   var moon_texture = textureLoader.load( MoonURL );
//   var moon_surface = textureLoader.load(MoonsurfaceURL);
//   var background  = textureLoader.load(galaxyURL)
//   const moon_material = new THREE.MeshPhongMaterial({color: 'rgb(255, 255, 255)', map: moon_texture, displacementMap: moon_surface, displacementScale: 0.06, bumpMap: moon_surface, bumpScale:0.04})
//   const moon = new THREE.Mesh(moon_geometry, moon_material)
//   moon.position.set(10,10,0);
//   return moon
// }

  // planets.forEach((planet) => {
  //   // Update orbital elements
  //   const a = planet.a[0] + planet.a[1] * T;
  //   const e = planet.e[0] + planet.e[1] * T;
  //   const I = planet.I[0] + planet.I[1] * T;
  //   const L = planet.L[0] + planet.L[1] * T;
  //   const longPeri = planet.longPeri[0] + planet.longPeri[1] * T;
  //   const longNode = planet.longNode[0] + planet.longNode[1] * T;

  //   // Mean anomaly M = L - longPeri
  //   let M = L - longPeri;
  //   M = deg2rad(M % 360);

  //   // Solve Kepler's Equation
  //   const E = solveKepler(M, e);

  //   // True anomaly
  //   const ν = 2 * Math.atan2(
  //     Math.sqrt(1 + e) * Math.sin(E / 2),
  //     Math.sqrt(1 - e) * Math.cos(E / 2)
  //   );

  //   // Distance r
  //   const r = a * (1 - e * Math.cos(E));

  //   // Heliocentric coordinates in orbital plane
  //   const x_orb = r * Math.cos(ν);
  //   const y_orb = r * Math.sin(ν);

  //   // Convert to 3D space
  //   const cosI = Math.cos(deg2rad(I));
  //   const sinI = Math.sin(deg2rad(I));
  //   const cosNode = Math.cos(deg2rad(longNode));
  //   const sinNode = Math.sin(deg2rad(longNode));
  //   const cosPeri = Math.cos(deg2rad(longPeri - longNode));
  //   const sinPeri = Math.sin(deg2rad(longPeri - longNode));

  //   const x_ec =
  //     x_orb * (cosNode * cosPeri - sinNode * sinPeri * cosI) -
  //     y_orb * (cosNode * sinPeri + sinNode * cosPeri * cosI);
  //   const y_ec =
  //     x_orb * (sinNode * cosPeri + cosNode * sinPeri * cosI) -
  //     y_orb * (sinNode * sinPeri - cosNode * cosPeri * cosI);
  //   const z_ec = x_orb * (sinPeri * sinI) + y_orb * (cosPeri * sinI);

  //   // Scale positions for visualization
  //   const scale = 20;
  //   const position = new THREE.Vector3(
  //     x_ec * scale,
  //     y_ec * scale,
  //     z_ec * scale
  //   );

  //   // Create planet mesh
  //   const geometry = new THREE.SphereGeometry(planet.size, 32, 32);
  //   const material = new THREE.MeshPhongMaterial({ color: planet.color });
  //   const mesh = new THREE.Mesh(geometry, material);
  //   mesh.position.copy(position);
  //   scene.add(mesh);

  //   // Store mesh for animation updates
  //   planetsMeshes.push({ mesh: mesh, planet: planet });
  // });


import {
  Mesh,
  Color,
  Group,
  DoubleSide,
  RingGeometry,
  TorusGeometry,
  TextureLoader,
  ShaderMaterial,
  SRGBColorSpace,
  AdditiveBlending,
  MeshPhongMaterial,
  MeshBasicMaterial,
  IcosahedronGeometry,
} from "three";
import mercuryPic from "../models/mercury-map.jpg";

export class Planet {
  group;
  loader;
  animate;
  planetGroup;
  planetGeometry;

  constructor({
    orbitSpeed = 1,
    orbitRadius = 1,
    orbitRotationDirection = "clockwise",

    planetSize = 1,
    planetAngle = 0,
    planetRotationSpeed = 1,
    planetRotationDirection = "clockwise",
    planetTexture = mercuryPic,

    rimHex = 0x0088ff,
    facingHex = 0x000000,

    rings = null,
  } = {}) {
    this.orbitSpeed = orbitSpeed;
    this.orbitRadius = orbitRadius;
    this.orbitRotationDirection = orbitRotationDirection;

    this.planetSize = planetSize;
    this.planetAngle = planetAngle;
    this.planetTexture = planetTexture;
    this.planetRotationSpeed = planetRotationSpeed;
    this.planetRotationDirection = planetRotationDirection;

    this.rings = rings;

    this.group = new Group();
    this.planetGroup = new Group();
    this.loader = new TextureLoader();
    this.planetGeometry = new IcosahedronGeometry(this.planetSize, 12);

    this.createOrbit();
    this.createRings();
    this.createPlanet();
    this.createGlow(rimHex, facingHex);

    this.animate = this.createAnimateFunction();
    this.animate();
  }

  createOrbit() {
    const orbitGeometry = new TorusGeometry(this.orbitRadius, 0.01, 100);
    const orbitMaterial = new MeshBasicMaterial({
      color: 0xadd8e6,
      side: DoubleSide,
    });
    const orbitMesh = new Mesh(orbitGeometry, orbitMaterial);
    orbitMesh.rotation.x = Math.PI / 2;
    this.group.add(orbitMesh);
  }

  createPlanet() {
    const map = this.loader.load(this.planetTexture);
    const planetMaterial = new MeshPhongMaterial({ map });
    planetMaterial.map.colorSpace = SRGBColorSpace;
    const planetMesh = new Mesh(this.planetGeometry, planetMaterial);
    this.planetGroup.add(planetMesh);
    this.planetGroup.position.x = this.orbitRadius - this.planetSize / 9;
    this.planetGroup.rotation.z = this.planetAngle;
    this.group.add(this.planetGroup);
  }

  createGlow(rimHex, facingHex) {
    const uniforms = {
      color1: { value: new Color(rimHex) },
      color2: { value: new Color(facingHex) },
      fresnelBias: { value: 0.2 },
      fresnelScale: { value: 1.5 },
      fresnelPower: { value: 4.0 },
    };

    const vertexShader = `
    uniform float fresnelBias;
    uniform float fresnelScale;
    uniform float fresnelPower;

    varying float vReflectionFactor;

    void main() {
      vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
      vec4 worldPosition = modelMatrix * vec4( position, 1.0 );

      vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );

      vec3 I = worldPosition.xyz - cameraPosition;

      vReflectionFactor = fresnelBias + fresnelScale * pow( 1.0 + dot( normalize( I ), worldNormal ), fresnelPower );

      gl_Position = projectionMatrix * mvPosition;
    }
    `;

    const fragmentShader = `
      uniform vec3 color1;
      uniform vec3 color2;

      varying float vReflectionFactor;

      void main() {
        float f = clamp( vReflectionFactor, 0.0, 1.0 );
        gl_FragColor = vec4(mix(color2, color1, vec3(f)), f);
      }
    `;

    const planetGlowMaterial = new ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: AdditiveBlending,
    });
    const planetGlowMesh = new Mesh(this.planetGeometry, planetGlowMaterial);
    planetGlowMesh.scale.setScalar(1.1);
    this.planetGroup.add(planetGlowMesh);
  }

  createRings() {
    if (!this.rings) return;

    const innerRadius = this.planetSize + 0.1;
    const outerRadius = innerRadius + this.rings.ringsSize;

    const ringsGeometry = new RingGeometry(innerRadius, outerRadius, 32);

    const ringsMaterial = new MeshBasicMaterial({
      side: DoubleSide,
      transparent: true,
      map: this.loader.load(this.rings.ringsTexture),
    });

    const ringMeshs = new Mesh(ringsGeometry, ringsMaterial);
    ringMeshs.rotation.x = Math.PI / 2;
    this.planetGroup.add(ringMeshs);
  }

  createAnimateFunction() {
    return () => {
      requestAnimationFrame(this.animate);

      this.updateOrbitRotation();
      this.updatePlanetRotation();
    };
  }

  updateOrbitRotation() {
    if (this.orbitRotationDirection === "clockwise") {
      this.group.rotation.y -= this.orbitSpeed;
    } else if (this.orbitRotationDirection === "counterclockwise") {
      this.group.rotation.y += this.orbitSpeed;
    }
  }

  updatePlanetRotation() {
    if (this.planetRotationDirection === "clockwise") {
      this.planetGroup.rotation.y -= this.planetRotationSpeed;
    } else if (this.planetRotationDirection === "counterclockwise") {
      this.planetGroup.rotation.y += this.planetRotationSpeed;
    }
  }

  getPlanet() {
    return this.group;
  }
}