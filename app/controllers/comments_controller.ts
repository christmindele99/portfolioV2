import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Comment from '#models/comment'
import { createCommentValidator } from '#validators/comment'

export default class CommentsController {
  async store({ request, response, session }: HttpContext) {
    const { author, authorEmail, rating, comment } =
      await request.validateUsing(createCommentValidator)

    const user = await User.firstOrCreate({ email: authorEmail }, { fullname: author })

    // Un seul avis par personne : le nouveau remplace l'ancien
    await Comment.updateOrCreate({ userId: user.id }, { rating, contain: comment })

    session.flash('success', 'Merci pour ton avis !')
    return response.redirect().toPath('/#contact')
  }
}
