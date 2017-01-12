
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
        // console.log("loaded: " + n);

        if (n >= 3) {
            terrain.visible = true;
            render();
        }
    }

    function initMap() {
        $("#status_text").html("<i class='fa fa-refresh fa-spin'></i> Načítavam 3D Mapu");

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

        // configure the material that reflects our terrain
        var material = new THREE.ShaderMaterial({
            uniforms:uniformsTerrain,
            vertexShader:terrainShader.vertexShader,
            fragmentShader:terrainShader.fragmentShader,
            lights:true,
            fog:false
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
        $("#status_text").html("<i class='fa fa-check'></i> 3D Mapa načítaná");
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
