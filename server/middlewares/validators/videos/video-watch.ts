import { body, param } from 'express-validator/check'
import * as express from 'express'
import { isIdOrUUIDValid } from '../../../helpers/custom-validators/misc'
import { isVideoExist } from '../../../helpers/custom-validators/videos'
import { areValidationErrors } from '../utils'
import { logger } from '../../../helpers/logger'
import { UserModel } from '../../../models/account/user'

const videoWatchingValidator = [
  param('videoId').custom(isIdOrUUIDValid).not().isEmpty().withMessage('Should have a valid id'),
  body('currentTime')
    .toInt()
    .isInt().withMessage('Should have correct current time'),

  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.debug('Checking videoWatching parameters', { parameters: req.body })

    if (areValidationErrors(req, res)) return
    if (!await isVideoExist(req.params.videoId, res, 'id')) return

    const user = res.locals.oauth.token.User as UserModel
    if (user.videosHistoryEnabled === false) {
      logger.warn('Cannot set videos to watch by user %d: videos history is disabled.', user.id)
      return res.status(409).end()
    }

    return next()
  }
]

// ---------------------------------------------------------------------------

export {
  videoWatchingValidator
}
