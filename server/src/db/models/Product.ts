import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../connection.js';

interface ProductAttributes {
  id: string;
  name: string;
  brandId?: string;
  categoryId?: string;
  description?: string;
  imageUrl?: string;
  specs: any;
  status: 'active' | 'discontinued' | 'draft';
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProductCreationAttributes extends Optional<ProductAttributes, 'id' | 'status'> {}

export class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  declare id: string;
  declare name: string;
  declare brandId: string;
  declare categoryId: string;
  declare description: string;
  declare imageUrl: string;
  declare specs: any;
  declare status: 'active' | 'discontinued' | 'draft';
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    brandId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'brands',
        key: 'id',
      },
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'categories',
        key: 'id',
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    specs: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    status: {
      type: DataTypes.ENUM('active', 'discontinued', 'draft'),
      defaultValue: 'active',
    },
  },
  {
    sequelize,
    tableName: 'products',
    indexes: [
      {
        fields: ['name'],
      },
      {
        fields: ['brand_id'],
      },
      {
        fields: ['category_id'],
      },
      {
        fields: ['status'],
      },
      {
        using: 'gin',
        fields: ['specs'],
      },
    ],
  }
);
