import { User } from './User.js';
import { Product } from './Product.js';
import { Category } from './Category.js';
import { Brand } from './Brand.js';
import { Price } from './Price.js';
import { Retailer } from './Retailer.js';

// Define relationships
Product.belongsTo(Brand, { foreignKey: 'brand_id', as: 'brand' });
Brand.hasMany(Product, { foreignKey: 'brand_id', as: 'products' });

Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });

Price.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
Product.hasMany(Price, { foreignKey: 'product_id', as: 'prices' });

Price.belongsTo(Retailer, { foreignKey: 'retailer_id', as: 'retailer' });
Retailer.hasMany(Price, { foreignKey: 'retailer_id', as: 'prices' });

export {
  User,
  Product,
  Category,
  Brand,
  Price,
  Retailer,
};
