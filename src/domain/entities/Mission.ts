export class Mission {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string | undefined,
    public readonly destination: 'moon' | 'mars',
    public readonly passengers: number,
    public readonly duration: number,
    public readonly isPublic: boolean,
    public readonly status: 'draft' | 'published' | 'archived',
    public readonly userId: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}

  static create(data: {
    id: string;
    title: string;
    description?: string;
    destination: 'moon' | 'mars';
    passengers: number;
    duration: number;
    isPublic?: boolean;
    status?: 'draft' | 'published' | 'archived';
    userId: string;
    createdAt?: Date;
    updatedAt?: Date;
  }): Mission {
    return new Mission(
      data.id,
      data.title,
      data.description,
      data.destination,
      data.passengers,
      data.duration,
      data.isPublic || false,
      data.status || 'draft',
      data.userId,
      data.createdAt || new Date(),
      data.updatedAt || new Date()
    );
  }

  publish(): Mission {
    return new Mission(
      this.id,
      this.title,
      this.description,
      this.destination,
      this.passengers,
      this.duration,
      true,
      'published',
      this.userId,
      this.createdAt,
      new Date()
    );
  }

  archive(): Mission {
    return new Mission(
      this.id,
      this.title,
      this.description,
      this.destination,
      this.passengers,
      this.duration,
      this.isPublic,
      'archived',
      this.userId,
      this.createdAt,
      new Date()
    );
  }

  update(data: {
    title?: string;
    description?: string;
    isPublic?: boolean;
  }): Mission {
    return new Mission(
      this.id,
      data.title || this.title,
      data.description !== undefined ? data.description : this.description,
      this.destination,
      this.passengers,
      this.duration,
      data.isPublic !== undefined ? data.isPublic : this.isPublic,
      this.status,
      this.userId,
      this.createdAt,
      new Date()
    );
  }
}
