"use Strict";
var scene, camera, controls, position;
let renderer;
var body_color = new THREE.Color(parseInt(colorlize_body)) ; //background color
var zoom = 10;
let dae, loader = new THREE.ColladaLoader();
var canvas = document.getElementById('root-main');
var width = canvas.parentNode.offsetWidth;
var height = canvas.parentNode.offsetHeight;
var x, y, z;
var texture = new THREE.Texture();
var manager = new THREE.LoadingManager();
const strDownloadMime = "image/octet-stream";
const base_uri = (window.location.href.includes('/en/') ? "../" : " ");


/* set default object  */
let sandaran_file = base_uri + "storages/3d/chairs/backrest/round.DAE";
let sandaran_texture = base_uri + "storages/textures/jati.jpg";
let bantal_file = base_uri + "storages/3d/chairs/pillow/thin.DAE";
let bantal_texture = base_uri + "storages/textures/batik.jpg";
let kaki_file = base_uri + "storages/3d/chairs/feet/buble.DAE";
let kaki_texture = base_uri + "storages/textures/jati.jpg";
let fl_c = 0,
    fl_a = 0,
    fl_o = 0,
    fl_b = 0,
    hl_c = 0,
    hl_a = 0,
    hl_o = 0,
    hl_b = 0;
// clear sceen
function clearThree(obj) {
    while (obj.children.length > 0) {
        clearThree(obj.children[0])
        obj.remove(obj.children[0]);
    }
    if (obj.geometry) obj.geometry.dispose()
    if (obj.material) obj.material.dispose()
    if (obj.texture) obj.texture.dispose()
}
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(1.5, width / height, 2, 10000);
camera.position.set(90, 20, 100);
scene.background = new THREE.Color(body_color);
camera.lookAt(scene.position);
var depthTexture = new THREE.DepthTexture(window.innerWidth, window.innerHeight, true);

renderer = new THREE.WebGLRenderer({
    antialias: true,
    preserveDrawingBuffer: true,
    alpha: true,
    canvas: canvas,
    depthTexture: depthTexture
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width, height);
controls = new THREE.TrackballControls(camera, renderer.domElement);
controls.rotateSpeed = 1;
controls.zoomSpeed = 2.0;
controls.panSpeed = 0;
controls.autoRotate = true;
controls.enableDamping = true;
controls.noZoom = false;
controls.noPan = false;
controls.minDistance = 10;
controls.maxDistance = 80;
controls.staticMoving = false;

async function createLight() {
    var ambientLight = new THREE.AmbientLight(0xffffff, .2);
    scene.add(ambientLight);
    var pointLight = new THREE.PointLight(0xffffff, 0.4);
    scene.add(camera);
    camera.add(pointLight);
    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.set(1, 1, 0).normalize();
    scene.add(directionalLight);
}

async function renderObj() {
    fl_o = 0;
    hl_o = 0;
    await renderer.render(scene, camera);
    fl_o = 25;
    hl_o = 25;
}
controls.addEventListener('change', renderObj);
window.addEventListener('change', renderObj);

async function animationLoop() {
    requestAnimationFrame(animationLoop);
    controls.update();
}
animationLoop();
/* update if scree resiz */
window.addEventListener('resize', function () {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    controls.handleResize();
    renderObj();
}, true);
// Object Loader
async function loadCollada(collada) {
    dae = collada.scene;
    await scene.add(dae);
    await controls.update();
    await renderObj();
}

async function loadSandaran() {
    hl_a = 0;
    if (sandaran_file) {
        var sandaran_text =  await  new THREE.TextureLoader().load(  await  sandaran_texture);
        sandaran_text.wrapS = await THREE.RepeatWrapping;
        sandaran_text.wrapT = await THREE.RepeatWrapping;
        await loader.load(sandaran_file, async function (collada) {
            dae = await collada.scene;
            await dae.position.set(0, -0.6, 0);
            await dae.traverse(async function (child) {
                if ( await  child instanceof THREE.Mesh) {
                    child.material.map = await sandaran_text;
                }
            })
            await scene.add(dae);
            await renderObj().then(function () {
                fl_a = 25;
                hl_a = 25;
            })

        });
    }

}

async function loadBantalan() {
    hl_b = 0;
    if (bantal_file) {
        var bantal_text =   await  new THREE.TextureLoader().load( await  bantal_texture);
        bantal_text.wrapS = await THREE.RepeatWrapping;
        bantal_text.wrapT = await THREE.RepeatWrapping;
        loader.load(bantal_file, async function (collada) {
            dae = await collada.scene;
            await dae.position.set(0, -0.6, 0);
            await dae.traverse(async function (child) {
                if ( await  child instanceof THREE.Mesh) {
                    child.material.map = await bantal_text;
                }
            })
            await scene.add(dae);
            await renderObj().then(function () {
                fl_b = 25;
                hl_b = 25;
            })

        });
    }

}

async function loadKaki() {
    hl_c = 0;
    if (kaki_file) {
        var kaki_text =  await  new THREE.TextureLoader().load( await kaki_texture);
        kaki_text.wrapS = await THREE.RepeatWrapping;
        kaki_text.wrapT = await THREE.RepeatWrapping;
        await loader.load(kaki_file, async function (collada) {
            dae = await collada.scene;
            await dae.position.set(0, -0.6, 0);
            await dae.traverse(async function (child) {
                if ( await child instanceof THREE.Mesh) {
                   child.material.map =   await  kaki_text;
                }
            })
            await scene.add(dae);
            await renderObj().then(function () {
                fl_c = 25;
                hl_c = 25;
            })

        });
    }

}

/* this embed function in import */
async function createObject(type, file, texture) {
    halfLoad();
    THREE.Cache.remove();
    clearThree(scene)
    createLight()
    await loadSandaran();
    await loadBantalan();
    await loadKaki();
    await renderObj();
}
createObject();

var dir = $("meta[name=3d_dir]").attr('content');

$(".change-sandaran-obj").click(async function (event) {
    $(".change-sandaran-obj").removeClass('active');
    $(this).addClass('active');
    sandaran_file = await base_uri + dir + "/3d/chairs/backrest/" + $(this).data('obj');
    createObject();
});

$(document).on("click",".texture-change.change-sandaran",async function (event) {
    $(".texture-change.change-sandaran").removeClass('active');
    $(this).addClass('active');
    sandaran_texture = await base_uri + dir + "/textures/" + $(this).data('texture');
    createObject();
});

$(".change-dudukan-obj").click(async function (event) {
    $(".change-dudukan-obj").removeClass('active');
    $(this).addClass('active');
    bantal_file = await base_uri + dir + "/3d/chairs/pillow/" + $(this).data('obj');
    createObject();
});

$(document).on("click",".texture-change.change-dudukan" , async function (event) {
    $(".texture-change.change-dudukan").removeClass('active');
    $(this).addClass('active');
    bantal_texture = await base_uri + dir + "/textures/" + $(this).data('texture');
    createObject();
});

$(".change-feet-obj").click(async function (event) {
    $(".change-feet-obj").removeClass('active');
    $(this).addClass('active');
    kaki_file = await base_uri + dir + "/3d/chairs/feet/" + $(this).data('obj');
    createObject();
});

$(document).on("click",".texture-change.change-kaki" , async function (event) {
    $(".texture-change.change-kaki").removeClass('active');
    $(this).addClass('active');
    kaki_texture = await base_uri + dir + "/textures/" + $(this).data('texture');
    createObject();
});

/* first laod */
let last_load_interval = 0;
var int_data_ofset = setInterval(async function () {
    if (last_load_interval <= fl_a + fl_b + fl_c + fl_o) {
        last_load_interval += 1;
    }
    if (last_load_interval > 32) {
        $("#loader-status").text("Importing Texture")
    }
    if (last_load_interval > 65) {
        $("#loader-status").text("Rendering Model")
    }

    $('.loader-interv').css('width', last_load_interval + "%");
    $("#progress-num").text(last_load_interval + "%");

    if (last_load_interval >= 100) {
        await renderObj();
        $(".full-loader").fadeOut('fast');
        clearInterval(int_data_ofset)
    }

}, 10)

/* half load */

var set_half_dash_interval = 0;
async function halfLoad() {
    var half_set_interval = setInterval(async function () {
       // console.log(set_half_dash_interval)

        if (set_half_dash_interval <= (hl_a + hl_b + hl_c + hl_o)) {
            set_half_dash_interval += 1;
        }

        $(".loader-reac").css('width', set_half_dash_interval + '%');

        if (set_half_dash_interval >= 100) {
            await renderObj()
            $(".loader-reac").css('width', 0 + '%');
            clearInterval(half_set_interval);
            set_half_dash_interval = 0;
        }
       // console.log(set_half_dash_interval)

    }, 10)
}
