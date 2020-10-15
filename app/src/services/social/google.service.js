const { NetUtil } = require("../../util");
const { ProviderError } = require("../../errors");

const VERSION = "1";
const URL = `https://people.googleapis.com/v${VERSION}/people/me`;

const FIELDS = ["emailAddresses", "names", "genders", "birthdays", "photos"];

async function getUser(accessToken) {
  const params = {
    access_token: accessToken,
    personFields: FIELDS.join(","),
  };

  const response = await NetUtil.get(URL, params);

  if (response.statusCode === 200) {
    const json = response.body;

    const providerId = json["emailAddresses"].find((item) => {
      return item.metadata.primary === true;
    }).metadata.source.id;

    const email = json["emailAddresses"].find((item) => {
      return item.metadata.primary === true;
    }).value;

    const name = json["names"].find((item) => {
      return item.metadata.primary === true;
    }).displayName;

    const birthday = json["birthdays"].find((item) => {
      return item.metadata.source.type === "ACCOUNT";
    }).date;

    const photo = json["photos"]
      .find((item) => {
        return item.metadata.primary === true;
      })
      .url.replace(/s(\d+)$/, "s720");

    const gender = json["genders"].find((item) => {
      return item.metadata.primary === true;
    }).value;

    return {
      provider: "google",
      provider_id: providerId,
      email: email,
      name: name,
      gender: gender,
      birthday: new Date(birthday.year, birthday.month - 1, birthday.day),
      photo: photo,
    };
  } else {
    throw new ProviderError("google");
  }
}

module.exports = {
  getUser,
};
