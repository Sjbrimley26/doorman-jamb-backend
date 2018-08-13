const aws = require("aws-sdk");
const dynamoDB = new aws.DynamoDB();

const { promisify } = require("util");

const getItem = promisify(dynamoDB.getItem.bind(dynamoDB));
const putItem = promisify(dynamoDB.putItem.bind(dynamoDB));

module.exports = {
  dynamoDB,
  getItem,
  putItem
};