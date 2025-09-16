import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import GUI from 'lil-gui';

function ThreeDChartViewer({ xAxisData, yAxisData, chartType: parentChartType }) {
  const mountRef = useRef(null);
  const tooltipRef = useRef(null);
  const [chartType, setChartType] = useState(parentChartType || 'bar');
  const [showLabels, setShowLabels] = useState(true);
  const [background, setBackground] = useState('#6B7280');

  useEffect(() => {
    setChartType(parentChartType);
  }, [parentChartType]);

  useEffect(() => {
    if (!xAxisData.length || !yAxisData.length) return;

    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(background);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(40, 50, 100);

    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    mount.innerHTML = '';
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.2;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(30, 60, 30);
    dirLight.castShadow = true;
    scene.add(ambientLight, dirLight);

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(1000, 1000),
      new THREE.ShadowMaterial({ opacity: 0.3 })
    );
    plane.rotation.x = -Math.PI / 2;
    plane.receiveShadow = true;
    scene.add(plane);

    const group = new THREE.Group();
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const interactiveObjects = [];

    const getLabelColor = (bgHex) => {
      const color = new THREE.Color(bgHex);
      const luminance = 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b;
      return luminance > 0.5 ? '#000000' : '#ffffff';
    };

    const labelColor = getLabelColor(background);

    const createTextLabel = (text) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      ctx.font = '20px Arial';
      canvas.width = ctx.measureText(text).width + 20;
      canvas.height = 30;
      ctx.fillStyle = labelColor;
      ctx.fillText(text, 10, 20);
      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
      const sprite = new THREE.Sprite(material);
      sprite.scale.set(10, 5, 1);
      return sprite;
    };

    if (chartType === 'bar') {
      const spacing = 8;
      const maxVal = Math.max(...yAxisData);
      yAxisData.forEach((val, i) => {
        const height = (val / maxVal) * 30;
        const geometry = new THREE.BoxGeometry(3, 1, 3);
        const material = new THREE.MeshStandardMaterial({ color: new THREE.Color(`hsl(${i * 40}, 80%, 60%)`) });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(i * spacing, height / 2, 0);
        mesh.scale.y = height;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        mesh.userData = {
          label: xAxisData[i],
          value: val,
          originalY: mesh.position.y,
          hoverY: mesh.position.y + 2
        };

        group.add(mesh);
        interactiveObjects.push(mesh);

        if (showLabels) {
          const label = createTextLabel(`${val}`);
          label.position.set(i * spacing, height + 2, 0);
          group.add(label);
        }
      });
    } else if (chartType === 'pie') {
      const total = yAxisData.reduce((sum, val) => sum + val, 0);
      let startAngle = 0;
      yAxisData.forEach((val, i) => {
        const angle = (val / total) * Math.PI * 2;
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.absarc(0, 0, 25, startAngle, startAngle + angle);
        shape.lineTo(0, 0);

        const geometry = new THREE.ExtrudeGeometry(shape, { depth: 4, bevelEnabled: false });
        const material = new THREE.MeshStandardMaterial({ color: new THREE.Color(`hsl(${i * 60}, 70%, 60%)`) });
        const slice = new THREE.Mesh(geometry, material);
        slice.rotation.x = -Math.PI / 2;
        slice.userData = {
          label: xAxisData[i],
          value: val,
          originalY: 0,
          hoverY: 3
        };
        slice.castShadow = true;
        slice.receiveShadow = true;
        group.add(slice);
        interactiveObjects.push(slice);

        if (showLabels) {
          const midAngle = startAngle + angle / 2;
          const label = createTextLabel(`${val}`);
          label.position.set(Math.cos(midAngle) * 30, 6, Math.sin(midAngle) * 30);
          group.add(label);
        }

        startAngle += angle;
      });
    }

    scene.add(group);

    let hovered = null;

    const animate = () => {
      requestAnimationFrame(animate);
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveObjects);

      interactiveObjects.forEach((obj) => {
        if (obj !== hovered && obj.userData.originalY !== undefined) {
          obj.position.y += (obj.userData.originalY - obj.position.y) * 0.2;
        }
      });

      if (intersects.length > 0) {
        const first = intersects[0].object;
        if (first !== hovered) hovered = first;
        if (first.userData.hoverY !== undefined) {
          first.position.y += (first.userData.hoverY - first.position.y) * 0.2;
        }
        // Tooltip update
        const tooltip = tooltipRef.current;
        if (tooltip && first.userData) {
          tooltip.style.display = 'block';
          tooltip.innerHTML = `<strong>${first.userData.label}</strong><br/>Value: ${first.userData.value}`;
        }
      } else {
        hovered = null;
        if (tooltipRef.current) tooltipRef.current.style.display = 'none';
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const guiOptions = { background };
    const gui = new GUI();
    gui.addColor(guiOptions, 'background').onChange((val) => {
      setBackground(val);
      scene.background = new THREE.Color(val);
    });
    gui.add({ showLabels }, 'showLabels').onChange(setShowLabels);

    mount.addEventListener('mousemove', (event) => {
      const rect = mount.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      if (tooltipRef.current) {
        tooltipRef.current.style.left = `${event.clientX + 10}px`;
        tooltipRef.current.style.top = `${event.clientY + 10}px`;
      }
    });

    return () => {
      gui.destroy();
      mount.innerHTML = '';
    };
  }, [xAxisData, yAxisData, chartType, showLabels, background]);

  const exportToPNG = () => {
    const canvas = mountRef.current.querySelector('canvas');
    canvas.toBlob((blob) => saveAs(blob, '3d_chart.png'));
  };

  const exportToPDF = () => {
    const canvas = mountRef.current.querySelector('canvas');
    const pdf = new jsPDF();
    pdf.addImage(canvas.toDataURL(), 'PNG', 10, 10, 180, 100);
    pdf.save('3d_chart.pdf');
  };

  return (
    <div className="space-y-4 relative">
      <div className="flex flex-wrap gap-3 items-center">
        <label className="font-medium">Chart Type:</label>
        {['bar', 'pie'].map((type) => (
          <button
            key={type}
            onClick={() => setChartType(type)}
            className={`px-4 py-1 rounded font-medium border transition ${
              chartType === type
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white border-gray-300 dark:border-gray-600'
            }`}
          >
            {type === 'bar' ? '3D Bar' : '3D Pie'}
          </button>
        ))}
        <label className="ml-4">Labels:</label>
        <input type="checkbox" checked={showLabels} onChange={(e) => setShowLabels(e.target.checked)} />
        <button onClick={exportToPNG} className="ml-auto px-3 py-1 bg-green-600 text-white rounded">
          Download PNG
        </button>
        <button onClick={exportToPDF} className="px-3 py-1 bg-blue-600 text-white rounded">
          Download PDF
        </button>
      </div>

      <div ref={mountRef} style={{ height: '500px', width: '100%' }} className="rounded shadow overflow-hidden" />
      <div
        ref={tooltipRef}
        style={{
          position: 'absolute',
          display: 'none',
          background: '#111',
          color: '#fff',
          padding: '6px 10px',
          borderRadius: '6px',
          pointerEvents: 'none',
          fontSize: '14px',
          zIndex: 10
        }}
      ></div>
    </div>
  );
}

export default ThreeDChartViewer;