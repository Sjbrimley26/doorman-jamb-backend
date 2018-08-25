const aws = require("aws-sdk");

aws.config.update({
  region: 'us-west-2'
})

const dynamoDB = new aws.DynamoDB();

const { promisify } = require("util");

const getItem = promisify(dynamoDB.getItem.bind(dynamoDB));
const putItem = promisify(dynamoDB.putItem.bind(dynamoDB));
const updateItem = promisify(dynamoDB.updateItem.bind(dynamoDB));

module.exports = {
  dynamoDB,
  getItem,
  putItem,
  updateItem
};