<script>
	import { getAllContexts, onMount } from 'svelte';
	import gsap from 'gsap/dist/gsap';
	import * as THREE from 'three';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import { lottieScrollTrigger } from '$lib/lottieScroll.js';
	import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import { ModuleCacheMap } from 'vite/runtime';

	let threeJsContainer;

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);
		// lottieScrollTrigger({
		//     target: container,
		//     path: "/ThisIsTheMarqet.json",
		//     speed: "medium",
		//     onEnter: function () {
		//         anim = true;
		//     },
		//     onLeave: function ()  {
		//         anim = false;
		//     },
		//     scrub: 2
		// });

		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(
			30,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);

		const renderer = new THREE.WebGLRenderer({ alpha: true });
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setPixelRatio(window.devicePixelRatio);
		threeJsContainer.appendChild(renderer.domElement);

		const light = new THREE.AmbientLight(0x404040, 25);
		scene.add(light);
		
		let head = new THREE.Object3D();

		const loader = new GLTFLoader();
		loader.load('/3d_scan_of_head_3.glb', (gltf) => {
			const mesh = gltf.scene;

			head = mesh.children[0];
			head.geometry.scale(0.5, 0.5, 0.5);

			const meshFrame = new THREE.Mesh(mesh.children[0].geometry);
			meshFrame.material = new THREE.MeshPhysicalMaterial({
				color: 'black',
				metalness: 0,
				roughness: 0,
				wireframe: true,
				transparent: true,
				opacity: 0.5,
			});

			scene.add(head);
			console.log(head);

			const pivot = new THREE.Object3D();
			pivot.position.copy(head.position);
			scene.add(pivot);

			camera.position.set(0, 0, 10);
			pivot.add(camera);

			const animate = () => {
				requestAnimationFrame(animate);
				pivot.rotation.y += 0.01;
				camera.lookAt(head.position);
				renderer.render(scene, camera);
			};

			animate();
		});

		const raycaster = new THREE.Raycaster();
		let pointer = new THREE.Vector2(Infinity, Infinity);
		let mouse = new THREE.Vector2(Infinity, Infinity);
		
		let worldContact = new THREE.Vector3();
		let localContact = new THREE.Vector3();

		let hasContacted = (event) => {
			const rect = renderer.domElement.getBoundingClientRect();
			const x = (event.clientX - rect.left) / rect.width;
			const y = (event.clientY - rect.top) / rect.height;

			pointer.x = 2 * x - 1;
			pointer.y = -2 * y + 1;

			raycaster.setFromCamera(pointer, camera);

			let intersects = raycaster.intersectObject(head);
			if (intersects.length > 0) {
				worldContact.copy(intersects[0].point);
				const hitMesh = intersects[0].object;
				localContact.copy(intersects[0].point);
				hitMesh.worldToLocal(localContact);
				return true;
			}
			return false;
		};

		let selectedPoints = [];
		let selectedForces = [];
		let oldPositions = [];

		let selectPoints = () => {
			selectedPoints = [];
			selectedForces = [];

			let position = head.geometry.getAttribute("position");
			let v = new THREE.Vector3();

			for (let i = 0; i < position.count; i++) {
				v.set(position.getX(i), position.getY(i), position.getZ(i));
				let force = v.distanceTo(localContact) / 0.01;
				if (force < 1) {
					oldPositions.push(new THREE.Vector3(position.getX(i), position.getY(i), position.getZ(i)));
					selectedPoints.push(i);
					selectedForces.push((0.5 + 0.5 * Math.cos(Math.PI * force)) / 185);
				}
			}
		}

		let dragPoints = (dx, dy) => {
			const DRAG_SCALE = 1.25;

			const forward = new THREE.Vector3();
			camera.getWorldDirection(forward).normalize();
			const up = new THREE.Vector3().copy(camera.up).applyQuaternion(camera.quaternion).normalize();
			const right = new THREE.Vector3().crossVectors(forward, up).normalize();

			const worldDelta = new THREE.Vector3();
			worldDelta.copy(right).multiplyScalar(dx * DRAG_SCALE);
			worldDelta.addScaledVector(up, -dy * DRAG_SCALE);

			const worldOrigin = head.getWorldPosition(new THREE.Vector3());
			const worldTarget = worldOrigin.clone().add(worldDelta);

			const localOrigin = head.worldToLocal(worldOrigin.clone());
			const localTarget = head.worldToLocal(worldTarget.clone());
			const localDelta = localTarget.sub(localOrigin);

			const position = head.geometry.getAttribute('position');
			for (let idx = 0; idx < selectedPoints.length; idx++) {
				const i = selectedPoints[idx];
				const strength = selectedForces[idx];
				position.setX(i, position.getX(i) + localDelta.x * strength);
				position.setY(i, position.getY(i) + localDelta.y * strength);
				position.setZ(i, position.getZ(i) + localDelta.z * strength);
			}
			position.needsUpdate = true;

			head.geometry.computeVertexNormals();
			head.geometry.normalsNeedUpdate = true;
		};

		window.addEventListener("pointerdown", (event) => {
			if (hasContacted(event)) {
				selectPoints();
				mouse.set(event.clientX, event.clientY);
			}
		});

		window.addEventListener("pointerup", (event) => {
			const position = head.geometry.getAttribute("position");
			const currentPositions = [];

			for (let idx = 0; idx < selectedPoints.length; idx++) {
				const i = selectedPoints[idx];
				currentPositions.push({
					x: position.getX(i),
					y: position.getY(i),
					z: position.getZ(i),
				});
			}

			const duration = 0.35;
			const startTime = performance.now();

			function springEase(t) {
				const damping = 5;
				const stiffness = 12.5;
				return 1 - Math.exp(-damping * t) * Math.cos(stiffness * t);
			}

			function animateReset(now) {
				const elapsed = (now - startTime) / (duration * 1000);
				const t = Math.min(elapsed, 1);
				const ease = springEase(t);

				for (let idx = 0; idx < selectedPoints.length; idx++) {
					const i = selectedPoints[idx];
					const start = currentPositions[idx];
					const end = oldPositions[idx];

					position.setX(i, start.x + (end.x - start.x) * ease);
					position.setY(i, start.y + (end.y - start.y) * ease);
					position.setZ(i, start.z + (end.z - start.z) * ease);
				}

				position.needsUpdate = true;

				if (t < 1) {
					requestAnimationFrame(animateReset);
				} else {
					selectedPoints = [];
					oldPositions = [];
				}
			}
			requestAnimationFrame(animateReset);
		});

		window.addEventListener("pointermove", (event) => {
			dragPoints(event.clientX - mouse.x, event.clientY - mouse.y);
			mouse.set(event.clientX, event.clientY);
		});
	});
</script>

<div class="absolute top-[48%] left-[58%]">
	<h1 class="font-black text-6xl">craig contreras</h1>
	<p class="text-right">under maintenance</p>
	<p class="text-right">contact: craigcontreras@protonmail.com</p>
</div>
<div class="fixed z-1 min-w-full min-h-full w-full h-full">
	<div
		bind:this={threeJsContainer}
		class="flex min-h-full min-w-full w-full h-full items-center justify-center"
	></div>
</div>

<style>
</style>
