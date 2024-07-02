document.addEventListener("DOMContentLoaded", function() {
    const startButton = document.getElementById('generateBars');
    const numField = document.getElementById('numBars');

    numField.addEventListener('input', function() {
        if (numField.value.trim() !== '') {
            startButton.disabled = false;
        } else {
            startButton.disabled = true;
        }
    });
});

        function storeValues() {
    var inputs = document.querySelectorAll('.bar-input');
    var values = [];
    inputs.forEach(input => {
        var value = input.value.trim();
        values.push(value);
        console.log("Value:", value);
    });
    localStorage.setItem('userValues', JSON.stringify(values));
}

        function retrieveValues() {
            var storedValues = localStorage.getItem('userValues');
            return storedValues ? JSON.parse(storedValues) : [];

        }

        document.getElementById('scrollToPage3').addEventListener('click', function() {

                storeValues()
            });

        window.addEventListener('beforeunload', function(event) {
                localStorage.removeItem('userValues');
            });

        document.getElementById('inputForm').addEventListener('submit', function(event) {
            event.preventDefault();

            var numBars = parseInt(document.getElementById('numBars').value);
            var chart = document.getElementById('chart');
            chart.innerHTML = '';

            function createInput() {
                var bar = document.createElement('div');
                bar.classList.add('bar');
                chart.appendChild(bar);

                var input = document.createElement('input');
                input.classList.add('bar-input');
                input.type = 'number';
                bar.appendChild(input);

                input.addEventListener('input', function(event) {
                    var value = parseInt(event.target.value);
                    if (value > 300) {
                        event.target.value = 300;
                    }
                    if (value < 1) {
                        event.target.value = 1;
                    }
                });

                input.addEventListener('keydown', function(event) {
                    if (event.key === 'Enter') {
                        event.preventDefault();

                        var nextInput = input.parentElement.nextElementSibling.querySelector('.bar-input');
                        if (nextInput && nextInput.tagName === 'INPUT') {

                            input.style.backgroundColor = '#2ffca6';

                            if (input.value.trim() !== '') {
                                nextInput.focus();
                            } else {
                                input.style.border = '1px solid red';
                            }
                        }
                        if (!nextInput && input.value.trim() !== '') {

                    document.getElementById('scrollToPage3').disabled = false;

                }
            }
                });
              
                input.addEventListener('input', updateBars);
            }

            var createdInputs = 0;

            for (var i = 0; i < numBars; i++) {
                createInput();
                createdInputs++;
            }

            document.getElementById('generateBars').disabled = true;

            var firstInput = document.querySelector('.bar-input');
            if (firstInput) {
                firstInput.focus();
            }

            var intervalId = setInterval(function() {
                var inputs = document.querySelectorAll('.bar-input');
                var allFilled = true;
                inputs.forEach(function(input) {
                    if (input.value.trim() === '') {
                        allFilled = false;
                    }
                });

                if (allFilled) {
                    document.getElementById('scrollToPage3').disabled = false;
                    clearInterval(intervalId);
                }
            }, 100);
        });

        function updateBars() {
            var inputs = document.querySelectorAll('.bar-input');
            var bars = document.querySelectorAll('.bar');
            var maxHeight = Math.max(...Array.from(inputs, input => parseInt(input.value.trim())));

            bars.forEach(function(bar, index) {
                var height = parseInt(inputs[index].value.trim());
                bar.style.height = height + 'px';
            });

            var transitionDuration = 0.5;

            var tallestHeight = Math.max(...Array.from(bars, bar => parseInt(bar.style.height)));
            if (tallestHeight > 0) {
                transitionDuration = (tallestHeight / maxHeight) * 0.5;
            }

            bars.forEach(function(bar) {
                bar.style.transition = 'height ' + transitionDuration + 's ease';
            });
        }

        document.querySelector('.page3_button').addEventListener('click', function() {

            document.getElementById('scrollToPage3').disabled = true;
            });

        document.querySelector('.reset-button').addEventListener('click', function() {
            localStorage.removeItem('userValues');
            document.getElementById('numBars').value = '';
            document.getElementById('chart').innerHTML = '';
            document.getElementById('generateBars').disabled = true;
            document.getElementById('scrollToPage3').disabled = true;
        });

        function updateBarsFromStorage() {
            var storedValues = retrieveValues();
            var inputs = document.querySelectorAll('.bar-input');
            storedValues.forEach((value, index) => {
                if (inputs[index]) {
                    inputs[index].value = value;
                }
            });
            updateBars();
        }

        updateBarsFromStorage();

        document.getElementById('scrollToPage2').addEventListener('click', function() {
            document.getElementById('page2').scrollIntoView({ behavior: 'smooth' });
        });

        document.getElementById('scrollToPage3').addEventListener('click', function() {
            document.getElementById('page3').scrollIntoView({ behavior: 'smooth' });
        });
    
        import * as THREE from 'three';
        import { FontLoader } from 'three/addons/loaders/FontLoader.js';
        import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
        import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
        import TWEEN from 'https://cdnjs.cloudflare.com/ajax/libs/tween.js/23.1.1/tween.esm.js';

 
        const canvasHeight = 550;
        const canvasWidth = 1000;
        const barWidth = 80; 
        const maxBarHeight = 300; 
        const bars = [];
        const groups = [];

        const textParams = {
            font: undefined, 
            size: 25,
            height: 1, 
            curveSegments: 12,
            bevelEnabled: false,
        };

        const min_elem_block = document.getElementById('min_elem_block');
        const min_index_block = document.getElementById('min_index_block');
        const elem_block = document.getElementById('elem_block');
        const elem_index_block = document.getElementById('elem_index_block');
        const shift_index_block = document.getElementById('shift_index_block');

        function updateMinElem(text, className = '') {
        min_elem_block.innerHTML = `<span class="${className}">${text}</span>`;
    }

        function updateMinIndx(text, className = '') {
        min_index_block.innerHTML = `<span class="${className}">${text}</span>`;
    }

        function updateElem(text, className = '') {
        elem_block.innerHTML = `<span class="${className}">${text}</span>`;
    }

        function updateElemIndx(text, className = '') {
        elem_index_block.innerHTML = `<span class="${className}">${text}</span>`;
    }

        function updateShiftBlock(text, className = '') {
        shift_index_block.innerHTML = `<span class="${className}">${text}</span>`;
    }

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(canvasWidth, canvasHeight);

const container = document.getElementById('bubble_canvas');
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const cameraX = 500;
const cameraY = cameraX;
const cameraZ = cameraX;

const camera = new THREE.OrthographicCamera ( -canvasWidth, canvasWidth, canvasHeight, -canvasHeight, 1, 10000 );

camera.position.set(cameraX, cameraY, cameraZ);
camera.lookAt(0,0,0);

const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

scene.add(camera);

console.log(camera.position);

//gradiet_main
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 1;
canvas.height = 256;
const gradient = ctx.createLinearGradient(0, 0, 0, 256);
gradient.addColorStop(0, '#2b2b2b');
gradient.addColorStop(1, '#00d5ff');
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, canvas.width, canvas.height);
const gradientTexture = new THREE.CanvasTexture(canvas);
//end

//gradient_clone
const highlightCanvas = document.createElement('canvas');
const highlightCtx = highlightCanvas.getContext('2d');
highlightCanvas.width = 1;
highlightCanvas.height = 256;
const highlightGradient = highlightCtx.createLinearGradient(0, 0, 0, 256);
highlightGradient.addColorStop(0, '#2b2b2b');
highlightGradient.addColorStop(1, '#ff0000');
highlightCtx.fillStyle = highlightGradient;
highlightCtx.fillRect(0, 0, highlightCanvas.width, highlightCanvas.height);
const highlightGradientTexture = new THREE.CanvasTexture(highlightCanvas);
//end

//gradientF_clone
const highlightfCanvas = document.createElement('canvas');
const highlightfCtx = highlightfCanvas.getContext('2d');
highlightfCanvas.width = 1;
highlightfCanvas.height = 256;
const highlightfGradient = highlightfCtx.createLinearGradient(0, 0, 0, 256);
highlightfGradient.addColorStop(0, '#2b2b2b');
highlightfGradient.addColorStop(1, '#ff0000');
highlightfCtx.fillStyle = highlightfGradient;
highlightfCtx.fillRect(0, 0, highlightfCanvas.width, highlightfCanvas.height);
const highlightfGradientTexture = new THREE.CanvasTexture(highlightfCanvas);
//end

//gradientP_clone
const highlightpCanvas = document.createElement('canvas');
const highlightpCtx = highlightpCanvas.getContext('2d');
highlightpCanvas.width = 1;
highlightpCanvas.height = 256;
const highlightpGradient = highlightpCtx.createLinearGradient(0, 0, 0, 256);
highlightpGradient.addColorStop(0, '#2b2b2b');
highlightpGradient.addColorStop(1, '#ff0000');
highlightpCtx.fillStyle = highlightpGradient;
highlightpCtx.fillRect(0, 0, highlightpCanvas.width, highlightpCanvas.height);
const highlightpGradientTexture = new THREE.CanvasTexture(highlightpCanvas);
//end

//gradientB_clone
const highlightbCanvas = document.createElement('canvas');
const highlightbCtx = highlightbCanvas.getContext('2d');
highlightbCanvas.width = 1;
highlightbCanvas.height = 256;
const highlightbGradient = highlightbCtx.createLinearGradient(0, 0, 0, 256);
highlightbGradient.addColorStop(0, '#2b2b2b');
highlightbGradient.addColorStop(1, '#ff0000');
highlightbCtx.fillStyle = highlightbGradient;
highlightbCtx.fillRect(0, 0, highlightbCanvas.width, highlightbCanvas.height);
const highlightbGradientTexture = new THREE.CanvasTexture(highlightbCanvas);
//end

const floorGeometry = new THREE.PlaneGeometry(8000,8000);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, side: THREE.DoubleSide }); 
const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
floorMesh.rotation.x = Math.PI / 2;
floorMesh.position.y = -200;

scene.add(floorMesh);

const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

async function createBars(userValues) {

    console.log('Creating bars with userValues:', userValues);
    const numBars = userValues.length;
    const barSpacing = 200;

    let customArray = userValues.map(value => parseFloat(value));
    customArray.forEach((item,index) => console.log(index,item));

        let shiftX = 0;
        let shiftZ = 0;

        let currentX = (numBars / 2) * -120;
        let currentZ = (numBars / 2) * 120;

        shiftX = currentX + 55;
        shiftZ = currentZ - 55;

        const font = await new Promise((resolve, reject) => {
        const loader = new FontLoader();
        loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', resolve, undefined, reject);
    });
            
    textParams.font = font;

        for (let i = 0; i < numBars; i++) {
            const group = new THREE.Group();
            scene.add(group);
            console.log('group added',group);

            let barHeight;

            if((parseFloat(userValues[i])) < 30){
                barHeight = 60; 
            }
            else{
                barHeight = (userValues[i] / 300) * (maxBarHeight * 2);
            }

            const geometry = new THREE.BoxGeometry(barWidth, barHeight, barWidth);

            const material = new THREE.MeshStandardMaterial({ map: gradientTexture.clone() });
            const bar = new THREE.Mesh(geometry, material);
            const barPosition = new THREE.Vector3(shiftX, ((barHeight / 2) - 200) - 1000, shiftZ);
            bar.position.copy(barPosition);
            
            group.add(bar);
            console.log('bar added', bar);

            const cubePosition = new THREE.Vector3(barPosition.x, barPosition.y + (barHeight / 2) + 25, barPosition.z);
            const cubeGeometry = new THREE.BoxGeometry(barWidth, 30, barWidth);
            const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x2b2b2b });
            const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cubeMesh.position.copy(cubePosition);
                        
            group.add(cubeMesh);
            console.log('cube added', cubeMesh);

            const textGeometry = new TextGeometry(userValues[i].toString(), textParams);

            textGeometry.computeBoundingBox();
            const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
            const textHeight = textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y;

            const textPosition = new THREE.Vector3(barPosition.x + 30, -1180 , barPosition.z + 155);
            const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);

            textMesh.rotation.set(-(Math.PI / 2), (Math.PI / 2), (Math.PI / 2));

            textMesh.position.copy(textPosition);

            group.add(textMesh);
            console.log('text added', textMesh);
            
            groups.push(group);
            console.log('group added', group);

            shiftX += 120;
            shiftZ -= 120;

            console.log(groups[i]);
        }
        await animateBars();

        await selectionSortAnimation(customArray, highlightGradientTexture, highlightfGradientTexture, gradientTexture, highlightpGradientTexture, highlightbGradientTexture);

        SortFinishHighlight(numBars, gradientTexture);
    
}

async function selectionSortAnimation(customArray, highlightGradientTexture, highlightfGradientTexture, gradientTexture, highlightpGradientTexture, highlightbGradientTexture) {
    
    addButton();
    
    const n = customArray.length;

    let i;
    let j;
    let storeMin;

    for (i = 0; i < n - 1; i++) {

        updateShiftBlock(`[ ` + i + ` ]`);

        let minIdx = i;
        await hold();

        updateMinElem(parseFloat(customArray[i]));
        updateMinIndx(`[ ` + i + ` ]`);

        await comparitorHighlight(i, highlightpGradientTexture);
       
        for (j = i + 1; j < n; j++) {
            
            await hold();

            updateElem(parseFloat(customArray[j]));
            updateElemIndx(`[ ` + j + ` ]`);

            await highlightComparison(j, highlightGradientTexture);

            if (parseFloat(customArray[j]) < parseFloat(customArray[minIdx])) {
               
                minIdx = j;

                await resetColors(i, highlightbGradientTexture);
                await resetColors(storeMin , highlightbGradientTexture);

                await comparitorHighlight(minIdx , highlightpGradientTexture);

                updateMinElem(parseFloat(customArray[j]));
                updateMinIndx(`[ ` + j + ` ]`);

                storeMin = minIdx;

            }
            else 
                    await resetColors(j , highlightbGradientTexture);
        }

        updateElem(` - `);
        updateElemIndx(`[ - ]`);

        await hold();

        if (minIdx !== i) {
        
            const bar1Position = groups[i].children.find(child => child instanceof THREE.Mesh).position.clone();
            const bar2Position = groups[minIdx].children.find(child => child instanceof THREE.Mesh).position.clone();

            highlightComparison2(i, highlightGradientTexture);
            highlightComparison2(minIdx , highlightGradientTexture);

            await animateSwap(i, minIdx, customArray, bar1Position, bar2Position);

            updateMinElem(parseFloat(customArray[i]));
            updateMinIndx(`[ ` + i + ` ]`);

            await swapGroupChildren(i ,minIdx);

            [customArray[i], customArray[minIdx]] = [customArray[minIdx], customArray[i]];

            await resetColors(minIdx, highlightbGradientTexture);
        }
        await hold();
        await finalBarHighlight(i, highlightfGradientTexture);
    }

        updateElem(` - `);
        updateElemIndx(`[ - ]`);
        updateMinElem(` - `);
        updateMinIndx(`[ - ]`);
        updateShiftBlock(`[ - ]`);
}

async function swapGroupChildren(index1, index2) {
    let group1 = groups[index1];
    let group2 = groups[index2];

    if (group1 && group2) {

        const originalPositionGroup1 = group1.position.clone();
        const originalPositionGroup2 = group2.position.clone();

        const childrenGroup1 = group1.children.slice();

        const childrenGroup2 = group2.children.slice();

        group1.remove(...group1.children);

        group2.remove(...group2.children);

        group2.add(...childrenGroup1);

        group1.position.copy(originalPositionGroup2);

        group1.add(...childrenGroup2);

        group2.position.copy(originalPositionGroup1);
    }
}

async function highlightComparison(index1, originalTexture) {

    const group1 = groups[index1];

    if (group1){
        
        const bar1 = group1.children.find(child => child instanceof THREE.Mesh);

        if(bar1){

            const highlightedTexture1 = originalTexture.clone();

            const canvas1 = createHighlightedCanvas(originalTexture.image.width, originalTexture.image.height);

            const ctx1 = canvas1.getContext('2d');

            const gradient1 = ctx1.createLinearGradient(0, 0, 0, originalTexture.image.height);

            gradient1.addColorStop(0, '#2b2b2b');
            gradient1.addColorStop(1, '#ffff00');

            ctx1.fillStyle = gradient1;
            ctx1.fillRect(0, 0, canvas1.width, canvas1.height);

            highlightedTexture1.image = canvas1;
            highlightedTexture1.needsUpdate = true;

            bar1.material = new THREE.MeshStandardMaterial({ map: highlightedTexture1.clone() });

            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }
}

async function highlightComparison2(index1, originalTexture) {

const group1 = groups[index1];

if (group1){
    
    const bar1 = group1.children.find(child => child instanceof THREE.Mesh);

    if(bar1){

        const highlightedTexture1 = originalTexture.clone();

        const canvas1 = createHighlightedCanvas(originalTexture.image.width, originalTexture.image.height);

        const ctx1 = canvas1.getContext('2d');

        const gradient1 = ctx1.createLinearGradient(0, 0, 0, originalTexture.image.height);

        gradient1.addColorStop(0, '#2b2b2b');
        gradient1.addColorStop(1, '#ff0000');

        ctx1.fillStyle = gradient1;
        ctx1.fillRect(0, 0, canvas1.width, canvas1.height);

        highlightedTexture1.image = canvas1;
        highlightedTexture1.needsUpdate = true;

        bar1.material = new THREE.MeshStandardMaterial({ map: highlightedTexture1.clone() });

        await new Promise(resolve => setTimeout(resolve, 500));
    }
}
}

function SortFinishHighlight(index1, originalTexture) {

for( let i = 0 ; i < index1 ; i++){

const group = groups[i];

if (group){
    
    const bar = group.children.find(child => child instanceof THREE.Mesh);

    if(bar){

        const highlightedTexture1 = originalTexture.clone();

        const canvas1 = createHighlightedCanvas(originalTexture.image.width, originalTexture.image.height);

        const ctx1 = canvas1.getContext('2d');

        const gradient1 = ctx1.createLinearGradient(0, 0, 0, originalTexture.image.height);

        gradient1.addColorStop(0, '#2b2b2b');
        gradient1.addColorStop(1, '#00ff11');

        ctx1.fillStyle = gradient1;
        ctx1.fillRect(0, 0, canvas1.width, canvas1.height);

        highlightedTexture1.image = canvas1;
        highlightedTexture1.needsUpdate = true;

        bar.material = new THREE.MeshStandardMaterial({ map: highlightedTexture1.clone() });

    }
    }
}
}

async function resetColors(index1, originalTexture) {

const group = groups[index1];

if (group){
    
    const bar = group.children.find(child => child instanceof THREE.Mesh);

    if(bar)
        {

        const highlightedTexture1 = originalTexture.clone();

        const canvas1 = createHighlightedCanvas(originalTexture.image.width, originalTexture.image.height);

        const ctx1 = canvas1.getContext('2d');

        const gradient1 = ctx1.createLinearGradient(0, 0, 0, originalTexture.image.height);

        gradient1.addColorStop(0, '#2b2b2b');
        gradient1.addColorStop(1, '#00d5ff');

        ctx1.fillStyle = gradient1;
        ctx1.fillRect(0, 0, canvas1.width, canvas1.height);

        highlightedTexture1.image = canvas1;
        highlightedTexture1.needsUpdate = true;

        bar.material = new THREE.MeshStandardMaterial({ map: highlightedTexture1.clone() });

    }
    }
}

async function finalBarHighlight(index1, originalTexture) {

    const group1 = groups[index1];

    if (group1){
        
        const bar1 = group1.children.find(child => child instanceof THREE.Mesh);

        if(bar1){

            const highlightedTexture1 = originalTexture.clone();

            const canvas1 = createHighlightedCanvas(originalTexture.image.width, originalTexture.image.height);

            const ctx1 = canvas1.getContext('2d');

            const gradient1 = ctx1.createLinearGradient(0, 0, 0, originalTexture.image.height);

            gradient1.addColorStop(0, '#2b2b2b');
            gradient1.addColorStop(1, '#ff6600');

            ctx1.fillStyle = gradient1;
            ctx1.fillRect(0, 0, canvas1.width, canvas1.height);

            highlightedTexture1.image = canvas1;
            highlightedTexture1.needsUpdate = true;

            bar1.material = new THREE.MeshStandardMaterial({ map: highlightedTexture1.clone() });

            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }
}

async function comparitorHighlight(index1, originalTexture) {

const group1 = groups[index1];

if (group1){
    
    const bar1 = group1.children.find(child => child instanceof THREE.Mesh);

    if(bar1){

        const highlightedTexture1 = originalTexture.clone();

        const canvas1 = createHighlightedCanvas(originalTexture.image.width, originalTexture.image.height);

        const ctx1 = canvas1.getContext('2d');

        const gradient1 = ctx1.createLinearGradient(0, 0, 0, originalTexture.image.height);

        gradient1.addColorStop(0, '#2b2b2b');
        gradient1.addColorStop(1, '#ff00bf');

        ctx1.fillStyle = gradient1;
        ctx1.fillRect(0, 0, canvas1.width, canvas1.height);

        highlightedTexture1.image = canvas1;
        highlightedTexture1.needsUpdate = true;

        bar1.material = new THREE.MeshStandardMaterial({ map: highlightedTexture1.clone() });

        await new Promise(resolve => setTimeout(resolve, 500));
    }
}
}

function createHighlightedCanvas(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
}

function createCanvasTexture(width, height, color) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return new THREE.CanvasTexture(canvas);
}

async function animateSwap(index1, index2, customArray, bar1Position, bar2Position) {

let distance;

if(index1 > index2)
{
    distance = index1 - index2;

    if (groups[index1] && groups[index2]) {
    console.log('Initial positions:');
    console.log('Bar 1:', bar1Position);
    console.log('Bar 2:', bar2Position);

    const sidePath = 120;

    const tween1 = new TWEEN.Tween(groups[index2].position)
        .to({ z: groups[index2].position.z - (sidePath * distance) }, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
        tweens.push(tween1);

    const tween2 = new TWEEN.Tween(groups[index1].position)
        .to({ z: groups[index1].position.z + (sidePath * distance) }, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
        tweens.push(tween2);

    await new Promise(resolve => {
        tween1.chain(tween2);
        tween2.onComplete(resolve);
    });

    console.log('Halfway positions:');
    console.log('Bar 1:', bar1Position);
    console.log('Bar 2:', bar2Position);

    const tween3 = new TWEEN.Tween(groups[index2].position)
        .to({ x: groups[index2].position.x + (sidePath * distance) }, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
        tweens.push(tween3);

    const tween4 = new TWEEN.Tween(groups[index1].position)
        .to({ x: groups[index1].position.x - (sidePath * distance) }, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
        tweens.push(tween4);

    await new Promise(resolve => {
        tween3.chain(tween4);
        tween4.onComplete(resolve);
    }); 
    }
}

else if(index1 < index2)
{
    distance = index2 - index1;

if (groups[index1] && groups[index2]) {
    console.log('Initial positions:');
    console.log('Bar 1:', bar1Position);
    console.log('Bar 2:', bar2Position);

    const sidePath = 120;

    const tween1 = new TWEEN.Tween(groups[index1].position)
        .to({ z: groups[index1].position.z - (sidePath * distance) }, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
        tweens.push(tween1);

    const tween2 = new TWEEN.Tween(groups[index2].position)
        .to({ z: groups[index2].position.z + (sidePath * distance) }, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
        tweens.push(tween2);

    await new Promise(resolve => {
        tween1.chain(tween2);
        tween2.onComplete(resolve);
    });

    console.log('Halfway positions:');
    console.log('Bar 1:', bar1Position);
    console.log('Bar 2:', bar2Position);

    const tween3 = new TWEEN.Tween(groups[index1].position)
        .to({ x: groups[index1].position.x + (sidePath * distance) }, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
        tweens.push(tween3);

    const tween4 = new TWEEN.Tween(groups[index2].position)
        .to({ x: groups[index2].position.x - (sidePath * distance) }, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
        tweens.push(tween4);

    await new Promise(resolve => {
        tween3.chain(tween4);
        tween4.onComplete(resolve);
    }); 
    }
}
}

const d_gometry = new THREE.BoxGeometry(1,1,1);
        const d_material = new THREE.MeshBasicMaterial({color : 0xffffff});
        const dummy = new THREE.Mesh(d_gometry,d_material);
        const d_pos = new THREE.Vector3(10000,10000,10000);
        dummy.position.copy(d_pos);
        scene.add(dummy); 

async function hold() {
    return new Promise(resolve => {
        const d_tween = new TWEEN.Tween(d_pos)
            .to({ y: dummy.position.y + 100 }, 10)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onComplete(resolve)
            .start();
        tweens.push(d_tween);

        console.log('test_fx', dummy.position);
    });
}

document.getElementById('scrollToPage3').addEventListener('click', async function () {
    
    const userValues = JSON.parse(localStorage.getItem('userValues'));
    console.log('Retrieved userValues:', userValues);
    
    if (userValues) {
        
        await createBars(userValues);

        renderer.render(scene, camera);
    } else {
        console.error('No user input values found in local storage.');
    }
});

async function animateBars() {
    const numGroups = groups.length;
    const delayBetweenGroups = 1000;
    const animations = [];

    for (let i = 0; i < numGroups; i++) {
        const group = groups[i];

        const tween = new TWEEN.Tween(group.position)
            .to({ y: 1000 }, 2000)
            .delay(i * delayBetweenGroups)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();

        console.log('Animating bars:', i);
        console.log('group pos', groups[i].position);
        animations.push(new Promise(resolve => tween.onComplete(resolve)));
    }
    await Promise.all(animations);
    console.log('Bars animation completed');
}

function addButton() {
            
            const button = document.getElementById('PlayPause_button');
            button.style.display = 'block';
        }
        
        function removeButton() {

            const button = document.getElementById('PlayPause_button');
            button.style.display = 'none';
        }

let animationPaused = false;
let tweens = [];

function animate() {
    if (!animationPaused){
    requestAnimationFrame(animate);
    TWEEN.update();
    controls.update();
    renderer.render(scene, camera);
    }
}

function toggleAnimation() {
    animationPaused = !animationPaused;
    const button = document.getElementById('PlayPause_button');
    if (animationPaused) {
        button.style.backgroundImage = "url('https://i.imgur.com/6fD4Lse.jpeg')";

        tweens.forEach(tween => {
        tween.pause();
    });
}

 else {
        button.style.backgroundImage = "url('https://i.imgur.com/0pmy3io.jpeg')";
        animate();
        
        tweens.forEach(tween => {
        tween.resume();
    });
}
}

animate();

removeButton();

document.getElementById('PlayPause_button').addEventListener('click', toggleAnimation);