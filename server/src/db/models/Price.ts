import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../connection.js';

interface PriceAttributes {
  id: string;
  productId: string;
  retailerId: string;
  price: number;
  currency: string;
  inStock: boolean;
  url: string;
  lastChecked: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PriceCreationAttributes extends Optional<PriceAttributes, 'id'> {}

export class Price extends Model<PriceAttributes, PriceCreationAttributes> implements PriceAttributes {
  declare id: string;
  declare productId: string;
  declare retailerId: string;
  declare price: number;
  declare currency: string;
  declare inStock: boolean;
  declare url: string;
  declare lastChecked: Date;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Price.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id',
      },
    },
    retailerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'retailers',
        key: 'id',
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'USD',
    },
    inStock: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastChecked: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'prices',
    indexes: [
      {
        fields: ['product_id', 'retailer_id'],
        unique: true,
      },
      {
        fields: ['product_id'],
      },
      {
        fields: ['last_checked'],
      },
    ],
  }
);
