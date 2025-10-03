'use client';

import React, { useRef, useState, useEffect, useCallback, Suspense } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
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
function ModuleModel({ moduleConfig, isSelected, onSelect }: { 
  moduleConfig: ModuleConfig; 
  isSelected?: boolean;
  onSelect?: (object: any) => void;
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
      onClick={(e: any) => {
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
      onPointerOver={(e: any) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e: any) => {
        e.stopPropagation();
        document.body.style.cursor = 'auto';
      }}
    />
  );
}

// Panel de detalles para el módulo seleccionado
function ModuleDetailsPanel({ selectedModule, onClose, onReset }: {
  selectedModule: any;
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
              X: {selectedModule.position?.x?.toFixed(2) || '0.00'}, 
              Y: {selectedModule.position?.y?.toFixed(2) || '0.00'}, 
              Z: {selectedModule.position?.z?.toFixed(2) || '0.00'}
            </div>
          </div>
          
          {selectedModule.userData?.price !== undefined && (
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
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const [transformMode, setTransformMode] = useState<'translate' | 'rotate' | 'scale'>('translate');
  const [viewMode, setViewMode] = useState<'orbit' | 'firstPerson' | 'fly'>('orbit');
  const [cameraPosition, setCameraPosition] = useState(modulesConfig.cameraPosition);
  const [cameraTarget, setCameraTarget] = useState(modulesConfig.cameraTarget);
  const [isTransforming, setIsTransforming] = useState(false);
  const transformRef = useRef<any>(null);
  const controlsRef = useRef<any>(null);
  const transformTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Función de selección exacta como en tu proyecto anterior
  const selectObject = useCallback((object: any) => {
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

  // Evento dragging-changed exactamente como en tu proyecto anterior
  useEffect(() => {
    console.log('🔧 Configurando dragging-changed, selectedModule:', selectedModule?.userData?.name);
    console.log('🔧 transformRef.current:', !!transformRef.current);
    console.log('🔧 controlsRef.current:', !!controlsRef.current);
    
    if (transformRef.current && controlsRef.current) {
      const transformControls = transformRef.current;
      const orbitControls = controlsRef.current;
      
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

  // Controles de teclado para primera persona
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (viewMode === 'orbit') return;
      
      event.preventDefault();
      const speed = 1.0;
      const currentPos = [...cameraPosition] as [number, number, number];
      
      console.log('Tecla presionada:', event.key, 'Modo:', viewMode);
      
      switch (event.key.toLowerCase()) {
        case 'w':
          setCameraPosition([currentPos[0], currentPos[1], currentPos[2] - speed]);
          break;
        case 's':
          setCameraPosition([currentPos[0], currentPos[1], currentPos[2] + speed]);
          break;
        case 'a':
          setCameraPosition([currentPos[0] - speed, currentPos[1], currentPos[2]]);
          break;
        case 'd':
          setCameraPosition([currentPos[0] + speed, currentPos[1], currentPos[2]]);
          break;
        case 'q':
          setCameraPosition([currentPos[0], currentPos[1] + speed, currentPos[2]]);
          break;
        case 'e':
          setCameraPosition([currentPos[0], currentPos[1] - speed, currentPos[2]]);
          break;
        case 'r':
          // Reset camera
          setCameraPosition(modulesConfig.cameraPosition);
          setCameraTarget(modulesConfig.cameraTarget);
          break;
      }
    };

    if (viewMode !== 'orbit') {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [viewMode, cameraPosition, modulesConfig.cameraPosition, modulesConfig.cameraTarget]);
  
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
        onClick={(e: any) => {
          console.log('Canvas clickeado, target:', e.target);
          if (e.target === e.currentTarget) {
            console.log('Deseleccionando módulo');
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
                isSelected={selectedModule?.id === module.id}
                onSelect={selectObject}
              />
            </Suspense>
          ))
        }
        
        {/* Controles de órbita */}
        {viewMode === 'orbit' && (
          <OrbitControls 
            ref={controlsRef}
            enablePan={!isTransforming}
            enableZoom={!isTransforming}
            enableRotate={!isTransforming}
            target={cameraTarget}
            minDistance={5}
            maxDistance={50}
          />
        )}
        
        {/* Controles de transformación - exactamente como en tu proyecto anterior */}
        {selectedModule && viewMode === 'orbit' && (
          <TransformControls
            ref={(ref) => {
              transformRef.current = ref;
              // Configurar el evento inmediatamente cuando se crea el TransformControls
              if (ref && controlsRef.current) {
                console.log('🔧 Configurando evento al crear TransformControls');
                const orbitControls = controlsRef.current;
                
                const handleDraggingChanged = (event: any) => {
                  console.log('🔄 Dragging changed (al crear):', event.value);
                  orbitControls.enabled = !event.value;
                };
                
                // Remover listener anterior si existe
                (ref as any).removeEventListener('dragging-changed', handleDraggingChanged);
                
                // Agregar nuevo listener
                (ref as any).addEventListener('dragging-changed', handleDraggingChanged);
                console.log('✅ Event listener agregado al crear TransformControls');
              }
            }}
            object={selectedModule}
            mode={transformMode}
            size={0.7}
            showX={true}
            showY={true}
            showZ={true}
            onObjectChange={(e) => {
              if (e && e.target && typeof e.target === 'object' && e.target !== null) {
                const target = e.target as any;
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
                        <div>WASD: Mover</div>
                        <div>Q/E: Subir/Bajar</div>
                        <div>R: Reset cámara</div>
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
                      let foundObject = null;
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
