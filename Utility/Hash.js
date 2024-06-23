const bcrypt = require("bcryptjs");

async function hashData(text, sync) {
    let hashedData = "";
    if (sync) {
        hashedData = bcrypt.hashSync(text);
    } else {
        hashedData = await bcrypt.hash(text);
    }
    return hashedData;
}

async function comapreHashData(data, hashData) {
    const result = await bcrypt.compare(data, hashData);
    return comapreHashData;
}

module.exports = {
    hashData: hashData,
    comapreHashData: comapreHashData
}