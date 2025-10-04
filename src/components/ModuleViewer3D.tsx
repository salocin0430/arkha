'use client';

import React, { useRef, useState, useEffect, useCallback, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, 
  TransformControls, 
  Html, 
  useGLTF, 
  Environment, 
  useProgress,
  Grid
} from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import ModuleConfigService, { ModuleConfig, ArkhaModulesConfig } from '@/services/ModuleConfigService';

// Componente de carga
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center p-8">
        <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden mb-4">
          <div 
            className="h-full bg-gradient-to-r from-[#0042A6] to-[#EAFE07] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-white text-lg font-medium">
          Cargando módulos ARKHA... {progress.toFixed(0)}%
        </div>
      </div>
    </Html>
  );
}

// Componente para el modelo 3D - exactamente como en tu proyecto anterior
function ModuleModel({ moduleConfig, onSelect }: { 
  moduleConfig: ModuleConfig; 
  isSelected?: boolean;
  onSelect?: (object: THREE.Object3D | null) => void;
}) {
  const { scene } = useGLTF(moduleConfig.path);
  const groupRef = useRef<THREE.Group>(null);
  
  useEffect(() => {
    if (scene && groupRef.current) {
      // Clonar la escena para evitar conflictos
      const clonedScene = scene.clone();
      
      // Configurar el objeto como interactivo (como en tu proyecto)
      clonedScene.userData = {
        id: moduleConfig.id,
        name: moduleConfig.name,
        type: moduleConfig.type,
        description: moduleConfig.description,
        image: moduleConfig.image,
        price: moduleConfig.price,
        currency: moduleConfig.currency,
        interactive: true
      };
      
      // Aplicar propiedades de material
      clonedScene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          
          // Marcar como interactivo para el raycaster
          child.userData.interactive = true;
          
          // Aplicar propiedades de material si están definidas
          if (moduleConfig.materialProperties && child.material) {
            const material = child.material as THREE.MeshStandardMaterial;
            
            if (moduleConfig.materialProperties.roughness !== undefined) {
              material.roughness = moduleConfig.materialProperties.roughness;
            }
            if (moduleConfig.materialProperties.metalness !== undefined) {
              material.metalness = moduleConfig.materialProperties.metalness;
            }
            if (moduleConfig.materialProperties.emissiveIntensity !== undefined) {
              material.emissiveIntensity = moduleConfig.materialProperties.emissiveIntensity;
            }
            
            material.needsUpdate = true;
          }
        }
      });
      
      // Limpiar el grupo anterior
      while (groupRef.current.children.length > 0) {
        groupRef.current.remove(groupRef.current.children[0]);
      }
      
      // Agregar la escena clonada
      groupRef.current.add(clonedScene);
    }
  }, [scene, moduleConfig]);
  
  if (!scene) {
    return null;
  }
  
  return (
    <group
      ref={groupRef}
      scale={moduleConfig.scale} 
      position={moduleConfig.position} 
      rotation={moduleConfig.rotation}
      onClick={(e) => {
        e.stopPropagation();
        console.log('Módulo clickeado:', moduleConfig.name);
        if (onSelect && groupRef.current) {
          // Asegurar que el userData esté completo en el objeto Three.js
          if (!groupRef.current.userData || !groupRef.current.userData.id) {
            groupRef.current.userData = {
              id: moduleConfig.id,
              name: moduleConfig.name,
              type: moduleConfig.type,
              description: moduleConfig.description,
              image: moduleConfig.image,
              price: moduleConfig.price,
              currency: moduleConfig.currency,
              interactive: true
            };
          }
          onSelect(groupRef.current);
        }
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'auto';
      }}
    />
  );
}

// Panel de detalles para el módulo seleccionado
function ModuleDetailsPanel({ selectedModule, onClose, onReset }: {
  selectedModule: THREE.Object3D | null;
  onClose: () => void;
  onReset: () => void;
}) {
  if (!selectedModule) return null;
  
  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      className="fixed right-0 top-0 h-full w-96 bg-gradient-to-b from-[#0042A6] to-[#07173F] shadow-2xl z-50 overflow-y-auto"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">{selectedModule.userData?.name || 'Módulo'}</h3>
          <button 
            onClick={onClose} 
            className="text-white hover:text-[#EAFE07] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4">
          {selectedModule.userData?.image && (
            <div className="mb-4">
              <img 
                src={selectedModule.userData.image} 
                alt={selectedModule.userData?.name || 'Módulo'}
                className="w-full h-48 object-cover rounded-lg shadow-lg"
              />
            </div>
          )}
          
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-sm text-gray-300 mb-1">Tipo</div>
            <div className="text-white font-medium">{selectedModule.userData?.type || 'Módulo'}</div>
          </div>
          
          {selectedModule.userData?.description && (
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-sm text-gray-300 mb-2">Descripción</div>
              <div className="text-white text-sm leading-relaxed">{selectedModule.userData.description}</div>
            </div>
          )}
          
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-sm text-gray-300 mb-2">Posición</div>
            <div className="text-white text-sm font-mono">
              X: {selectedModule.position.x.toFixed(2)}, 
              Y: {selectedModule.position.y.toFixed(2)}, 
              Z: {selectedModule.position.z.toFixed(2)}
            </div>
          </div>
          
          {selectedModule.userData?.price !== undefined && typeof selectedModule.userData?.price === 'number' && (
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-sm text-gray-300 mb-1">Precio</div>
              <div className="text-[#EAFE07] font-bold text-lg">
                {selectedModule.userData.price} {selectedModule.userData.currency || 'ARKHA'}
              </div>
            </div>
          )}
          
          <div className="pt-4">
            <button 
              onClick={onReset}
              className="w-full bg-[#EAFE07] text-[#0042A6] font-bold py-3 px-4 rounded-lg hover:bg-yellow-300 transition-colors"
            >
              Restablecer Posición
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Escena principal
function ModuleScene({ modulesConfig }: { modulesConfig: ArkhaModulesConfig }) {
  const [selectedModule, setSelectedModule] = useState<THREE.Object3D | null>(null);
  const [transformMode, setTransformMode] = useState<'translate' | 'rotate' | 'scale'>('translate');
  const [viewMode, setViewMode] = useState<'orbit' | 'firstPerson' | 'fly'>('orbit');
  const [cameraPosition, setCameraPosition] = useState(modulesConfig.cameraPosition);
  const [cameraTarget, setCameraTarget] = useState(modulesConfig.cameraTarget);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isTransforming, setIsTransforming] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const transformRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const transformTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Función de selección exacta como en tu proyecto anterior
  const selectObject = useCallback((object: THREE.Object3D | null) => {
    console.log('Seleccionando objeto:', object?.userData?.name || 'desconocido');
    
    // Actualizar el estado
    setSelectedModule(object);
    
    // Adjuntar los controles al objeto seleccionado
    if (object && transformRef.current) {
      transformRef.current.attach(object);
      
      // Configurar el evento inmediatamente después de adjuntar
      setTimeout(() => {
        if (transformRef.current && controlsRef.current) {
          console.log('🔧 Configurando evento inmediatamente después de attach');
          const transformControls = transformRef.current;
          const orbitControls = controlsRef.current;
          
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const handleDraggingChanged = (event: any) => {
            console.log('🔄 Dragging changed (inmediato):', event.value);
            orbitControls.enabled = !event.value;
          };
          
          // Remover listener anterior si existe
          transformControls.removeEventListener('dragging-changed', handleDraggingChanged);
          
          // Agregar nuevo listener
          transformControls.addEventListener('dragging-changed', handleDraggingChanged);
          console.log('✅ Event listener agregado inmediatamente');
        }
      }, 10);
    } else if (transformRef.current) {
      transformRef.current.detach();
    }
  }, []);

  // Referencias para Three.js (como en tu proyecto)
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.Camera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  
  // Estados para primera persona - EXACTAMENTE como tu proyecto de referencia
  const [keysPressed, setKeysPressed] = useState({
    w: false, a: false, s: false, d: false
  });

  // Función para configurar la cámara para primera persona
  const setupFirstPersonCamera = useCallback(() => {
    if (!cameraRef.current || !controlsRef.current) return;
    
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    
    if (viewMode === 'firstPerson') {
      console.log('🎯 Configurando cámara para primera persona');
      
      // Posición de primera persona (altura de persona)
      camera.position.set(0, 1.7, 5);
      controls.target.set(0, 1.7, 0); // Mirar al frente a la altura de los ojos
      
      // ✅ HABILITAR OrbitControls para rotación con mouse (como en tu proyecto)
      controls.enabled = true;
      controls.update();
    } else if (viewMode === 'fly') {
      console.log('🎯 Configurando cámara para vuelo');
      
      // Posición de vuelo
      camera.position.set(0, 3, 5);
      controls.target.set(0, 3, 0); // Mirar al frente a la altura de vuelo
      
      // ✅ HABILITAR OrbitControls para rotación con mouse (como en tu proyecto)
      controls.enabled = true;
      controls.update();
    } else {
      console.log('🎯 Restaurando vista normal');
      
      // Restaurar vista normal
      camera.position.set(modulesConfig.cameraPosition[0], modulesConfig.cameraPosition[1], modulesConfig.cameraPosition[2]);
      controls.target.set(modulesConfig.cameraTarget[0], modulesConfig.cameraTarget[1], modulesConfig.cameraTarget[2]);
      camera.rotation.set(0, 0, 0);
      
      // Habilitar OrbitControls en modo órbita
      controls.enabled = true;
      controls.update();
    }
  }, [viewMode, modulesConfig.cameraPosition, modulesConfig.cameraTarget]);

  // Función para mover la cámara según las teclas presionadas - EXACTAMENTE como tu proyecto
  const updateCameraPosition = useCallback(() => {
    if (!cameraRef.current || !controlsRef.current) return;
    
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    
    // Verificar si hay alguna tecla presionada
    if (!keysPressed.w && !keysPressed.a && !keysPressed.s && !keysPressed.d) return;
    
    // Obtener la dirección de la cámara usando quaternion (como en tu proyecto de referencia)
    const direction = new THREE.Vector3(0, 0, -1);
    direction.applyQuaternion(camera.quaternion);
    direction.y = 0; // Mantener movimiento horizontal
    direction.normalize();
    
    // Vector derecha (perpendicular a la dirección)
    const right = new THREE.Vector3(1, 0, 0);
    right.applyQuaternion(camera.quaternion);
    right.y = 0; // Mantener movimiento horizontal
    right.normalize();
    
    // Velocidad de movimiento
    const speed = 0.07;
    
    // Aplicar movimiento según las teclas presionadas
    if (keysPressed.w) {
      camera.position.x += direction.x * speed;
      camera.position.z += direction.z * speed;
    }
    if (keysPressed.s) {
      camera.position.x -= direction.x * speed;
      camera.position.z -= direction.z * speed;
    }
    
    // Movimiento lateral
    if (keysPressed.a) {
      camera.position.x -= right.x * speed;
      camera.position.z -= right.z * speed;
    }
    if (keysPressed.d) {
      camera.position.x += right.x * speed;
      camera.position.z += right.z * speed;
    }
    
    // Actualizar el punto de mira (EXACTAMENTE como en tu proyecto de referencia)
    controls.target.set(
      camera.position.x + direction.x,  // ✅ Distancia de 1 unidad
      controls.target.y,
      camera.position.z + direction.z
    );
    
    controls.update();
  }, [keysPressed]);

  // Event listeners para teclado - EXACTAMENTE como tu proyecto
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (viewMode === 'orbit') {
        console.log('🚫 Modo órbita - ignorando tecla:', event.key);
        return;
      }
      
      const key = event.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'q', 'e'].includes(key)) {
        event.preventDefault();
        console.log('⌨️ Tecla presionada:', key, 'Modo:', viewMode);
        setKeysPressed(prev => {
          const newState = { ...prev, [key]: true };
          console.log('🎮 Nuevo estado de teclas:', newState);
          return newState;
        });
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'q', 'e'].includes(key)) {
        event.preventDefault();
        console.log('⌨️ Tecla soltada:', key);
        setKeysPressed(prev => {
          const newState = { ...prev, [key]: false };
          console.log('🎮 Nuevo estado de teclas:', newState);
          return newState;
        });
      }
    };

    if (viewMode !== 'orbit') {
      console.log('🎧 Agregando event listeners de teclado para modo:', viewMode);
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      return () => {
        console.log('🎧 Removiendo event listeners de teclado');
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    } else {
      console.log('🚫 Modo órbita - no agregando event listeners de teclado');
    }
  }, [viewMode]);

  // ❌ Controles de mouse ELIMINADOS - OrbitControls maneja la rotación automáticamente

  // Bucle de animación - EXACTAMENTE como tu proyecto de referencia
  useEffect(() => {
    if (viewMode === 'orbit') return;
    
    console.log('🚀 Iniciando bucle de animación para control por teclado, modo:', viewMode);
    
    let animationId: number;
    
    const animate = () => {
      // Actualizar la posición de la cámara según las teclas presionadas
      updateCameraPosition();
      
      // Solicitar el siguiente frame
      animationId = requestAnimationFrame(animate);
    };
    
    // Iniciar el bucle
    animationId = requestAnimationFrame(animate);
    
    // Limpiar al desmontar
    return () => {
      console.log('🛑 Deteniendo bucle de animación');
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [viewMode, updateCameraPosition]);

  // Configurar cámara cuando cambia el modo de vista
  useEffect(() => {
    setupFirstPersonCamera();
  }, [setupFirstPersonCamera]);

  // Evento dragging-changed exactamente como en tu proyecto anterior
  useEffect(() => {
    console.log('🔧 Configurando dragging-changed, selectedModule:', selectedModule?.userData?.name);
    console.log('🔧 transformRef.current:', !!transformRef.current);
    console.log('🔧 controlsRef.current:', !!controlsRef.current);
    
    if (transformRef.current && controlsRef.current) {
      const transformControls = transformRef.current;
      const orbitControls = controlsRef.current;
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const handleDraggingChanged = (event: any) => {
        console.log('🔄 Dragging changed:', event.value, 'orbitControls.enabled:', orbitControls.enabled);
        orbitControls.enabled = !event.value;
        console.log('🔄 Después del cambio - orbitControls.enabled:', orbitControls.enabled);
      };
      
      // Remover listener anterior si existe
      transformControls.removeEventListener('dragging-changed', handleDraggingChanged);
      
      // Agregar nuevo listener
      transformControls.addEventListener('dragging-changed', handleDraggingChanged);
      console.log('✅ Event listener agregado');
      
      return () => {
        console.log('🧹 Limpiando event listener');
        transformControls.removeEventListener('dragging-changed', handleDraggingChanged);
      };
    } else {
      console.log('❌ No se pudo configurar - referencias no disponibles');
    }
  }, [selectedModule]);

  
  // Resetear la posición del módulo seleccionado
  const resetModulePosition = () => {
    if (selectedModule) {
      console.log('Reseteando módulo:', selectedModule.userData?.name || 'Módulo');
      selectedModule.position.set(0, 0, 0);
      selectedModule.rotation.set(0, 0, 0);
      selectedModule.scale.set(1, 1, 1);
      
      // Forzar actualización
      if (selectedModule.updateMatrixWorld) {
        selectedModule.updateMatrixWorld();
      }
    }
  };

  return (
    <>
      <style jsx global>{`
        /* Ocultar el cubo amarillo del TransformControls */
        .transform-controls .box-helper {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
        }
        
        /* Ocultar el gizmo central */
        .transform-controls .gizmo {
          display: none !important;
        }
        
        /* Ocultar cualquier elemento de selección central */
        .transform-controls [class*="box"],
        .transform-controls [class*="gizmo"],
        .transform-controls [class*="helper"] {
          display: none !important;
        }
      `}</style>
      <Canvas 
        shadows 
        camera={{ 
          position: cameraPosition, 
          fov: 75 
        }} 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onClick={(e: any) => {
          if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;
          
          // Calcular posición del mouse normalizada
          const rect = rendererRef.current.domElement.getBoundingClientRect();
          const mouse = new THREE.Vector2();
          mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
          
          // Lanzar rayo desde la cámara
          const raycaster = new THREE.Raycaster();
          raycaster.setFromCamera(mouse, cameraRef.current);
          
          // Obtener solo los objetos interactivos para intersección
          const selectableObjects: THREE.Object3D[] = [];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          sceneRef.current.traverse((object: any) => {
            if (object.isMesh && object.userData && object.userData.interactive === true) {
              selectableObjects.push(object);
            }
          });
          
          // Calcular intersecciones
          const intersects = raycaster.intersectObjects(selectableObjects, false);
          
          if (intersects.length > 0) {
            // Encontrar el objeto raíz
            let selectedObj = intersects[0].object;
            
            // Si el objeto es parte de un grupo, seleccionar el grupo
            while (selectedObj.parent && selectedObj.parent !== sceneRef.current && selectedObj.parent.type !== 'Scene') {
              if (selectedObj.parent.userData && selectedObj.parent.userData.id) {
                selectedObj = selectedObj.parent;
                break;
              }
              selectedObj = selectedObj.parent;
            }
            
            // Seleccionar el objeto
            selectObject(selectedObj);
          } else {
            // Si no hay intersección, deseleccionar el objeto actual
            selectObject(null);
          }
        }}
        style={{ background: 'linear-gradient(135deg, #0042A6 0%, #07173F 100%)' }}
        onCreated={({ scene, camera, gl }) => {
          sceneRef.current = scene;
          cameraRef.current = camera;
          rendererRef.current = gl;
        }}
      >
        {/* Iluminación */}
        <ambientLight 
          color={modulesConfig.lighting.ambient.color}
          intensity={modulesConfig.lighting.ambient.intensity} 
        />
        <directionalLight 
          color={modulesConfig.lighting.directional.color}
          intensity={modulesConfig.lighting.directional.intensity}
          position={modulesConfig.lighting.directional.position}
          castShadow={modulesConfig.lighting.directional.castShadow}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        
        {/* Entorno */}
        <Environment preset="night" />
        
        {/* Grid */}
        <Grid 
          args={[20, 20]} 
          position={[0, 0, 0]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#EAFE07"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#0042A6"
          fadeDistance={30}
          fadeStrength={1}
          followCamera={false}
          infiniteGrid={true}
        />
        
        {/* Modelo base */}
        {modulesConfig.baseModel && !modulesConfig.baseModel.hidden && (
          <Suspense fallback={<Loader />}>
            <ModuleModel 
              moduleConfig={modulesConfig.baseModel} 
              onSelect={selectObject}
            />
          </Suspense>
        )}
        
        {/* Módulos */}
        {modulesConfig.modules
          .filter(module => !module.hidden)
          .map((module) => (
            <Suspense key={module.id} fallback={<Loader />}>
              <ModuleModel 
                moduleConfig={module} 
                isSelected={selectedModule?.userData?.id === module.id}
                onSelect={selectObject}
              />
            </Suspense>
          ))
        }
        
        {/* Controles de órbita - SIEMPRE habilitados */}
        <OrbitControls 
          ref={controlsRef}
          enablePan={viewMode === 'orbit' && !isTransforming}
          enableZoom={true}  // ✅ Zoom habilitado en todos los modos
          enableRotate={true}  // ✅ Rotación habilitada en todos los modos
          target={cameraTarget}
          minDistance={viewMode === 'orbit' ? 5 : 0.5}
          maxDistance={viewMode === 'orbit' ? 50 : 100}
          enabled={true}  // ✅ SIEMPRE habilitado
        />
        
        {/* Controles de transformación - exactamente como en tu proyecto anterior */}
        {selectedModule && viewMode === 'orbit' && (
          <TransformControls
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ref={(ref: any) => {
              transformRef.current = ref;
              // Configurar el evento inmediatamente cuando se crea el TransformControls
              if (ref && controlsRef.current) {
                console.log('🔧 Configurando evento al crear TransformControls');
                const orbitControls = controlsRef.current;
                
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const handleDraggingChanged = (event: any) => {
                  console.log('🔄 Dragging changed (al crear):', event.value);
                  orbitControls.enabled = !event.value;
                };
                
                // Remover listener anterior si existe
                ref.removeEventListener('dragging-changed', handleDraggingChanged);
                
                // Agregar nuevo listener
                ref.addEventListener('dragging-changed', handleDraggingChanged);
                console.log('✅ Event listener agregado al crear TransformControls');
              }
            }}
            object={selectedModule}
            mode={transformMode}
            size={0.7}
            showX={true}
            showY={true}
            showZ={true}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onObjectChange={(e: any) => {
              if (e && e.target && typeof e.target === 'object' && e.target !== null) {
                const target = e.target;
                console.log('🔄 Transformando objeto:', {
                  position: { x: target.position.x, y: target.position.y, z: target.position.z },
                  rotation: { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z },
                  scale: { x: target.scale.x, y: target.scale.y, z: target.scale.z }
                });
              }
            }}
          />
        )}
      </Canvas>
      
      {/* Panel lateral de módulos */}
      <div className="fixed left-0 top-0 h-full w-80 bg-gradient-to-b from-[#0042A6] to-[#07173F] shadow-2xl z-40 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-[#EAFE07] rounded-lg mr-3 flex items-center justify-center">
              <span className="text-[#0042A6] font-bold text-sm">A</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">ARKHA</h2>
              <p className="text-sm text-gray-300">Space Modules</p>
            </div>
          </div>
          
                  {/* Información del modo actual */}
                  <div className="bg-white/10 rounded-lg p-4 mb-4">
                    <div className="text-sm text-gray-300 mb-2">Modo de Vista</div>
                    <div className="text-white font-medium capitalize flex items-center">
                      {viewMode}
                      {viewMode !== 'orbit' && (
                        <span className="ml-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      )}
                    </div>
                    {viewMode !== 'orbit' && (
                      <div className="text-xs text-gray-400 mt-2">
                        <div>WASD: Mover cámara</div>
                        <div>Mouse: Mirar alrededor</div>
                        <div>Scroll: Zoom</div>
                      </div>
                    )}
                  </div>
                  
                  {/* Estado de transformación */}
                  {selectedModule && viewMode === 'orbit' && (
                    <div className={`rounded-lg p-4 mb-4 ${isTransforming ? 'bg-green-500/20' : 'bg-[#EAFE07]/20'}`}>
                      <div className="text-sm text-[#EAFE07] mb-2">Módulo Seleccionado</div>
                      <div className="text-white font-medium">{selectedModule.userData?.name || 'Módulo'}</div>
                      <div className="text-xs text-gray-300 mt-1">
                        Modo: {transformMode === 'translate' ? 'Mover' : transformMode === 'rotate' ? 'Rotar' : 'Escalar'}
                      </div>
                      <div className="text-xs text-gray-400 mt-2">
                        {isTransforming ? '🔄 Transformando...' : 'Arrastra los controles para transformar'}
                      </div>
                    </div>
                  )}
          
          <div className="space-y-2">
            {modulesConfig.modules
              .filter(module => !module.hidden)
              .map((module) => (
                <div 
                  key={module.id}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${
                    selectedModule?.userData?.id === module.id 
                      ? 'bg-[#EAFE07] text-[#0042A6]' 
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                  onClick={() => {
                    // Buscar el objeto 3D correspondiente en la escena
                    if (sceneRef.current) {
                      let foundObject: THREE.Object3D | null = null;
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      sceneRef.current.traverse((object: any) => {
                        if (object.userData && object.userData.id === module.id) {
                          foundObject = object;
                        }
                      });
                      if (foundObject) {
                        selectObject(foundObject);
                      } else {
                        console.log('❌ No se encontró el objeto 3D para:', module.name);
                      }
                    }
                  }}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-white/20 rounded-lg mr-3 flex items-center justify-center">
                      <span className="text-xs font-bold">
                        {module.type.split(' ')[0].charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">{module.name}</div>
                      <div className="text-xs opacity-75">{module.type}</div>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
      
      {/* Controles de transformación y vista */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 flex space-x-2">
          {/* Controles de transformación */}
          <button 
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              transformMode === 'translate' 
                ? 'bg-[#EAFE07] text-[#0042A6]' 
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
            onClick={() => setTransformMode('translate')}
          >
            Mover
          </button>
          <button 
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              transformMode === 'rotate' 
                ? 'bg-[#EAFE07] text-[#0042A6]' 
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
            onClick={() => setTransformMode('rotate')}
          >
            Rotar
          </button>
          <button 
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              transformMode === 'scale' 
                ? 'bg-[#EAFE07] text-[#0042A6]' 
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
            onClick={() => setTransformMode('scale')}
          >
            Escalar
          </button>
          
          <div className="w-px bg-white/30 mx-2"></div>
          
          {/* Controles de vista */}
          <button 
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'orbit' 
                ? 'bg-[#EAFE07] text-[#0042A6]' 
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
            onClick={() => setViewMode('orbit')}
          >
            Órbita
          </button>
          <button 
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'firstPerson' 
                ? 'bg-[#EAFE07] text-[#0042A6]' 
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
            onClick={() => setViewMode('firstPerson')}
          >
            Primera Persona
          </button>
          <button 
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'fly' 
                ? 'bg-[#EAFE07] text-[#0042A6]' 
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
            onClick={() => setViewMode('fly')}
          >
            Vuelo
          </button>
          
          <div className="w-px bg-white/30 mx-2"></div>
          
          <button 
            className="px-4 py-2 rounded-lg font-medium bg-white/20 text-white hover:bg-white/30 transition-all"
            onClick={() => {
              setCameraPosition(modulesConfig.cameraPosition);
              setCameraTarget(modulesConfig.cameraTarget);
              controlsRef.current?.reset();
            }}
          >
            Reset
          </button>
        </div>
      </div>
      
      {/* Panel de detalles */}
      <ModuleDetailsPanel 
        selectedModule={selectedModule} 
        onClose={() => setSelectedModule(null)}
        onReset={resetModulePosition}
      />
    </>
  );
}

// Componente principal
export default function ModuleViewer3D() {
  const [modulesConfig, setModulesConfig] = useState<ArkhaModulesConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const config = await ModuleConfigService.getInstance().getModulesConfig();
        if (config) {
          setModulesConfig(config);
        } else {
          setError('No se pudo cargar la configuración de módulos');
        }
      } catch (err) {
        console.error('Error cargando configuración:', err);
        setError('Error cargando configuración de módulos');
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-[#0042A6] to-[#07173F]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EAFE07] mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando visor de módulos ARKHA...</p>
        </div>
      </div>
    );
  }

  if (error || !modulesConfig) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-[#0042A6] to-[#07173F]">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-[#EAFE07] text-[#0042A6] px-6 py-3 rounded-lg font-bold hover:bg-yellow-300 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return <ModuleScene modulesConfig={modulesConfig} />;
}

// Precargar modelos para mejor rendimiento
useGLTF.preload('/models/extraterrestrial_lands/Apollo_14.glb');
useGLTF.preload('/models/modules/ARKHA_AccessCore_L1_V1.glb');
useGLTF.preload('/models/modules/ARKHA_LabTri_L2_V1.glb');
