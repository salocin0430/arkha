export interface Position3D {
  x: number;
  y: number;
  z: number;
}

export class Module {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly type: 'habitat' | 'laboratory' | 'storage' | 'dormitory' | 'recreation',
    public readonly size: 'small' | 'medium' | 'large',
    public readonly position: Position3D,
    public readonly rotation: Position3D,
    public readonly scale: Position3D,
    public readonly modelUrl: string | undefined,
    public readonly isRadioactive: boolean,
    public readonly missionId: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}

  static create(data: {
    id: string;
    name: string;
    type: 'habitat' | 'laboratory' | 'storage' | 'dormitory' | 'recreation';
    size: 'small' | 'medium' | 'large';
    position: Position3D;
    rotation: Position3D;
    scale: Position3D;
    modelUrl?: string;
    isRadioactive?: boolean;
    missionId: string;
    createdAt?: Date;
    updatedAt?: Date;
  }): Module {
    return new Module(
      data.id,
      data.name,
      data.type,
      data.size,
      data.position,
      data.rotation,
      data.scale,
      data.modelUrl,
      data.isRadioactive || false,
      data.missionId,
      data.createdAt || new Date(),
      data.updatedAt || new Date()
    );
  }

  move(newPosition: Position3D): Module {
    return new Module(
      this.id,
      this.name,
      this.type,
      this.size,
      newPosition,
      this.rotation,
      this.scale,
      this.modelUrl,
      this.isRadioactive,
      this.missionId,
      this.createdAt,
      new Date()
    );
  }

  rotate(newRotation: Position3D): Module {
    return new Module(
      this.id,
      this.name,
      this.type,
      this.size,
      this.position,
      newRotation,
      this.scale,
      this.modelUrl,
      this.isRadioactive,
      this.missionId,
      this.createdAt,
      new Date()
    );
  }

  setScale(newScale: Position3D): Module {
    return new Module(
      this.id,
      this.name,
      this.type,
      this.size,
      this.position,
      this.rotation,
      newScale,
      this.modelUrl,
      this.isRadioactive,
      this.missionId,
      this.createdAt,
      new Date()
    );
  }
}
