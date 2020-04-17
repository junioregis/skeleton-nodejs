const db = require("../db");

class ProfileRepository {
  async me(user) {
    const profile = await db.profiles.findOne({
      where: {
        user_id: user.id,
      },
      attributes: {
        exclude: ["user_id"],
      },
    });

    return profile;
  }

  async update(profile) {
    const data = profile.photo;

    await db.profiles.savePhoto(data, profile.user.id);
  }
}

module.exports = new ProfileRepository();
