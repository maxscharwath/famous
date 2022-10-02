import { describe, expect, test } from 'vitest'
import { Website } from '../core/Website'
import { checkUsername, downloadList, QueryStatus } from '../core/Famous'

describe.concurrent('core', async () => {
  const websites: { name: string, website: Website }[] = Object.entries(await downloadList()).map(([name, website]) => ({
    name,
    website
  }));

  test('should have websites', () => {
    expect(websites.length).toBeGreaterThan(0);
  });
  describe.concurrent.each(websites)('test $name', ({ name, website }) => {
    test.concurrent(`[${name}] should check claimed`, async () => {
      const response = await checkUsername(website.username_claimed, website);
      expect(response.status).toBe(QueryStatus.CLAIMED);
    });
    test.concurrent(`[${name}] should check available`, async () => {
      const response = await checkUsername(website.username_unclaimed, website);
      expect(response.status).toBe(QueryStatus.AVAILABLE);
    });
  });
});
