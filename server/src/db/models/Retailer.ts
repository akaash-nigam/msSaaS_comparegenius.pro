import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../connection.js';

interface RetailerAttributes {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  websiteUrl: string;
  affiliateProgram?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface RetailerCreationAttributes extends Optional<RetailerAttributes, 'id'> {}

export class Retailer extends Model<RetailerAttributes, RetailerCreationAttributes> implements RetailerAttributes {
  declare id: string;
  declare name: string;
  declare slug: string;
  declare logoUrl: string;
  declare websiteUrl: string;
  declare affiliateProgram: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Retailer.init(
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
    websiteUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    affiliateProgram: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'retailers',
  }
);
