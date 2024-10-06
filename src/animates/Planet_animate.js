function animate(){
  const controls = new OrbitControls(camera, renderer.domElement);
  
    requestAnimationFrame(animate);
    torus.rotation.x += 0.01;
    torus.rotation.y += 0.005;
    torus.rotation.z += 0.01;
    moon.rotation.y += 0.002;
    moon.rotation.x += 0.0001;
    controls.update();
    renderer.render(scene, camera);
}

function animate() {
    requestAnimationFrame(animate);
  
    // Update time for planet positions
    const now = new Date();
    const jd = getJulianDate(now.getTime());
    const T = getJulianCenturies(jd);
  
    planetsMeshes.forEach((obj) => {
      const { mesh, planet } = obj;
  
      // Update orbital elements
      const a = planet.a[0] + planet.a[1] * T;
      const e = planet.e[0] + planet.e[1] * T;
      const I = planet.I[0] + planet.I[1] * T;
      const L = planet.L[0] + planet.L[1] * T;
      const longPeri = planet.longPeri[0] + planet.longPeri[1] * T;
      const longNode = planet.longNode[0] + planet.longNode[1] * T;
  
      // Mean anomaly M = L - longPeri
      let M = L - longPeri;
      M = deg2rad(M % 360);
  
      // Solve Kepler's Equation
      const E = solveKepler(M, e);
  
      // True anomaly
      const ν = 2 * Math.atan2(
        Math.sqrt(1 + e) * Math.sin(E / 2),
        Math.sqrt(1 - e) * Math.cos(E / 2)
      );
  
      // Distance r
      const r = a * (1 - e * Math.cos(E));
  
      // Heliocentric coordinates in orbital plane
      const x_orb = r * Math.cos(ν);
      const y_orb = r * Math.sin(ν);
  
      // Convert to 3D space
      const cosI = Math.cos(deg2rad(I));
      const sinI = Math.sin(deg2rad(I));
      const cosNode = Math.cos(deg2rad(longNode));
      const sinNode = Math.sin(deg2rad(longNode));
      const cosPeri = Math.cos(deg2rad(longPeri - longNode));
      const sinPeri = Math.sin(deg2rad(longPeri - longNode));
  
      const x_ec =
        x_orb * (cosNode * cosPeri - sinNode * sinPeri * cosI) -
        y_orb * (cosNode * sinPeri + sinNode * cosPeri * cosI);
      const y_ec =
        x_orb * (sinNode * cosPeri + cosNode * sinPeri * cosI) -
        y_orb * (sinNode * sinPeri - cosNode * cosPeri * cosI);
      const z_ec = x_orb * (sinPeri * sinI) + y_orb * (cosPeri * sinI);
  
      // Scale positions
      const scale = 20;
      const position = new THREE.Vector3(
        x_ec * scale,
        y_ec * scale,
        z_ec * scale
      );
  
      // Update planet position
      mesh.position.copy(position);
  
      // Rotate planet on its axis
      mesh.rotation.y += 0.01;
    });
  
    controls.update();
    renderer.render(scene, camera);
  }