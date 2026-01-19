'use client';

import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useAppStore } from '@/lib/store';

interface ThreeViewerProps {
    className?: string;
}

/**
 * 순수 Three.js 기반 3D 뷰어 컴포넌트
 * React 19와 호환됩니다.
 * plan3D 데이터를 사용하여 3D 씬을 렌더링합니다.
 */
export function ThreeViewer({ className = '' }: ThreeViewerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const animationIdRef = useRef<number>(0);

    const plan3D = useAppStore((state) => state.plan.plan3D);

    // 3D 씬 생성
    const createScene = useCallback(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        // 씬 생성
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf0f0f0);

        // 카메라 설정
        const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        camera.position.set(10, 15, 10);
        camera.lookAt(0, 0, 0);

        // 렌더러 생성
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(renderer.domElement);

        // OrbitControls 추가
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.target.set(0, 0, 0);

        // 조명 추가
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 20, 10);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        scene.add(directionalLight);

        // 그리드 헬퍼
        const gridHelper = new THREE.GridHelper(20, 20, 0xcccccc, 0xe0e0e0);
        scene.add(gridHelper);

        // plan3D 데이터로 3D 씬 생성
        if (plan3D) {
            // 벽 생성
            plan3D.walls.forEach((wall) => {
                const geometry = new THREE.BoxGeometry(...wall.size);
                const material = new THREE.MeshStandardMaterial({
                    color: 0x8b7355,
                    roughness: 0.8
                });
                const mesh = new THREE.Mesh(geometry, material);
                mesh.position.set(...wall.position);
                mesh.rotation.set(...wall.rotation);
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                scene.add(mesh);
            });

            // 문 생성
            plan3D.doors.forEach((door) => {
                const geometry = new THREE.BoxGeometry(...door.size);
                const material = new THREE.MeshStandardMaterial({
                    color: 0x654321,
                    roughness: 0.5
                });
                const mesh = new THREE.Mesh(geometry, material);
                mesh.position.set(...door.position);
                mesh.rotation.set(...door.rotation);
                mesh.castShadow = true;
                scene.add(mesh);
            });

            // 창문 생성
            plan3D.windows.forEach((window) => {
                const geometry = new THREE.BoxGeometry(...window.size);
                const material = new THREE.MeshStandardMaterial({
                    color: 0x87ceeb,
                    transparent: true,
                    opacity: 0.6,
                    roughness: 0.1
                });
                const mesh = new THREE.Mesh(geometry, material);
                mesh.position.set(...window.position);
                mesh.rotation.set(...window.rotation);
                scene.add(mesh);
            });

            // 바닥 생성
            if (plan3D.floor) {
                const floorGeometry = new THREE.PlaneGeometry(plan3D.floor.size[0], plan3D.floor.size[1]);
                const floorMaterial = new THREE.MeshStandardMaterial({
                    color: 0xeeeeee,
                    side: THREE.DoubleSide
                });
                const floor = new THREE.Mesh(floorGeometry, floorMaterial);
                floor.rotation.x = -Math.PI / 2;
                floor.position.set(...plan3D.floor.position);
                floor.position.y = -0.01;
                floor.receiveShadow = true;
                scene.add(floor);

                // 카메라를 바닥 중심에 맞춤
                const floorCenter = plan3D.floor.position;
                controls.target.set(floorCenter[0], 0, floorCenter[2]);
                camera.position.set(
                    floorCenter[0] + 10,
                    15,
                    floorCenter[2] + 10
                );
                camera.lookAt(floorCenter[0], 0, floorCenter[2]);
            }
        } else {
            // 데모용 룸 생성 (plan3D 데이터가 없는 경우)
            createDemoRoom(scene);
        }

        // 레퍼런스 저장
        sceneRef.current = scene;
        rendererRef.current = renderer;
        cameraRef.current = camera;
        controlsRef.current = controls;

        // 애니메이션 루프
        const animate = () => {
            animationIdRef.current = requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        // 리사이즈 핸들러
        const handleResize = () => {
            if (!containerRef.current) return;
            const newWidth = containerRef.current.clientWidth;
            const newHeight = containerRef.current.clientHeight;
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, newHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationIdRef.current);
            renderer.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, [plan3D]);

    // 데모 룸 생성 (plan3D 데이터가 없는 경우)
    const createDemoRoom = (scene: THREE.Scene) => {
        const wallMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b7355,
            roughness: 0.8
        });

        // 북쪽 벽
        const northWall = new THREE.Mesh(
            new THREE.BoxGeometry(8, 2.5, 0.2),
            wallMaterial
        );
        northWall.position.set(0, 1.25, -4);
        northWall.castShadow = true;
        northWall.receiveShadow = true;
        scene.add(northWall);

        // 남쪽 벽
        const southWall = new THREE.Mesh(
            new THREE.BoxGeometry(8, 2.5, 0.2),
            wallMaterial
        );
        southWall.position.set(0, 1.25, 4);
        southWall.castShadow = true;
        southWall.receiveShadow = true;
        scene.add(southWall);

        // 동쪽 벽
        const eastWall = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 2.5, 8),
            wallMaterial
        );
        eastWall.position.set(4, 1.25, 0);
        eastWall.castShadow = true;
        eastWall.receiveShadow = true;
        scene.add(eastWall);

        // 서쪽 벽
        const westWall = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 2.5, 8),
            wallMaterial
        );
        westWall.position.set(-4, 1.25, 0);
        westWall.castShadow = true;
        westWall.receiveShadow = true;
        scene.add(westWall);

        // 문 (남쪽 벽에)
        const doorGeometry = new THREE.BoxGeometry(0.9, 2.1, 0.3);
        const doorMaterial = new THREE.MeshStandardMaterial({
            color: 0x654321,
            roughness: 0.5
        });
        const door = new THREE.Mesh(doorGeometry, doorMaterial);
        door.position.set(0, 1.05, 4);
        door.castShadow = true;
        scene.add(door);

        // 창문 (북쪽 벽에)
        const windowGeometry = new THREE.BoxGeometry(1.5, 1.2, 0.3);
        const windowMaterial = new THREE.MeshStandardMaterial({
            color: 0x87ceeb,
            transparent: true,
            opacity: 0.6,
            roughness: 0.1
        });
        const window1 = new THREE.Mesh(windowGeometry, windowMaterial);
        window1.position.set(-2, 1.5, -4);
        scene.add(window1);

        const window2 = new THREE.Mesh(windowGeometry, windowMaterial);
        window2.position.set(2, 1.5, -4);
        scene.add(window2);

        // 바닥
        const floorGeometry = new THREE.PlaneGeometry(20, 20);
        const floorMaterial = new THREE.MeshStandardMaterial({
            color: 0xeeeeee,
            side: THREE.DoubleSide
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -0.01;
        floor.receiveShadow = true;
        scene.add(floor);
    };

    useEffect(() => {
        const cleanup = createScene();
        return () => {
            cleanup?.();
        };
    }, [createScene]);

    return (
        <div
            ref={containerRef}
            className={`w-full h-full ${className}`}
            style={{ minHeight: '400px' }}
        />
    );
}
