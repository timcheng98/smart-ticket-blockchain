const os = require('os');
// const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const url = require('url');
const util = require('util');
const _ = require('lodash');
const moment = require('moment');
const multer = require('multer');
const shortid = require('shortid');
const mkdirp = require('mkdirp')
const config = require('config');
const model = require('../../model');
const middleware = require('./middleware');
const helper = require('../../lib/helper');
const AppError = require('../../lib/app-error');

const debug = require('debug')('app:route/admin/media');

// Temporary directory to save uploaded file(s)
const MEDIA_TEMPDIR = path.join(os.tmpdir());

const MEDIA_DIR_NAME = 'media';

/**
 * STATIC_SERVER_URL - server URL to serve uploaded file(s)
 *
 */
const MediaConfig = {
  PUBLIC: {
    STATIC_SERVER_URL: config.get('STATIC_SERVER_URL'),
    UPLOAD_DIR: path.join(config.get('MEDIA.PUBLIC'), MEDIA_DIR_NAME),
  },
  PRIVATE: {
    STATIC_SERVER_URL: config.get('ADMIN.ORIGIN'),
    UPLOAD_DIR: path.join(config.get('MEDIA.PRIVATE'), MEDIA_DIR_NAME),
  },
};

const getMediaConfig = (_scope) => {
  const scope = _scope ? _.toUpper(_scope) : 'PRIVATE';
  return MediaConfig[scope];
};

// Public media directory to save uploaded files
// const publicPath = config.get('MEDIA').PUBLIC;
// Private media directory to save uploaded files

// const mediaDir = 'media';
// const MEDIA_DIR_PATH = path.join(publicPath, mediaDir);

mkdirp.sync(MEDIA_TEMPDIR);
mkdirp.sync(MediaConfig.PUBLIC.UPLOAD_DIR);
mkdirp.sync(MediaConfig.PRIVATE.UPLOAD_DIR);

const ERROR_CODE = {
  [-38001]: 'media file type not accepted'
};
AppError.setErrorCode(ERROR_CODE);

exports.initRouter = (router) => {
  router.post(
    '/api/media',
    upload.fields([
      { name: 'file', maxCount: 1 },
    ]),
    // middleware.session.authorize(),
    saveAllFiles(),
    postMedia
  );

  // Private media route handler
  router.get(
    '/media/:filename',
    // middleware.session.authorize(),
    getMediaFile
  );
}

const postMedia = (req, res) => {
  try {
    debug(req.files);
    debug(req.body);

    const {
      scope
    } = req.body;
    const { file: fileArr } = req.files;

    // No uploaded file(s)
    if (!fileArr || fileArr.length <= 0) {
      throw new AppError(-38001)
    }

    const [file] = fileArr;
    const {
      filename,
      filepath,
      originalname
    } = file
    const fileURL = url.resolve(getMediaConfig(scope).STATIC_SERVER_URL, filepath);
    res.apiResponse({
      originalname,
      filename,
      filepath,
      url: fileURL
    })
  } catch (err) {
    res.apiError(err)
  }
}

const getMediaFile = (req, res) => {
  try {
    const {
      filename
    } = req.params;

    res.sendFile(path.join(getMediaConfig('private').UPLOAD_DIR, filename));

  } catch (err) {
    console.error(err);
    res.sendStatus(404);
  }
}

// upload image function
let upload = multer({
  storage: multer.diskStorage({
    destination: MEDIA_TEMPDIR,
    filename (req, file, cb) {
      debug(file);
      try {
        let mimetype = file.mimetype.split('/')[1];
        let ctime = moment().format('YYMMDDHHmmss');
        let fileName = `upload_${file.fieldname}_${ctime}.${mimetype}`;
        // let fileName = `u_${ctime}_${shortid.generate()}.${mimetype}`;
        return cb(null, fileName);
      } catch (error) {
        console.error(error);
        cb(error);
      }
    }
  }),
  fileFilter: (req, file, cb) => {
    try {
      let acceptMimeTypes = ['image/png', 'image/jpeg', 'application/pdf'];
      if (acceptMimeTypes.indexOf(file.mimetype) < 0) {
        return cb(null, false);
      }
      cb(null, true);
    } catch (err) {
      console.error(err);
      cb(err);
    }
  }
})

const saveAllFiles = (_opts) => {
  return async (req, res, next) => {
    try {
      const opts = _opts || {};
      if (!req.files) {
        return next();
      }
      const { user_id } = req.user;
      const { scope } = req.body;
      const promises = [];
      _.each(req.files, (fileArr) => {
        promises.push(
          saveMediaHandler({ user_id, scope, fileArr })
        )
      });
      await Promise.all(promises);
      next();
    } catch (err) {
      res.apiError(err);
    }
  }
}

const saveMediaHandler = async ({ user_id, scope, fileArr }) => {
  const [file] = fileArr;
  const {
    originalname,
    mimetype,
    // destination,
    filename,
    path: filepath,
    size,
  } = file;
  await model.media.insertUpload({
    is_active: 1,
    filename,
    filepath: path.join(MEDIA_DIR_NAME, filename),
    mimetype,
    filesize: size,
    originalname,
    checksum: '',
    user_id,
  });
  await fsPromises.rename(
    filepath,
    path.join(getMediaConfig(scope).UPLOAD_DIR, filename),
  );
  file.filepath = path.join(MEDIA_DIR_NAME, filename);
}
