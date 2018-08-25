const { getItem } = require("./db");

const bcrypt = require("bcryptjs");

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

  console.log(`Password: ${password}, Hash: ${hash}`)
  let passwordMatch = await bcrypt.compare(password, hash);
  
  if (passwordMatch) {
    return user;
  }

  console.log("Passwords don't match!");
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
  parseDDB,
  removePassword
}