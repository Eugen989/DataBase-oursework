const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const Authorization = sequelize.define("authorization", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  login: { type: DataTypes.STRING },
  password: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING },
  // img: { type: DataTypes.STRING }
});

const Employee = sequelize.define("employee", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  salary: { type: DataTypes.INTEGER },
  fullName: { type: DataTypes.STRING }, 
  birthday: { type: DataTypes.DATE },
  position: { type: DataTypes.STRING }
})

const Shedule = sequelize.define("shedule", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  data: { type: DataTypes.DATE },
  workStart: { type: DataTypes.TIME },
  workEnd: { type: DataTypes.TIME },
})

const Material = sequelize.define("material", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  metal: { type: DataTypes.STRING },
  probe: { type: DataTypes.INTEGER }
})

const Product = sequelize.define("product", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  brand: { type: DataTypes.STRING },
  weight: { type: DataTypes.INTEGER },
  productSize: { type: DataTypes.INTEGER },
  cost: { type: DataTypes.INTEGER }
})

const Gem = sequelize.define("gem", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  type: { type: DataTypes.STRING },
  gemSize: { type: DataTypes.DOUBLE },
  purity: { type: DataTypes.INTEGER }
})

const ProductGem = sequelize.define("product-gem", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
})

const SoldProduct = sequelize.define("sold_product", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  timeAndDate: { type: DataTypes.DATE },
  cost: { type: DataTypes.INTEGER },
  discount: { type: DataTypes.INTEGER }
})

// const Restaurant = sequelize.define("restaurant", {
//   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//   name: { type: DataTypes.STRING },
//   description: { type: DataTypes.STRING },
//   menu: { type: DataTypes.STRING },
//   address: { type: DataTypes.STRING },
//   workBegining: { type: DataTypes.DATE },
//   workFinishid: { type: DataTypes.DATE },
//   imgOne: { type: DataTypes.STRING },
//   imgSecond: { type: DataTypes.STRING },
//   imgThird: { type: DataTypes.STRING }
// });

// const Reviews = sequelize.define("reviews", {
//   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//   description: { type: DataTypes.STRING }
// });

// const Reservation = sequelize.define("reservation", {
//   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//   date: { type: DataTypes.DATE },
//   time: { type: DataTypes.TIME },
//   quantity: { type: DataTypes.INTEGER },
//   description: { type: DataTypes.STRING }
// });

// const RestaurantReview = sequelize.define("restaurant_review", {
//   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
// });

// Restaurant.belongsToMany(Reviews, { through: RestaurantReview });
// Reviews.belongsToMany(Restaurant, { through: RestaurantReview });

// Reservation.hasOne(User);
// User.belongsTo(Reservation);


// Foreign keys
Employee.hasMany(Authorization);
Authorization.belongsTo(Employee);

Employee.hasMany(Shedule);
Shedule.belongsTo(Employee);

Material.hasOne(Product);
Product.belongsTo(Material);

Product.belongsToMany(Gem, {through: ProductGem});
Gem.belongsToMany(Product, {through: ProductGem});

Employee.hasOne(SoldProduct);
SoldProduct.belongsTo(Employee);

Product.hasOne(SoldProduct);
SoldProduct.belongsTo(Product);

module.exports = {
  Authorization,
  Employee,
  Shedule,
  Material,
  Product,
  Gem,
  ProductGem,
  SoldProduct
};