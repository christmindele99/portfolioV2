import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Comment from '#models/comment'
import { createCommentValidator } from '#validators/comment'

export default class CommentsController {
  async store({ request, response, session, logger }: HttpContext) {
    logger.info(
      { data: request.only(['author', 'authorEmail', 'rating', 'comment']) },
      'POST /comments reçu'
    )

    const { author, authorEmail, rating, comment } = await request
      .validateUsing(createCommentValidator)
      .catch((error) => {
        logger.warn({ messages: error.messages }, 'Validation refusée')
        throw error
      })

    const user = await User.firstOrCreate({ email: authorEmail }, { fullname: author })

    // Un seul avis par personne : le nouveau remplace l'ancien
    await Comment.updateOrCreate({ userId: user.id }, { rating, contain: comment })

    logger.info('Avis enregistré')
    session.flash('success', 'Merci pour ton avis !')
    return response.redirect().toPath('/#contact')
  }
}
