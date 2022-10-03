import {checkUsername} from '~/core/Famous';
import {defineEventHandler, readBody} from 'h3';

export default defineEventHandler(async event => {
  const {website, username} = await readBody(event);
  return checkUsername(username, website);
});
