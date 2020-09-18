const { DateUtil, NetUtil } = require("../../util");
const { ProviderError } = require("../../errors");

class FacebookService {
  constructor() {
    this.VERSION = "8.0";
    this.URL = `https://graph.facebook.com/v${this.VERSION}/me`;

    this.FIELDS = [
      "id",
      "name",
      "email",
      "gender",
      "birthday",
      "picture.width(720).height(720)",
    ];
  }

  async getUser(accessToken) {
    const params = {
      access_token: accessToken,
      fields: this.FIELDS.join(","),
      method: "get",
      format: "json",
    };

    const response = await NetUtil.get(this.URL, params);

    if (response.statusCode === 200) {
      const json = response.body;

      const gender = json["gender"].toLowerCase() == "male" ? "male" : "female";
      const birthday = DateUtil.fromString(
        json["birthday"],
        "DD/MM/YYYY"
      ).toDate();

      return {
        provider: "facebook",
        provider_id: json["id"],
        email: json["email"],
        name: json["name"],
        gender: gender,
        birthday: birthday,
        photo: json["picture"]["data"]["url"],
      };
    } else {
      throw new ProviderError("facebook");
    }
  }
}

module.exports = new FacebookService();
