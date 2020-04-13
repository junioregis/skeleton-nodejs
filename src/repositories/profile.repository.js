const db = require("../db");

exports.me = async (user) => {
  const profile = await db.profiles.findOne({
    where: {
      user_id: user.id,
    },
    attributes: {
      exclude: ["user_id"],
    },
  });

  return profile;
};

exports.update = async (profile) => {
  const data = profile.photo;

  await db.profiles.savePhoto(data, profile.user.id);
};
