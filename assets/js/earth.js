// Point zéro longitude / latitude
const geographicCoordinateOrigin = -Math.PI / 2;

let rendererWitdh = document.querySelector(".rendering").clientWidth;
let rendererHeight = document.querySelector(".rendering").clientHeight;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, rendererWitdh / rendererHeight,
	0.1, 1000);
camera.position.set(0, 0, 2);

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
	bumpScale: .05,
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

let earthSpeedRotation = 1 / 8000;
let earthRotation = false;

let cloudSpeedRotation = 1 / 4000;
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
	if (camera.position.z > 2 && event.deltaY < 0)
	{
		camera.position.z += -.1;
	}

	else if (event.deltaY > 0)
	{
		camera.position.z += .1;
	}
});

let xMouse, yMouse;

let cameraDisplacement = false;
let tempEarthRotation;
let tempCloudRotation;
let initXMouse;
let initYMouse;

renderer.domElement.addEventListener("mousedown", (event) =>
{
	initXMouse = xMouse = event.clientX;
	initYMouse = yMouse = event.clientY;
	cameraDisplacement = true;
	tempEarthRotation = earthRotation;
	tempCloudRotation = cloudRotation;
	earthRotation = false;
	cloudRotation = false;
})

let userClick = false

renderer.domElement.addEventListener("mouseup", (event) =>
{
	cameraDisplacement = false;
	if (initXMouse - event.clientX == 0 && initYMouse - event.clientY ==
		0)
	{
		userClick = true;
	}
	earthRotation = tempEarthRotation;
	cloudRotation = tempCloudRotation;
})

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

renderer.domElement.addEventListener("mousemove", (event) =>
{
	if (cameraDisplacement)
	{
		earthMesh.rotation.y += (event.clientX - xMouse) / 100;
		const xDiff = (event.clientY - yMouse) / 100;
		if ((earthMesh.rotation.x < Math.PI / 2 && xDiff > 0) || (
				earthMesh.rotation.x > -Math.PI / 2 && xDiff < 0))
		{
			earthMesh.rotation.x += (event.clientY - yMouse) / 100;
		}
		xMouse = event.clientX;
		yMouse = event.clientY;
	}

	mouse.x = (event.clientX / rendererWitdh) * 2 - 1;
	mouse.y = -(event.clientY / rendererHeight) * 2 + 1;
})

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

	// calculate objects intersecting the picking ray
	if (userClick)
	{
		const intersects = raycaster.intersectObjects(scene.children, false);

		for (let i = 0; i < intersects.length; i++)
		{
			// latitude: ok, longitude: à corriger
			// console.log(Math.atan2(intersects[i].uv.x, n.z));
			let latitude = (intersects[i].uv.y - .5)* 180;
			let longitude = ((intersects[i].uv.x - .5) * 360) //* Math.cos(latitude);
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

// Bien penser à virer le code qui ne sert à rien et refaire des noms de variables
