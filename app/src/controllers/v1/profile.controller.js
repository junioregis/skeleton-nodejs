const path = require("path");
const i18n = require("../../i18n");
const { DateUtil, FileUtil, ValidatorUtil } = require("../../util");
const { cache } = require("../../services");

const BaseController = require("./base.controller");

const profileRepository = require("../../repositories/profile.repository");
const userRepository = require("../../repositories/user.repository");

const CACHE = {
  me: -1, // Infinity
  profile: 60 * 60, // 1h
  nearby: 60 * 60, // 1h
};

class ProfileController extends BaseController {
  constructor() {
    super();
  }

  async me(req, res, next) {
    const user = req.currentUser;
    const profile = await profileRepository.profile(user.id);

    const body = {
      result: {
        birthday: profile.birthday,
        age: profile.age,
        photo: "/profile/me/photo",
        name: profile.name,
        gender: profile.gender,
        city: profile.city,
        country: profile.country,
        photos: profile.user.photos.map((item) => {
          return `/profile/me/photo/${item.id}`;
        }),
      },
    };

    await cache.set(req, "me", body, CACHE.me);

    res.send(body);
  }

  async profile(req, res, next) {
    const userId = req.params.user_id;
    const profile = await profileRepository.profile(userId);

    if (profile) {
      const body = {
        result: {
          birthday: profile.birthday,
          age: DateUtil.toAge(profile.birthday),
          photo: `/profile/${userId}/photo`,
          name: profile.name,
          gender: profile.gender,
          photos: profile.user.photos.map((item) => {
            return `/profile/${item.user_id}/photo/${item.id}`;
          }),
        },
      };

      await cache.set(req, "profile", body, CACHE.profile);

      res.send(body);
    } else {
      res.status(404).json();
    }
  }

  async update(req, res, next) {
    ValidatorUtil.validate(req);

    const currentUser = req.currentUser;

    const profile = {
      user: currentUser,
      name: req.body.name,
      birthday: req.body.birthday,
      gender: req.body.gender,
    };

    await profileRepository.update(profile);

    await cache.del(req, "me");

    const body = {
      meta: {
        message: i18n.t(
          currentUser.preference.locale,
          "profile.update.successful"
        ),
      },
    };

    res.send(body);
  }

  async addPhoto(req, res, next) {
    const currentUser = req.currentUser;
    const file = req.file;

    var status;
    var message;

    if (typeof file !== "undefined") {
      if (file.error) {
        status = 400;
        message = "error";
      } else {
        status = 200;
        message = "successful";

        await profileRepository.addPhoto(currentUser, file);

        await cache.del(req, "me");
      }
    } else {
      status = 400;
      message = "error";
    }

    const body = {
      meta: {
        message: i18n.t(
          currentUser.preference.locale,
          `profile.photo.add.${message}`
        ),
      },
    };

    res.status(status).send(body);
  }

  async updatePhoto(req, res, next) {
    const currentUser = req.currentUser;
    const file = req.file;

    var status;
    var message;

    if (typeof file !== "undefined") {
      if (file.error) {
        status = 400;
        message = "error";
      } else {
        status = 200;
        message = "successful";

        await profileRepository.savePhoto(currentUser, file);

        await cache.del(req, "me");
      }
    } else {
      status = 400;
      message = "error";
    }

    const body = {
      meta: {
        message: i18n.t(
          currentUser.preference.locale,
          `profile.photo.update.${message}`
        ),
      },
    };

    res.status(status).send(body);
  }

  async photo(req, res, next) {
    const userId = req.params.user_id || req.currentUser.id;
    const photoId = req.params.photo_id;

    const imgPath = photoId
      ? path.join("/app/uploads/photos", userId, photoId)
      : path.join("/app/uploads/profiles", userId);

    if (FileUtil.exists(imgPath)) {
      return res.sendFile(imgPath);
    } else {
      return res.status(404).json();
    }
  }

  async nearby(req, res, next) {
    const currentUser = req.currentUser;
    const users = await userRepository.nearby(currentUser);

    if (users) {
      const body = {
        result: users.map((user) => {
          return {
            name: user.profile.name,
            age: user.profile.age,
            gender: user.profile.gender,
            photo: `/profile/${user.id}/photo`,
            city: user.profile.city,
            country: user.profile.country,
            distance: parseInt(user.distance),
          };
        }),
      };

      await cache.set(req, "nearby", body, CACHE.nearby);

      res.send(body);
    } else {
      res.status(404).json();
    }
  }
}

module.exports = new ProfileController();
