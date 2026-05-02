import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

var GlobeRenderer = {
  scene: null,
  camera: null,
  renderer: null,
  controls: null,
  earth: null,
  atmosphere: null,
  terrainGroup: null,
  clock: new THREE.Clock(),

  EARTH_RADIUS: 50,
  EARTH_REAL_RADIUS_M: 6371000,
  MAX_SEGMENTS: 320,

  get scaleFactor() {
    return this.EARTH_RADIUS / this.EARTH_REAL_RADIUS_M;
  },

  TILE_SIZE: 256,
  TERRARIUM_BASE: 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium',

  loadedTiles: {},
  MAX_TILES: 60,

  DISPLACEMENT_TOPOLOGY_RANGE_M: 9000,

  init: function (container) {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 2000);
    this.camera.position.set(0, 30, 120);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.minDistance = 55;
    this.controls.maxDistance = 500;
    this.controls.rotateSpeed = 0.5;
    this.controls.zoomSpeed = 1.2;
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  },

  createLighting: function () {
    var ambientLight = new THREE.AmbientLight(0x333355, 1.5);
    this.scene.add(ambientLight);

    var sunLight = new THREE.DirectionalLight(0xffffff, 3.5);
    sunLight.position.set(100, 50, 80);
    this.scene.add(sunLight);

    var fillLight = new THREE.DirectionalLight(0x4466aa, 0.8);
    fillLight.position.set(-50, -10, -30);
    this.scene.add(fillLight);
  },

  createStars: function () {
    var starsGeo = new THREE.BufferGeometry();
    var starCount = 3000;
    var positions = new Float32Array(starCount * 3);
    var colors = new Float32Array(starCount * 3);

    for (var i = 0; i < starCount; i++) {
      var theta = Math.random() * Math.PI * 2;
      var phi = Math.acos(2 * Math.random() - 1);
      var radius = 800 + Math.random() * 200;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      var brightness = 0.5 + Math.random() * 0.5;
      var tint = Math.random();
      if (tint < 0.1) {
        colors[i * 3] = brightness;
        colors[i * 3 + 1] = brightness * 0.85;
        colors[i * 3 + 2] = brightness * 0.7;
      } else if (tint < 0.2) {
        colors[i * 3] = brightness * 0.7;
        colors[i * 3 + 1] = brightness * 0.8;
        colors[i * 3 + 2] = brightness;
      } else {
        colors[i * 3] = brightness;
        colors[i * 3 + 1] = brightness;
        colors[i * 3 + 2] = brightness;
      }
    }

    starsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starsGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    var starsMat = new THREE.PointsMaterial({
      size: 0.8,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
    });

    var stars = new THREE.Points(starsGeo, starsMat);
    this.scene.add(stars);
  },

  createAtmosphere: function () {
    var atmosGeo = new THREE.SphereGeometry(this.EARTH_RADIUS + 1.8, 64, 64);

    var vertexShader = `
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPos.xyz;
        vNormal = normalize(mat3(modelMatrix) * normal);
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    var fragmentShader = `
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vWorldPosition;
      uniform vec3 uViewDirection;

      void main() {
        vec3 viewDir = normalize(cameraPosition - vWorldPosition);
        float intensity = pow(0.72 - dot(vNormal, viewDir), 4.0);
        float alpha = clamp(intensity * 0.9, 0.0, 0.7);

        vec3 atmosColor = mix(vec3(0.3, 0.6, 1.0), vec3(0.5, 0.8, 1.0), intensity);
        gl_FragColor = vec4(atmosColor, alpha);
      }
    `;

    var atmosMat = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
      depthWrite: false,
      transparent: true,
    });

    this.atmosphere = new THREE.Mesh(atmosGeo, atmosMat);
    this.scene.add(this.atmosphere);
  },

  createEarth: function () {
    var geo = new THREE.SphereGeometry(this.EARTH_RADIUS, this.MAX_SEGMENTS, this.MAX_SEGMENTS);

    var textureLoader = new THREE.TextureLoader();

    var colorMap = textureLoader.load('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg');
    colorMap.colorSpace = THREE.SRGBColorSpace;

    var dispMap = textureLoader.load('https://unpkg.com/three-globe/example/img/earth-topology.png');

    var realDispScale = this.DISPLACEMENT_TOPOLOGY_RANGE_M * this.scaleFactor;

    var mat = new THREE.MeshStandardMaterial({
      map: colorMap,
      displacementMap: dispMap,
      displacementScale: realDispScale,
      displacementBias: -realDispScale * 0.02,
      roughness: 0.85,
      metalness: 0.05,
    });

    this.earth = new THREE.Mesh(geo, mat);
    this.scene.add(this.earth);

    this.terrainGroup = new THREE.Group();
    this.scene.add(this.terrainGroup);
  },

  latLonToXYZ: function (lat, lon, radius) {
    var phi = (90 - lat) * Math.PI / 180;
    var theta = (lon + 180) * Math.PI / 180;
    return {
      x: -radius * Math.sin(phi) * Math.cos(theta),
      y: radius * Math.cos(phi),
      z: radius * Math.sin(phi) * Math.sin(theta),
    };
  },

  xyzToLatLon: function (x, y, z) {
    var radius = Math.sqrt(x * x + y * y + z * z);
    var lat = 90 - Math.acos(y / radius) * 180 / Math.PI;
    var lon = -Math.atan2(z, x) * 180 / Math.PI;
    return { lat: lat, lon: lon };
  },

  getTileKey: function (z, x, y) {
    return z + '/' + x + '/' + y;
  },

  loadTerrainTile: function (z, x, y) {
    var self = this;
    var key = this.getTileKey(z, x, y);
    if (self.loadedTiles[key]) return self.loadedTiles[key];

    while (Object.keys(self.loadedTiles).length > self.MAX_TILES) {
      var oldestKey = Object.keys(self.loadedTiles)[0];
      self._removeTile(oldestKey);
    }

    var url = self.TERRARIUM_BASE + '/' + key + '.png';
    var promise = new Promise(function (resolve) {
      var img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = function () {
        try {
          var canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          var ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          var imageData = ctx.getImageData(0, 0, img.width, img.height);
          var data = imageData.data;
        } catch (e) {
          resolve(null);
          return;
        }

        var tileSize = self.TILE_SIZE;
        var nLon = Math.pow(2, z);
        var tileLonMin = (x / nLon) * 360 - 180;
        var tileLonMax = ((x + 1) / nLon) * 360 - 180;
        var tileLatMax = (1 - y / nLon) * 180 - 90;
        var tileLatMin = (1 - (y + 1) / nLon) * 180 - 90;

        var sampleStep = 2;
        var cols = Math.floor(tileSize / sampleStep);
        var rows = Math.floor(tileSize / sampleStep);
        var planeWidth = 256;
        var planeHeight = 256;

        var planeGeo = new THREE.PlaneGeometry(planeWidth, planeHeight, cols - 1, rows - 1);
        var positions = planeGeo.attributes.position;

        var elevationData = [];

        for (var py = 0; py < rows; py++) {
          var row = [];
          for (var px = 0; px < cols; px++) {
            var sx = px * sampleStep;
            var sy = py * sampleStep;
            var idx = (sy * tileSize + sx) * 4;
            var h = data[idx] * 256 + data[idx + 1] + data[idx + 2] / 256 - 32768;
            row.push(h);
          }
          elevationData.push(row);
        }

        for (var py = 0; py < rows; py++) {
          for (var px = 0; px < cols; px++) {
            var idx = py * cols + px;
            var elevationM = elevationData[py][px];
            var displacement = elevationM * self.scaleFactor;

            var u = px / (cols - 1);
            var v = py / (rows - 1);
            var lat = tileLatMin + v * (tileLatMax - tileLatMin);
            var lon = tileLonMin + u * (tileLonMax - tileLonMin);

            var pos = self.latLonToXYZ(lat, lon, self.EARTH_RADIUS + 0.2);
            positions.setXYZ(idx, pos.x, pos.y, pos.z);

            var mag = Math.sqrt(pos.x * pos.x + pos.y * pos.y + pos.z * pos.z);
            var dispX = pos.x / mag * displacement;
            var dispY = pos.y / mag * displacement;
            var dispZ = pos.z / mag * displacement;

            positions.setXYZ(idx, pos.x + dispX, pos.y + dispY, pos.z + dispZ);
          }
        }

        planeGeo.computeVertexNormals();

        var colorsArr = new Float32Array(positions.count * 3);
        for (var i = 0; i < positions.count; i++) {
          var px2 = positions.getX(i);
          var py2 = positions.getY(i);
          var pz2 = positions.getZ(i);
          var mag2 = Math.sqrt(px2 * px2 + py2 * py2 + pz2 * pz2);
          var nx = px2 / mag2;
          var ny = py2 / mag2;
          var nz = pz2 / mag2;
          colorsArr[i * 3] = nx * 0.5 + 0.5;
          colorsArr[i * 3 + 1] = ny * 0.5 + 0.5;
          colorsArr[i * 3 + 2] = nz * 0.5 + 0.5;
        }
        planeGeo.setAttribute('color', new THREE.BufferAttribute(colorsArr, 3));

        var planeMat = new THREE.MeshStandardMaterial({
          vertexColors: true,
          roughness: 0.8,
          metalness: 0.1,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.7,
        });

        var planeMesh = new THREE.Mesh(planeGeo, planeMat);
        planeMesh.userData = { tileKey: key, z: z };
        resolve(planeMesh);
      };

      img.onerror = function () {
        resolve(null);
      };
      img.src = url;
    });

    self.loadedTiles[key] = promise;
    return promise;
  },

  getVisibleTiles: function (zoomLevel) {
    var tiles = [];
    var self = this;

    var cameraPos = this.camera.position;
    var cameraDir = new THREE.Vector3();
    this.camera.getWorldDirection(cameraDir);
    cameraDir.normalize();

    var nLon = Math.pow(2, zoomLevel);

    var samples = 16;
    for (var i = 0; i < samples; i++) {
      for (var j = 0; j < samples; j++) {
        var u = (i / (samples - 1) - 0.5) * 2;
        var v = (j / (samples - 1) - 0.5) * 2;

        var rayOrigin = new THREE.Vector3(
          cameraPos.x + u * 80,
          cameraPos.y + v * 80,
          cameraPos.z
        );

        var rayDir = this.camera.position.clone().sub(new THREE.Vector3(0, 0, 0)).normalize().multiplyScalar(-1);
        var raycaster = new THREE.Raycaster(rayOrigin, rayDir, 0, 500);

        var intersects = raycaster.intersectObject(this.earth);
        if (intersects.length > 0) {
          var point = intersects[0].point;
          var ll = this.xyzToLatLon(point.x, point.y, point.z);

          var tx = Math.floor((ll.lon + 180) / 360 * nLon);
          var ty = Math.floor((1 - (ll.lat + 90) / 180) * nLon);

          tx = Math.max(0, Math.min(nLon - 1, tx));
          ty = Math.max(0, Math.min(nLon - 1, ty));

          tiles.push({ z: zoomLevel, x: tx, y: ty });
        }
      }
    }

    var unique = [];
    var seen = {};
    for (var k = 0; k < tiles.length; k++) {
      var t = tiles[k];
      var tk = t.z + '/' + t.x + '/' + t.y;
      if (!seen[tk]) {
        seen[tk] = true;
        unique.push(t);
      }
    }
    return unique;
  },

  _removeTile: function (key) {
    var val = this.loadedTiles[key];
    if (val instanceof Promise) {
      delete this.loadedTiles[key];
      return;
    }
    var mesh = val;
    if (mesh) {
      if (mesh.parent) mesh.parent.remove(mesh);
      if (mesh.geometry) mesh.geometry.dispose();
      if (mesh.material) mesh.material.dispose();
    }
    delete this.loadedTiles[key];
  },

  updateTerrainTiles: function () {
    var dist = this.camera.position.distanceTo(new THREE.Vector3(0, 0, 0));
    var altitudeKm = ((dist - this.EARTH_RADIUS) / this.scaleFactor) / 1000;

    var zoomLevel = 0;
    if (altitudeKm < 200) {
      zoomLevel = 8;
    } else if (altitudeKm < 800) {
      zoomLevel = 6;
    } else if (altitudeKm < 3000) {
      zoomLevel = 4;
    } else {
      this.clearTerrainTiles();
      return;
    }

    var tiles = this.getVisibleTiles(zoomLevel);
    if (tiles.length === 0) return;

    var self = this;
    var currentKeys = {};
    for (var i = 0; i < tiles.length; i++) {
      currentKeys[self.getTileKey(tiles[i].z, tiles[i].x, tiles[i].y)] = true;
    }

    var removeKeys = [];
    for (var key in self.loadedTiles) {
      var tileVal = self.loadedTiles[key];
      if (!currentKeys[key] && !(tileVal instanceof Promise)) {
        removeKeys.push(key);
      }
    }
    for (var j = 0; j < removeKeys.length; j++) {
      self._removeTile(removeKeys[j]);
    }

    for (var k = 0; k < tiles.length; k++) {
      (function (tile) {
        self.loadTerrainTile(tile.z, tile.x, tile.y).then(function (mesh) {
          if (mesh && !mesh.parent) {
            self.terrainGroup.add(mesh);
          }
        });
      })(tiles[k]);
    }
  },

  clearTerrainTiles: function () {
    var keys = Object.keys(this.loadedTiles);
    for (var i = 0; i < keys.length; i++) {
      this._removeTile(keys[i]);
    }
    this.loadedTiles = {};
  },

  updateInfoOverlay: function () {
    var infoEl = document.getElementById('infoOverlay');
    if (!infoEl) return;

    var dist = this.camera.position.distanceTo(new THREE.Vector3(0, 0, 0));
    var altRealKm = ((dist - this.EARTH_RADIUS) / this.scaleFactor) / 1000;

    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2(0, 0);
    raycaster.setFromCamera(mouse, this.camera);
    var intersects = raycaster.intersectObject(this.earth);

    var latStr = '--';
    var lonStr = '--';
    var elevStr = '';
    if (intersects.length > 0) {
      var p = intersects[0].point;
      var ll = this.xyzToLatLon(p.x, p.y, p.z);
      latStr = Math.abs(ll.lat).toFixed(2) + '°' + (ll.lat >= 0 ? 'N' : 'S');
      lonStr = Math.abs(ll.lon).toFixed(2) + '°' + (ll.lon >= 0 ? 'E' : 'W');

      var surfaceDist = p.distanceTo(new THREE.Vector3(0, 0, 0));
      var surfaceElevM = ((surfaceDist - this.EARTH_RADIUS) / this.scaleFactor);
      elevStr = ' <span style="margin:0 12px">|</span><span>⛰ ' + Math.round(surfaceElevM) + ' m</span>';
    }

    infoEl.innerHTML =
      '<span>📍 ' + latStr + ' ' + lonStr + '</span>' +
      elevStr +
      '<span style="margin:0 12px">|</span>' +
      '<span>🔭 高度: ' + Math.round(altRealKm) + ' km</span>';
  },

  animate: function () {
    var self = this;
    var frameCount = 0;

    function loop() {
      requestAnimationFrame(loop);

      self.controls.update();
      self.earth.rotation.y += 0.0001;

      frameCount++;
      if (frameCount % 30 === 0) {
        self.updateTerrainTiles();
      }
      if (frameCount % 10 === 0) {
        self.updateInfoOverlay();
      }

      self.renderer.render(self.scene, self.camera);
    }

    loop();
  },

  handleResize: function () {
    var container = this.renderer.domElement.parentElement;
    if (!container) return;
    var w = container.clientWidth;
    var h = container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  },

  dispose: function () {
    this.clearTerrainTiles();
    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
    }
  }
};

export default GlobeRenderer;
