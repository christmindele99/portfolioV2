import type { HttpContext } from '@adonisjs/core/http'
import mail from '@adonisjs/mail/services/main'
import User from '#models/user'
import { createMessageValidator } from '#validators/message'

export default class MessagesController {
  async store({ request, response, session, logger }: HttpContext) {
    const { fullname, email, number, contain } = await request.validateUsing(createMessageValidator)

    const user = await User.firstOrCreate({ email }, { fullname })
    await user.related('messages').create({ number, contain })

    // Copie du message dans ma boîte Gmail
    try {
      await mail.send((message) => {
        message
          .to('christmindele99@gmail.com')
          .replyTo(email)
          .subject(`Nouveau message de ${fullname}`)
          .text(`Nom : ${fullname}\nEmail : ${email}\nTéléphone : ${number}\n\n${contain}`)
      })
    } catch (error) {
      logger.error({ err: error }, "L'envoi de l'email a échoué")
    }

    session.flash('success', 'Message envoyé. Je te réponds très vite.')
    return response.redirect().toPath('/#contact')
  }
}
