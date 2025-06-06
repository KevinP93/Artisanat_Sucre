// Navigation handling
function navigate(event, sectionId) {
    event.preventDefault();
    document.getElementById(sectionId).scrollIntoView({
        behavior: 'smooth'
    });

    // Close mobile menu if open
    document.getElementById('mobile-menu').classList.add('hidden');
}

// Mobile menu toggle
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

// Product data
const products = [
    {
        id: 1,
        name: "Fraise Trompe-l'œil",
        description: "Une pâtisserie en forme de fraise, avec une texture et un goût incroyablement réalistes.",
        price: "8,50€",
        image: "assets/fraise.png",
        tags: ["Fruit", "Trompe-l'œil", "Best-seller"]
    },
    {
        id: 2,
        name: "Mangue Passion",
        description: "Un délicieux entremet qui combine la douceur de la mangue et l'acidité de la passion.",
        price: "9,90€",
        image: "assets/mangue.png",
        tags: ["Fruit", "Exotique"]
    },
    {
        id: 3,
        name: "Framboise Éclatante",
        description: "Une création qui reproduit à la perfection l'apparence d'une framboise fraîchement cueillie.",
        price: "8,00€",
        image: "assets/framboise.png",
        tags: ["Fruit", "Trompe-l'œil"]
    },
    {
        id: 4,
        name: "Citron Meringué",
        description: "Un citron réaliste avec une intérieur crémeux et une meringue torréfiée.",
        price: "7,50€",
        image: "assets/citron.png",
        tags: ["Acide", "Trompe-l'œil"]
    },
    {
        id: 5,
        name: "Pêche Veloutée",
        description: "Une pêche en pâtisserie avec un cœur fondant et une texture veloutée.",
        price: "8,20€",
        image: "assets/peche.png",
        tags: ["Fruit", "Été"]
    }
];

// Generate product cards
const productGrid = document.querySelector('#products .grid');

products.forEach(product => {
    const tagsHtml = product.tags.map(tag =>
        `<span class="inline-block bg-rose-100 text-rose-800 text-xs px-2 py-1 rounded-full mr-1 mb-1">${tag}</span>`
    ).join('');

    const productCard = `
        <div class="product-card bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
            <div class="relative h-64 overflow-hidden">
                <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover transition-transform duration-500 hover:scale-110">
                <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center shadow-md">
                    <span class="text-rose-600 font-bold">${product.price}</span>
                </div>
            </div>
            <div class="p-6">
                <h3 class="text-xl font-bold text-gray-900 mb-2">${product.name}</h3>
                <p class="text-gray-600 mb-4">${product.description}</p>
                <div class="flex flex-wrap">
                    ${tagsHtml}
                </div>
                <button class="mt-4 w-full bg-rose-600 text-white py-2 px-4 rounded-lg hover:bg-rose-700 transition-colors">
                    Commander
                </button>
            </div>
        </div>
    `;

    productGrid.innerHTML += productCard;
});

// Initialize 3D viewer
document.addEventListener('DOMContentLoaded', () => {
    init3DViewer();
});

function init3DViewer() {
    const container = document.getElementById('fruit-3d-container');
    if (!container) return;

    container.innerHTML = '';

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f9fa);

    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 13;
    camera.position.y = 1;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
    dirLight.position.set(7, 12, 7.5);
    scene.add(dirLight);

    // Création de la grappe de raisin dense et symétrique
    const grapeGroup = new THREE.Group();
    const grapeColors = [0x7c35a7, 0x8938c5, 0x742c95, 0x8138a9];

    const totalRows = 13; // Plus tu augmentes, plus c'est dense
    const maxRadius = 2.7;
    const verticalSpacing = 0.82;

    let grainIndex = 0;
    for (let y = 0; y < totalRows; y++) {
        // Cône : rayon décroissant
        const t = y / (totalRows - 1);
        const ringRadius = maxRadius * (1 - t * 0.87); // 0.87 contrôle la pointe

        // Nombre de grains par rangée
        const grainsInRow = Math.max(2, Math.round(11 * (ringRadius / maxRadius) + 2));

        for (let i = 0; i < grainsInRow; i++) {
            const angle = (i / grainsInRow) * Math.PI * 2;

            // Taille des grains (un peu de variation naturelle)
            const size = 0.57 + Math.random() * 0.13;
            const geometry = new THREE.SphereGeometry(size, 32, 32);
            const material = new THREE.MeshPhongMaterial({
                color: grapeColors[grainIndex % grapeColors.length],
                shininess: 120,
                specular: 0xf8f9fa,
                reflectivity: 1
            });
            const grape = new THREE.Mesh(geometry, material);

            // Positionnement sur un anneau complet, avec petit offset aléatoire
            const randomOffset = (Math.random() - 0.5) * 0.14;
            const x = Math.cos(angle) * ringRadius + randomOffset;
            const z = Math.sin(angle) * ringRadius + randomOffset;
            const yPos = -y * verticalSpacing + (Math.random() - 0.5) * 0.09;

            grape.position.set(x, yPos, z);

            // Variation d’échelle pour l'effet naturel
            grape.scale.x = 0.98 + Math.random() * 0.07;
            grape.scale.y = 0.98 + Math.random() * 0.07;
            grape.scale.z = grape.scale.x;

            grapeGroup.add(grape);
            grainIndex++;
        }
    }

    // Tige épaisse, recourbée vers la gauche (en haut de la grappe)
    const stalkPath = new THREE.CurvePath();
    const start = new THREE.Vector3(-1.1, 1.7, 0.5);
    const mid1 = new THREE.Vector3(-1.6, 2.6, 0.7);
    const mid2 = new THREE.Vector3(-1.4, 3.4, 0.4);
    const end = new THREE.Vector3(-0.4, 3.6, 0.2);

    stalkPath.add(new THREE.LineCurve3(start, mid1));
    stalkPath.add(new THREE.LineCurve3(mid1, mid2));
    stalkPath.add(new THREE.LineCurve3(mid2, end));

    const stalkGeometry = new THREE.TubeGeometry(stalkPath, 30, 0.28, 8, false);
    const stalkMaterial = new THREE.MeshPhongMaterial({ color: 0x7c4e18, shininess: 20 });
    const stalk = new THREE.Mesh(stalkGeometry, stalkMaterial);
    grapeGroup.add(stalk);

    // Feuille verte, plus grande, à gauche sous la tige
    const leafShape = new THREE.Shape();
    leafShape.moveTo(0, 0);
    leafShape.bezierCurveTo(0.5, 1.0, 0.8, 2.2, 0.1, 2.7);
    leafShape.bezierCurveTo(-1.1, 2.0, -1.3, 1.2, -0.5, 0.0);
    leafShape.bezierCurveTo(-0.2, -0.1, 0.2, -0.1, 0, 0);

    const leafGeometry = new THREE.ExtrudeGeometry(leafShape, { depth: 0.08, bevelEnabled: false });
    const leafMaterial = new THREE.MeshPhongMaterial({ color: 0x469b3d, shininess: 40 });
    const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
    leaf.position.set(-1.65, 1.55, 0.7);
    leaf.rotation.set(-0.3, 0.7, -1.5);
    leaf.scale.set(1.3, 1.1, 1);

    grapeGroup.add(leaf);

    // Centre la grappe
    grapeGroup.position.y = 2;
    scene.add(grapeGroup);

    // Contrôles interactifs
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6;

    // Responsive
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
}





// Scroll animation for elements
function animateOnScroll() {
    const elements = document.querySelectorAll('.product-card, .hover-rotate');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeIn');
            }
        });
    }, {
        threshold: 0.1
    });

    elements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize animations
document.addEventListener('DOMContentLoaded', animateOnScroll);
