import { checkUsername } from '~/core/Famous'

export default defineEventHandler(async (event) => {
  const { website, username } = await useBody(event)
  return await checkUsername(username, website)
})
