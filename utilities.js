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
    if (!data.Item) return [undefined, undefined];
    return [data.Item.password.S, data.Item.email.S];
  });

  if (!user) return undefined;

  let passwordMatch = await bcrypt.compare(password, hash);
  
  if (passwordMatch) {
    return user;
  }

  return undefined;

};

// Only works for string properties
const parseDDB = async DDBobj => {
  return Object.keys(DDBobj.Item).reduce((newObj, key) => {
    return _.set(newObj, key, DDBobj.Item[key].S)
  }, {});
};

const removePassword = async obj => {
  let { password, ...details } = obj;
  return details;
};

module.exports = {
  verifyPassword,
  bcryptCompare,
  bcryptHash,
  parseDDB,
  removePassword
}