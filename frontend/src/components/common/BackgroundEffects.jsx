import React, { useEffect } from 'react';

const BackgroundEffects = () => {
    useEffect(() => {
        // Three.js logic
        let threeScene, threeCamera, threeRenderer, threeParticles;
        const particleCount = 5000;
        let threeFrameId;

        const initThree = () => {
            const container = document.getElementById('threejs-canvas-container');
            if (!container || !window.THREE) return;

            // Clear container
            container.innerHTML = '';

            threeScene = new window.THREE.Scene();
            threeCamera = new window.THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            threeCamera.position.z = 25;

            threeRenderer = new window.THREE.WebGLRenderer({ alpha: true, antialias: true });
            threeRenderer.setSize(window.innerWidth, window.innerHeight);
            threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            container.appendChild(threeRenderer.domElement);

            const geometry = new window.THREE.BufferGeometry();
            const positions = new Float32Array(particleCount * 3);
            for (let i = 0; i < particleCount * 3; i++) {
                positions[i] = (Math.random() - 0.5) * 50;
            }
            geometry.setAttribute('position', new window.THREE.BufferAttribute(positions, 3));

            const material = new window.THREE.PointsMaterial({
                size: 0.05,
                color: 0x22d3ee, // cyan-400
                transparent: true,
                opacity: 0.4,
                blending: window.THREE.AdditiveBlending
            });

            threeParticles = new window.THREE.Points(geometry, material);
            threeScene.add(threeParticles);

            const animate = () => {
                threeFrameId = requestAnimationFrame(animate);
                const time = Date.now() * 0.00005;
                if (threeParticles) {
                    threeParticles.rotation.x = time * 0.2;
                    threeParticles.rotation.y = time * 0.3;
                }
                if (threeRenderer && threeScene && threeCamera) {
                    threeRenderer.render(threeScene, threeCamera);
                }
            };
            animate();
        };

        // p5.js logic
        let p5Instance;
        const initP5 = () => {
            const container = document.getElementById('p5js-canvas-container');
            if (!container || !window.p5) return;

            // Clear container
            container.innerHTML = '';

            const sketch = (p) => {
                let stars = [];
                const numStars = 800;

                p.setup = () => {
                    const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
                    canvas.parent(container);
                    for (let i = 0; i < numStars; i++) {
                        stars.push(new Star(p));
                    }
                };

                p.draw = () => {
                    p.clear();
                    p.translate(p.width / 2, p.height / 2);
                    const speed = p.map(p.mouseX || p.width / 2, 0, p.width, 0.1, 2);
                    for (let star of stars) {
                        star.update(speed);
                        star.show();
                    }
                };

                p.windowResized = () => {
                    p.resizeCanvas(p.windowWidth, p.windowHeight);
                };

                class Star {
                    constructor(p) {
                        this.p = p;
                        this.x = p.random(-p.width, p.width);
                        this.y = p.random(-p.height, p.height);
                        this.z = p.random(p.width);
                    }
                    update(speed) {
                        this.z -= speed * 5;
                        if (this.z < 1) {
                            this.z = this.p.width;
                            this.x = this.p.random(-this.p.width, this.p.width);
                            this.y = this.p.random(-this.p.height, this.p.height);
                        }
                    }
                    show() {
                        this.p.fill(255, 255, 255, 150);
                        this.p.noStroke();
                        const sx = this.p.map(this.x / this.z, 0, 1, 0, this.p.width);
                        const sy = this.p.map(this.y / this.z, 0, 1, 0, this.p.height);
                        const r = this.p.map(this.z, 0, this.p.width, 4, 0);
                        this.p.ellipse(sx, sy, r, r);
                    }
                }
            };
            p5Instance = new window.p5(sketch);
        };

        // Initialize with a small delay to ensure scripts are fully ready
        const timer = setTimeout(() => {
            initThree();
            initP5();
        }, 500);

        const handleResize = () => {
            if (threeCamera && threeRenderer) {
                threeCamera.aspect = window.innerWidth / window.innerHeight;
                threeCamera.updateProjectionMatrix();
                threeRenderer.setSize(window.innerWidth, window.innerHeight);
            }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', handleResize);
            if (threeFrameId) cancelAnimationFrame(threeFrameId);
            if (threeRenderer) {
                threeRenderer.dispose();
                if (threeRenderer.domElement && threeRenderer.domElement.parentNode) {
                    threeRenderer.domElement.parentNode.removeChild(threeRenderer.domElement);
                }
            }
            if (p5Instance) p5Instance.remove();
        };
    }, []);

    return (
        <>
            <div id="threejs-canvas-container"></div>
            <div id="p5js-canvas-container"></div>
        </>
    );
};

export default BackgroundEffects;
