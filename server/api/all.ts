import { downloadList } from '~/core/Famous'
import { defineEventHandler } from 'h3'

export default defineEventHandler(async () => {
  return downloadList()
})
