const fs = require("fs");
const toMs = require("ms");
const { sleep } = require("./myfunc");

const addSewaGroup = (groupId, duration = "PERMANENT", sewaList) => {
  let expired = "PERMANENT";
  if (duration === "PERMANENT") {
    expired = "PERMANENT";
  } else {
    expired = Date.now() + toMs(duration);
  }
  const data = {
    id: groupId,
    expired: Date.now() + toMs(duration),
    status: true
  };
  sewaList.push(data);
  fs.writeFileSync("./database/sewa.json", JSON.stringify(sewaList, null, 2));
};

const getSewaPosition = (groupId, sewaList) => {
  let position = null;
  Object.keys(sewaList).forEach(key => {
    if (sewaList[key].id === groupId) {
      position = key;
    }
  });
  if (position !== null) {
    return position;
  }
};

const getSewaExpired = (groupId, sewaList) => {
  let expired = null;
  Object.keys(sewaList).forEach(key => {
    if (sewaList[key].id === groupId) {
      expired = sewaList[key].expired;
    }
  });
  if (expired !== null) {
    return expired;
  }
};

const checkSewaGroup = (groupId, sewaList) => {
  let found = false;
  Object.keys(sewaList).forEach(key => {
    if (sewaList[key].id === groupId) {
      found = true;
    }
  });
  return found;
};

const expiredCheck = (conn, sewaList) => {
  setInterval(() => {
    let expiredGroup = null;
    Object.keys(sewaList).forEach(key => {
      if (Date.now() >= sewaList[key].expired) {
        expiredGroup = key;
      }
    });
    if (expiredGroup !== null) {
      console.log("Sewa expired: " + sewaList[expiredGroup].id);
      conn.sendMessage(sewaList[expiredGroup].id, { text: "Masa sewa di grup ini telah habis, bot otomatis keluar!" }).then(() => {
        conn.groupLeave(sewaList[expiredGroup].id);
        sewaList.splice(expiredGroup, 1);
        fs.writeFileSync("./database/sewa.json", JSON.stringify(sewaList, null, 2));
      });
    }
  }, 1000);
};

const getAllPremiumUser = sewaList => {
  const premiumUsers = [];
  Object.keys(sewaList).forEach(key => {
    premiumUsers.push(sewaList[key].id);
  });
  return premiumUsers;
};

module.exports = {
  addSewaGroup: addSewaGroup,
  getSewaExpired: getSewaExpired,
  getSewaPosition: getSewaPosition,
  expiredCheck: expiredCheck,
  checkSewaGroup: checkSewaGroup,
  getAllPremiumUser: getAllPremiumUser
};
