const products = require("../models/product");

const getAllProducts = async (req, res, next) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  const queryObject = {};
  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: 1 };
  }
  let searchedProducts = products.find(queryObject);
  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };
    const regex = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(regex, (match) => {
      `${operatorMap[match]}`;
    });
    const options = ["price", "rating"];
    filters = filters.split(",").forEach((filter) => {
      const [field, operator, value] = filter.split("-");
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }
  if (sort) {
    let sortedProducts = (products.sort = sort.split(",").join(" "));
    searchedProducts = searchedProducts.sort(sortedProducts);
  } else {
    searchedProducts = searchedProducts.sort("createdAt");
  }
  if (fields) {
    const fieldsList = fields.split(",").join(" ");
    searchedProducts = searchedProducts.select(fieldsList);
  }
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit; //thats the logic for loading the items (automaticly) in each page -> for example:
  //1st page ->( 1-1) * (limit of items per page) will be skipped for loading
  //2nd page ->(2-1) * (limit of items per page) - limit items will be skipped
  //3rd page ->(3-1) * (limit of items per) - 2 * limit items will be skipped for loading
  searchedProducts = searchedProducts.skip(skip).limit(limit);
  const foundProducts = await searchedProducts;
  return res.status(200).json({ msg: foundProducts });
};

const getProduct = async (req, res, next) => {
  return res.status(200).json({ msg: "product" });
};
module.exports = {
  getAllProducts,
};
