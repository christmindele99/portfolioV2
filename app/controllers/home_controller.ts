import type { HttpContext } from '@adonisjs/core/http'
import Comment from '#models/comment'

export default class HomeController {
  async index({ view }: HttpContext) {
    const comments = await Comment.query().preload('user').orderBy('updatedAt', 'desc').limit(3)

    const reviews = comments.map((comment) => ({
      fullname: comment.user.fullname,
      email: comment.user.email,
      rating: comment.rating,
      contain: comment.contain,
      initials: comment.user.fullname
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0].toUpperCase())
        .join(''),
    }))

    return view.render('pages/index', { reviews })
  }
}
