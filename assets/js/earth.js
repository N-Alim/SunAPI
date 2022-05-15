// Point zéro longitude / latitude
const geographicCoordinateOrigin = -Math.PI / 2;

let rendererWitdh = document.querySelector(".rendering").clientWidth;
let rendererHeight = document.querySelector(".rendering").clientHeight;

const minZoom = 3;
const maxZoom = 1.5;
const rangeInput = document.querySelector("input[type=range]#zoom")

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, rendererWitdh / rendererHeight,
	0.1, 1000);
camera.position.set(0, 0, 1.8);

const light = new THREE.DirectionalLight(0xffffff, .75);
light.position.set(1, 1, 1);
scene.add(light);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(rendererWitdh, rendererHeight);
document.querySelector(".rendering").appendChild(renderer.domElement);
const texLoader = new THREE.TextureLoader();
const earthMap = texLoader.load('./assets/img/earthmap.jpg');
const earthBump = texLoader.load('./assets/img/earthbump.jpg');
const earthSpecular = texLoader.load('./assets/img/earthspec.jpg');
const earthMaterial = new THREE.MeshPhongMaterial(
{
	map: earthMap,
	bumpMap: earthBump,
	bumpScale: .5,
	specularMap: earthSpecular,
	specular: new THREE.Color(0x444444)
});

const earthSphere = new THREE.SphereGeometry(1, 32, 32);
const earthMesh = new THREE.Mesh(earthSphere, earthMaterial);
earthMesh.rotation.y = geographicCoordinateOrigin;
scene.add(earthMesh);

const canvasCloud = texLoader.load('./assets/img/earthcloud.jpg');
const canvasCloudTrans = texLoader.load('./assets/img/earthcloudtrans.jpg');
const cloudSphere = new THREE.SphereGeometry(1.01, 32, 32)
const cloudMaterial = new THREE.MeshPhongMaterial(
{
	map: canvasCloud,
	side: THREE.DoubleSide,
	opacity: .4,
	transparent: true,
	depthWrite: false,
});
const cloudMesh = new THREE.Mesh(cloudSphere, cloudMaterial)
earthMesh.add(cloudMesh)

let earthSpeedRotation = 1 / 6000;
let earthRotation = false;

let cloudSpeedRotation = 1 / 3000;
let cloudRotation = false;

function toggleEarthRotation()
{
	earthRotation = !earthRotation;

}

function toggleCloudsRotation()
{
	cloudRotation = !cloudRotation;
}

renderer.domElement.addEventListener("wheel", function(event)
{
	if (camera.position.z > maxZoom && event.deltaY < 0)
	{
		camera.position.z -= .1;
	}

	else if (camera.position.z < minZoom && event.deltaY > 0)
	{
		camera.position.z += .1;
	}

	rangeInput.value = 3 - camera.position.z
});

rangeInput.addEventListener("input", (event) =>
{
	camera.position.z = 3 - event.target.value
})

let xMouse, yMouse;

let cameraDisplacement = false;
let tempEarthRotation;
let tempCloudRotation;
let initXMouse;
let initYMouse;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

renderer.domElement.addEventListener("mousedown", (event) =>
{
	onPointerDown(event);
})

renderer.domElement.addEventListener("touchstart", (event) =>
{
	onPointerDown(event.changedTouches[0]);
})

let userClick = false

renderer.domElement.addEventListener("mouseup", (event) =>
{
	onPointerUp(event);
})

renderer.domElement.addEventListener("touchend", (event) =>
{
	onPointerUp(event.changedTouches[0]);
})

renderer.domElement.addEventListener("mousemove", (event) =>
{
	onPointerMove(event);
})

renderer.domElement.addEventListener("touchmove", (event) =>
{
	onPointerMove(event.changedTouches[0]);
})

function onPointerDown(screenData)
{
	initXMouse = xMouse = screenData.clientX;
	initYMouse = yMouse = screenData.clientY;
	cameraDisplacement = true;
	tempEarthRotation = earthRotation;
	tempCloudRotation = cloudRotation;
	earthRotation = false;
	cloudRotation = false;
}

function onPointerUp(screenData)
{
	cameraDisplacement = false;
	if (initXMouse - screenData.clientX == 0 && initYMouse - screenData.clientY ==
		0)
	{
		userClick = true;
	}
	earthRotation = tempEarthRotation;
	cloudRotation = tempCloudRotation;
}

function onPointerMove(screenData)
{
	if (cameraDisplacement)
	{
		earthMesh.rotation.y += (screenData.clientX - xMouse) / 200;
		const xDiff = (screenData.clientY - yMouse) / 200;
		if ((earthMesh.rotation.x < Math.PI / 2 && xDiff > 0) || (
				earthMesh.rotation.x > -Math.PI / 2 && xDiff < 0))
		{
			earthMesh.rotation.x += (screenData.clientY - yMouse) / 200;
		}
		xMouse = screenData.clientX;
		yMouse = screenData.clientY;
	}

	mouse.x = (screenData.clientX / rendererWitdh) * 2 - 1;
	mouse.y = -(screenData.clientY / rendererHeight) * 2 + 1;
}

function onWindowResize()
{

	rendererWitdh = document.querySelector(".rendering").clientWidth;
	rendererHeight = document.querySelector(".rendering").clientHeight;
	camera.aspect = rendererWitdh / rendererHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(rendererWitdh, rendererHeight);

}

window.addEventListener('resize', onWindowResize);

function resetCamera()
{
	earthMesh.rotation.set(0, -Math.PI / 2, 0);
}

function animate()
{
	raycaster.setFromCamera(mouse, camera);

	if (userClick)
	{
		const intersects = raycaster.intersectObjects(scene.children, false);

		for (let i = 0; i < intersects.length; i++)
		{
			let latitude = (intersects[i].uv.y - .5)* 180;
			let longitude = ((intersects[i].uv.x - .5) * 360)
			loadData(latitude, longitude);
		}

		userClick = false;
	}

	if (earthRotation)
	{
		earthMesh.rotation.y += earthSpeedRotation;
	}
	if (cloudRotation)
	{
		cloudMesh.rotation.y += cloudSpeedRotation;
	}

	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}
animate();
