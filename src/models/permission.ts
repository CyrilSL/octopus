import { BaseEntity } from '@medusajs/medusa';
import { DbAwareColumn, generateEntityId } from '@medusajs/medusa/dist/utils';
import { BeforeInsert, Column, Entity } from 'typeorm';

@Entity()
export class Permission extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  // holds the permissions
  @DbAwareColumn({ type: 'jsonb', nullable: true })
  metadata: Record<string, boolean>;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, 'perm');
  }
}
