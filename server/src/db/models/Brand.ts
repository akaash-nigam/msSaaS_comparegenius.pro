import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../connection.js';

interface BrandAttributes {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  reputationScore?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface BrandCreationAttributes extends Optional<BrandAttributes, 'id'> {}

export class Brand extends Model<BrandAttributes, BrandCreationAttributes> implements BrandAttributes {
  declare id: string;
  declare name: string;
  declare slug: string;
  declare logoUrl: string;
  declare reputationScore: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Brand.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    logoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reputationScore: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
      validate: {
        min: 0,
        max: 100,
      },
    },
  },
  {
    sequelize,
    tableName: 'brands',
  }
);
