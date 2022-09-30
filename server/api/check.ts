import { checkUsername } from '~/core/Famous'

export default defineEventHandler(async (event) => {
  const { website, username } = await useBody(event)
  return checkUsername(username, website)
})
