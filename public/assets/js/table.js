"use Strict";
var scene, camera, controls, position;
let renderer;
var body_color = new THREE.Color(parseInt(colorlize_body)); //background color
var zoom = 10;
let dae, loader = new THREE.ColladaLoader();
var canvas = document.getElementById('root-main');
var width = canvas.parentNode.offsetWidth;
var height = canvas.parentNode.offsetHeight;
var x, y, z;var texture = new THREE.Texture();
var manager = new THREE.LoadingManager();
const strDownloadMime = "image/octet-stream";
const base_uri =  (window.location.href.includes('/en/') ? "../" : " ");

/* set default object  */
let sandaran_file =  base_uri+"storages/3d/tables/table/round.DAE";
let sandaran_texture = base_uri+"storages/textures/wood.jpg";
let bantal_file =  base_uri+"storages/3d/tables/frame/round.DAE";
let bantal_texture = base_uri+"storages/textures/wood.jpg";
let kaki_file =  base_uri+"storages/3d/tables/feet/round.DAE";
let kaki_texture = base_uri+"storages/textures/wood.jpg";
let fl_c = 0 , fl_a = 0 , fl_o  = 0 , fl_b = 0 , hl_c = 0 , hl_a = 0 , hl_o = 0 , hl_b = 0;

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
camera = new THREE.PerspectiveCamera(1.8, width / height, 2, 10000);
camera.position.set(90, 20, 100);
scene.background = new THREE.Color(body_color);
camera.lookAt(scene.position);
renderer = new THREE.WebGLRenderer({
    antialias: true,
    preserveDrawingBuffer: true,
    alpha: true,
    canvas: canvas
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width, height);
controls = new THREE.TrackballControls(camera, renderer.domElement);
controls.rotateSpeed = 1;
controls.zoomSpeed = 2.0;
controls.panSpeed = 0;
controls.autoRotate = false;
controls.enableDamping = true;
controls.noZoom = false;
controls.noPan = false;
controls.minDistance = 10;
controls.maxDistance = 80;
controls.staticMoving = false;

function createLight() {
    var ambientLight = new THREE.AmbientLight(0xffffff, .2);
    scene.add(ambientLight);
    var pointLight = new THREE.PointLight(0xffffff, 0.4);
    scene.add(camera);
    camera.add(pointLight);
    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.set(1, 1, 0).normalize();
    scene.add(directionalLight);
}

async  function renderObj() {
  fl_o = 0;
  hl_o = 0;
  renderer.render(scene, camera);
  fl_o = 25;
  hl_o = 25;

}
controls.addEventListener('change', renderObj);
window.addEventListener('change', renderObj);

function animationLoop() {
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
    scene.add(dae);
    await controls.update();
    renderObj();
}

async function loadSandaran() {
    hl_a = 0;
    if (sandaran_file) {
        var sandaran_text = new THREE.TextureLoader().load(sandaran_texture);
        sandaran_text.wrapS = THREE.RepeatWrapping;
        sandaran_text.wrapT = THREE.RepeatWrapping;
        loader.load(sandaran_file,async function (collada) {
            dae = collada.scene;
            dae.position.set(0, -0.6, 0);
            dae.traverse(async function (child) {
                if (child instanceof THREE.Mesh) {
                    child.material.map = sandaran_text;
                }
            })
            await scene.add(dae);
            await renderObj().then(function () {
              fl_a  = 25;
              hl_a = 25;
            });
        });
    }

}

async function loadBantalan() {
    hl_b = 0;
    if (bantal_file) {
        var bantal_text = new THREE.TextureLoader().load(bantal_texture);
        bantal_text.wrapS = THREE.RepeatWrapping;
        bantal_text.wrapT = THREE.RepeatWrapping;
        loader.load(bantal_file,async function (collada) {
            dae = collada.scene;
           dae.position.set(0, -0.6, 0);
            dae.traverse(async function (child) {
                if (child instanceof THREE.Mesh) {
                    child.material.map = bantal_text;
                }
            })
            await scene.add(dae);
            await renderObj().then(function () {
              fl_b  = 25;
              hl_b = 25;
            })
        });
    }

}


async function loadKaki() {
    hl_c = 0;
    if (kaki_file) {
        var kaki_text = new THREE.TextureLoader().load(kaki_texture);
        kaki_text.wrapS = THREE.RepeatWrapping;
        kaki_text.wrapT = THREE.RepeatWrapping;
        loader.load(kaki_file, async function (collada) {
            dae = collada.scene;
            dae.position.set(0, -0.6, 0);
            dae.traverse(async function (child) {
                if (child instanceof THREE.Mesh) {
                    child.material.map = kaki_text;
                }
            })
            await scene.add(dae);
            await renderObj().then(function () {
              fl_c  = 25;
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

var dir  = $("meta[name=3d_dir]").attr('content');

$(".change-sandaran-obj").click(async function(event) {
   $(".change-sandaran-obj").removeClass('active');
   $(this).addClass('active');
   sandaran_file  =  base_uri+dir+"/3d/tables/table/"+$(this).data('obj');
   createObject();
});

$(document).on("click",".texture-change.change-sandaran",async function (event) {
    $(".texture-change.change-sandaran").removeClass('active');
    $(this).addClass('active');
    sandaran_texture = await base_uri + dir + "/textures/" + $(this).data('texture');
    createObject();
});

$(".change-dudukan-obj").click(async function(event) {
   $(".change-dudukan-obj").removeClass('active');
   $(this).addClass('active');
   bantal_file  =await  base_uri+dir+"/3d/tables/frame/"+$(this).data('obj');
   createObject();
});

$(document).on("click",".texture-change.change-dudukan" , async function (event) {
    $(".texture-change.change-dudukan").removeClass('active');
    $(this).addClass('active');
    bantal_texture = await base_uri + dir + "/textures/" + $(this).data('texture');
    createObject();
});


$(".change-feet-obj").click(async function(event) {
   $(".change-feet-obj").removeClass('active');
   $(this).addClass('active');
   kaki_file  =await  base_uri+dir+"/3d/tables/feet/"+$(this).data('obj');
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
        //console.log(set_half_dash_interval)

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