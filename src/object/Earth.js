import {
    Mesh,
    AdditiveBlending,
    MeshBasicMaterial,
    MeshStandardMaterial,
} from "three";
import { Planet } from "./Planets.js";
import earthPic_light from "../models/earth-map-2.jpg";
import earthPic_cloud from "../models/earth-map-3.jpg";
import earthPic_alpha from "../models/earth-map-4.jpg";
  
export class Earth extends Planet {
    constructor(props) {
        super(props);
        this.createPlanetLights();
        this.createPlanetClouds();
    }

    createPlanetLights() {
        const planetLightsMaterial = new MeshBasicMaterial({
        map: this.loader.load(earthPic_light),
        blending: AdditiveBlending,
        });
        const planetLightsMesh = new Mesh(
        this.planetGeometry,
        planetLightsMaterial
        );
        this.planetGroup.add(planetLightsMesh);

        this.group.add(this.planetGroup);
    }

    createPlanetClouds() {
        const planetCloudsMaterial = new MeshStandardMaterial({
            map: this.loader.load(earthPic_cloud),
            transparent: true,
            opacity: 0.8,
            blending: AdditiveBlending,
            alphaMap: this.loader.load(earthPic_alpha),
        });
        const planetCloudsMesh = new Mesh(this.planetGeometry, planetCloudsMaterial);
        planetCloudsMesh.scale.setScalar(1.003);
        this.planetGroup.add(planetCloudsMesh);
        this.group.add(this.planetGroup);
    }
}