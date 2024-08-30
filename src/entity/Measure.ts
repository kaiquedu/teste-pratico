import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Measure {
    @PrimaryGeneratedColumn('uuid')
    measure_uuid: string;

    @Column()
    customer_code: string;

    @Column()
    measure_type: 'WATER' | 'GAS';

    @Column('timestamp')
    measure_datetime: Date;

    @Column()
    measure_value: number;

    @Column()
    image_url: string;

    @Column({ default: false })
    has_confirmed: boolean;
}
