import { Mission } from '../entities/Mission';
import { Module } from '../entities/Module';
import { MissionRepository } from '../repositories/MissionRepository';
import { ModuleRepository } from '../repositories/ModuleRepository';

export interface CreateMissionRequest {
  title: string;
  description?: string;
  destination: 'moon' | 'mars';
  passengers: number;
  duration: number;
  isPublic?: boolean;
  userId: string;
}

export class CreateMission {
  constructor(
    private missionRepository: MissionRepository,
    private moduleRepository: ModuleRepository
  ) {}

  async execute(request: CreateMissionRequest): Promise<Mission> {
    // Create mission
    const mission = Mission.create({
      id: crypto.randomUUID(),
      title: request.title,
      description: request.description,
      destination: request.destination,
      passengers: request.passengers,
      duration: request.duration,
      isPublic: request.isPublic || false,
      userId: request.userId,
    });

    // Save mission
    const savedMission = await this.missionRepository.save(mission);

    // Generate initial modules
    await this.generateInitialModules(savedMission);

    return savedMission;
  }

  private async generateInitialModules(mission: Mission): Promise<void> {
    const modules = this.calculateRequiredModules(mission);
    
    for (const moduleData of modules) {
      const moduleEntity = Module.create({
        id: crypto.randomUUID(),
        ...moduleData,
        missionId: mission.id,
      });
      
      await this.moduleRepository.save(moduleEntity);
    }
  }

  private calculateRequiredModules(mission: Mission) {
    const modules = [];
    const { passengers, destination } = mission;

    // Calculate required modules based on passengers
    const habitatModules = Math.ceil(passengers / 4);
    const labModules = Math.ceil(passengers / 8);
    const storageModules = Math.ceil(passengers / 6);
    const recreationModules = Math.ceil(passengers / 12);

    // Generate habitat modules
    for (let i = 0; i < habitatModules; i++) {
      modules.push({
        name: `Habitat Module ${i + 1}`,
        type: 'habitat' as const,
        size: 'medium' as const,
        position: { x: i * 2, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        isRadioactive: false,
      });
    }

    // Generate laboratory modules
    for (let i = 0; i < labModules; i++) {
      modules.push({
        name: `Laboratory Module ${i + 1}`,
        type: 'laboratory' as const,
        size: 'large' as const,
        position: { x: habitatModules * 2 + i * 3, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        isRadioactive: false,
      });
    }

    // Generate storage modules
    for (let i = 0; i < storageModules; i++) {
      modules.push({
        name: `Storage Module ${i + 1}`,
        type: 'storage' as const,
        size: 'small' as const,
        position: { x: (habitatModules + labModules) * 2 + i * 1.5, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        isRadioactive: false,
      });
    }

    // Generate recreation modules
    for (let i = 0; i < recreationModules; i++) {
      modules.push({
        name: `Recreation Module ${i + 1}`,
        type: 'recreation' as const,
        size: 'large' as const,
        position: { x: (habitatModules + labModules + storageModules) * 2 + i * 4, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        isRadioactive: false,
      });
    }

    return modules;
  }
}
