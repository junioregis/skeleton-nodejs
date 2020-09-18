const { pg } = require("../db");
const { ProfileError } = require("../errors");
const { FileUtil, NetUtil } = require("../util");

const BaseRepository = require("./base.repository");

class ProfileRepository extends BaseRepository {
  constructor() {
    super();
  }

  async profile(userId) {
    const cached = await this.cache.get(`profile-${userId}`);

    if (cached) return cached;

    return await pg.transaction(async (transaction) => {
      try {
        const profile = await pg.models.profiles.findOne({
          where: {
            user_id: userId,
          },
          include: [
            {
              model: pg.models.users,
              as: "user",
              include: [
                {
                  model: pg.models.photos,
                  as: "photos",
                },
              ],
            },
          ],
          transaction: transaction,
        });

        await this.cache.set(`profile-${userId}`, profile, -1);

        return profile;
      } catch (e) {
        transaction.rollback();
        throw new ProfileError(e);
      }
    });
  }

  async update(profile) {
    await pg.transaction(async (transaction) => {
      try {
        await pg.models.profiles.update(
          {
            name: profile.name,
            birthday: profile.birthday,
            gender: profile.gender,
          },
          {
            where: {
              user_id: profile.user.id,
            },
            transaction: transaction,
          }
        );
      } catch (e) {
        transaction.rollback();
        throw new ProfileError(e);
      } finally {
        await this.cache.del(`profile-${profile.user.id}`);
      }
    });
  }

  async savePhoto(user, file) {
    try {
      const buff = FileUtil.bufferFromPath(file.path);

      await pg.models.profiles.savePhoto(user.id, buff);
    } catch (e) {
      throw new ProfileError(e);
    }
  }

  async savePhotoFromSocial(user, url, transaction) {
    try {
      const response = await NetUtil.get(url);

      if (response.statusCode === 200) {
        const data = response.body;
        const buff = FileUtil.bufferFromBinary(data);

        await pg.models.profiles.savePhoto(user.id, buff, transaction);
      } else {
        throw new ProfileError(`can't save image from: ${url}`);
      }
    } catch (e) {
      throw new ProfileError(e);
    }
  }

  async addPhoto(user, file) {
    const buff = FileUtil.bufferFromPath(file.path);

    return await pg.transaction(async (transaction) => {
      try {
        const photo = await pg.models.photos.create(
          {
            user_id: user.id,
            size: file.size,
          },
          {
            transaction: transaction,
          }
        );

        await pg.models.photos.savePhoto(user.id, photo.id, buff);
      } catch (e) {
        await transaction.rollback();
        throw new ProfileError(e);
      } finally {
        await this.cache.del(`profile-${user.id}`);
      }
    });
  }
}

module.exports = new ProfileRepository();
