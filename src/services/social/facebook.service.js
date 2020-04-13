const util = require("../../util");

const VERSION = "6.0";
const URL = `https://graph.facebook.com/v${VERSION}/me`;

const FIELDS = [
  "id",
  "name",
  "email",
  "gender",
  "birthday",
  "picture.width(720).height(720)"
];

async function getUser(accessToken) {
  const params = {
    access_token: accessToken,
    fields: FIELDS.join(","),
    method: "get",
    format: "json"
  };

  const response = await util.net.get(URL, params);

  if (response.statusCode === 200) {
    const json = response.body;

    const gender = json["gender"].toLowerCase() == "male" ? "male" : "female";
    const birthday = util.date
      .fromString(json["birthday"], "DD/MM/YYYY")
      .toDate();

    return {
      provider: "facebook",
      provider_id: json["id"],
      email: json["email"],
      name: json["name"],
      gender: gender,
      birthday: birthday,
      photo: json["picture"]["data"]["url"]
    };
  } else {
    throw new Error("facebook error");
  }
}

module.exports = {
  getUser
};
