
var CONS = {
        // THREE.JS CONSTANTS
        // set the scene size
        WIDTH:800,
        HEIGHT:800,

        // set some camera attributes
        VIEW_ANGLE:45,
        NEAR:0.3,
        FAR:2000,

        CAMERA_X:1300,
        CAMERA_Y:600,
        CAMERA_Z:800
    }

    var scene = {};
    var renderer = {};
    var camera = {};
    var controls;


    var n = 0;
   

    // Wait until everything is loaded before continuing
    function loaded() {
        n++;
        console.log("loaded: " + n);

        if (n >= 3) {
            terrain.visible = true;
            render();
        }
    }

    function initMap() {

        // setup default three.js stuff
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(CONS.WIDTH, CONS.HEIGHT);
        renderer.setClearColor(0xc6e2ff);
        $("#main_map").append(renderer.domElement);

        camera = new THREE.PerspectiveCamera(CONS.VIEW_ANGLE, CONS.WIDTH / CONS.HEIGHT, CONS.NEAR, CONS.FAR);
        scene = new THREE.Scene();
        scene.add(camera);

        camera.position.z = CONS.CAMERA_Z;
        camera.position.x = CONS.CAMERA_X;
        camera.position.y = CONS.CAMERA_Y;
        camera.lookAt(scene.position);

        // add a light
        pointLight = new THREE.PointLight(0xFFFFFF);
        scene.add(pointLight);
        pointLight.position.x = 1000;
        pointLight.position.y = 3000;
        pointLight.position.z = -1000;
        pointLight.intensity = 8;


        // load the heightmap we created as a texture
//     var texture = THREE.ImageUtils.loadTexture('assets/heightmap/SRTM_US_scaled_512.jpg', null, loaded);
//         var img = $("#heightmap").val;
        var texture = THREE.ImageUtils.loadTexture(img, null, loaded);

        // load two other textures we'll use to make the map look more real
        var detailTexture = THREE.ImageUtils.loadTexture("assets/bg.jpg", null, loaded);


        // the following configuration defines how the terrain is rendered
        var terrainShader = THREE.ShaderTerrain[ "terrain" ];
        var uniformsTerrain = THREE.UniformsUtils.clone(terrainShader.uniforms);

        // how to treat abd scale the normal texture
        uniformsTerrain[ "tNormal" ].texture = detailTexture;
        uniformsTerrain[ "uNormalScale" ].value = 3;

        // the displacement determines the height of a vector, mapped to
        // the heightmap
        uniformsTerrain[ "tDisplacement" ].texture = texture;
        uniformsTerrain[ "uDisplacementScale" ].value = 250;

        // the following textures can be use to finetune how
        // the map is shown. These are good defaults for simple
        // rendering
        uniformsTerrain[ "tDiffuse1" ].texture = detailTexture;
        uniformsTerrain[ "tDetail" ].texture = detailTexture;
        uniformsTerrain[ "enableDiffuse1" ].value = true;
        uniformsTerrain[ "enableDiffuse2" ].value = true;
        uniformsTerrain[ "enableSpecular" ].value = true;

        // diffuse is based on the light reflection
        uniformsTerrain[ "uDiffuseColor" ].value.setHex(0xcccccc);
        uniformsTerrain[ "uSpecularColor" ].value.setHex(0x0D8163);
        // is the base color of the terrain
        uniformsTerrain[ "uAmbientColor" ].value.setHex(0x0000cc);

        // how shiny is the terrain
        uniformsTerrain[ "uShininess" ].value = 3;

        // handles light reflection
        uniformsTerrain[ "uRepeatOverlay" ].value.set(6, 6);

        var ambient = 0x000000, diffuse = 0x000000, specular = 0x000000, shininess = 0.0, scale = 100;
      
        var shader = THREE.ShaderLib[ "normalmap" ];
        uniforms = THREE.UniformsUtils.clone( shader.uniforms );

        uniforms[ "enableDisplacement" ].value = true;
        uniforms[ "enableDiffuse" ].value = 0;
        uniforms[ "tDiffuse" ].value = diffTexture;
        uniforms[ "tDiffuseOpacity" ] = { type: 'f', value: 1.0 };

        uniforms[ "tDisplacement" ] = { type: 't', value: dispTexture};
        uniforms[ "uDisplacementScale" ].value = 100;
        uniforms[ "uAmbientColor" ].value = new THREE.Color( ambient );
        // uniforms[ "uPointLightColor" ] = {type: "c", value: new THREE.Color( pointLight.color )};
        // uniforms[ "uAmbientLightColor" ] = {type: "c", value: new THREE.Color( ambientLight.color )};

        uniforms[ "uDisplacementPostScale" ] = {type: 'f', value: 100 };
        uniforms[ "p2x" ] = {type: 'f', value: 0.0 };
        uniforms[ "p2y" ] = {type: 'f', value: 0.0 };
        uniforms[ "p3x" ] = {type: 'f', value: 1.0 };
        uniforms[ "p3y" ] = {type: 'f', value: 1.0 };

        uniforms[ "uDiffuseColor" ].value = new THREE.Color( diffuse );
        uniforms[ "uSpecularColor" ].value = new THREE.Color( specular );
        uniforms[ "uAmbientColor" ].value = new THREE.Color( ambient );
        uniforms[ "uShininess" ].value = shininess;
      
        // configure the material that reflects our terrain
        var material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: document.getElementById( 'vertex_shader' ).textContent,
            fragmentShader: document.getElementById( 'fragment_shader' ).textContent,
            side: THREE.DoubleSide
        });

        // we use a plain to render as terrain
        var geometryTerrain = new THREE.PlaneGeometry(800, 800, 256, 256);
        geometryTerrain.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI / 2));
        geometryTerrain.computeFaceNormals();
        geometryTerrain.computeVertexNormals();
        geometryTerrain.computeTangents();

        // create a 3D object to add
        terrain = new THREE.Mesh(geometryTerrain, material);
        terrain.position.set(0, -125, 0);
        terrain.rotation.x = -Math.PI / 2;

        // add the terrain
        scene.add(terrain);

        // tell everything is ready
        loaded();
    }

//    // render the scene
//    function render() {
//        renderer.render(scene, camera);
//    }


    function render() {
        var timer = Date.now() * 0.0003;
        camera.position.x = (Math.cos( timer ) *  CONS.CAMERA_X);
        camera.position.z = (Math.sin( timer ) *  CONS.CAMERA_Z) ;
        camera.lookAt( scene.position );

        renderer.render( scene, camera );
        requestAnimationFrame( render );
    }