import vine from '@vinejs/vine'

export const createMessageValidator = vine.compile(
  vine.object({
    fullname: vine.string().trim().minLength(2).maxLength(250),
    email: vine.string().trim().email().normalizeEmail().maxLength(250),
    number: vine.string().trim().minLength(6).maxLength(150),
    contain: vine.string().trim().minLength(5).maxLength(2000),
  })
)
