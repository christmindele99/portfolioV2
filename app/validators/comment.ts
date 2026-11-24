import vine from '@vinejs/vine'

export const createCommentValidator = vine.compile(
  vine.object({
    author: vine.string().trim().minLength(2).maxLength(250),
    authorEmail: vine.string().trim().email().normalizeEmail().maxLength(250),
    rating: vine.number().withoutDecimals().min(1).max(6),
    comment: vine.string().trim().minLength(5).maxLength(1000),
  })
)
