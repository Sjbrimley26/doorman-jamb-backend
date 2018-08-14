const { getItem } = require("./db");
const { promisify } = require("util");

const bcrypt = require("bcryptjs");
const bcryptCompare = promisify(bcrypt.compare.bind(bcrypt));
const bcryptHash = promisify(bcrypt.compare.bind(bcrypt));

const _ = require("lodash");

const verifyPassword = async (email, password, next) => {

  if (!email || !password) next(new Error("Email or password missing!"));

  const params = {
    TableName: "doormanUsers",
    Key: {
      "email": {
        S: email
      }
    }
  };

  const [hash, user] = await getItem(params).then(data => {
    return [data.Item.password.S, data.Item.email.S];
  });

  /*
  const passwordMatch = await bcryptCompare(password, hash).then(match => {
    if (match) {
      return true;
    } else {
      return false;
    }
  });
  */
  let passwordMatch = await bcrypt.compare(password, hash);
  
  if (passwordMatch) return user;
  return next(new Error("Invalid password!"));

};

// Only works for string properties
const parseDDB = DDBobj => {
  return Promise.resolve(Object.keys(DDBobj.Item).reduce((newObj, key) => {
    return _.set(newObj, key, DDBobj.Item[key].S)
  }, {}));
};

module.exports = {
  verifyPassword,
  bcryptCompare,
  bcryptHash,
  parseDDB
}