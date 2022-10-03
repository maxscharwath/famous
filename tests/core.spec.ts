import {describe, expect, test} from 'vitest';
import {Website} from '../core/Website';
import {checkUsername, downloadList, QueryStatus} from '../core/Famous';

describe.concurrent('core', async () => {
  const websites: {name: string; website: Website}[] = Object.entries(
    await downloadList()
  ).map(([name, website]) => ({
    name,
    website,
  }));

  test.concurrent('should have websites', () => {
    expect(websites.length).toBeGreaterThan(0);
  });
  test.concurrent.each(websites)('test $name', async ({name, website}) => {
    const responses = await Promise.all([
      checkUsername(website.username_claimed, website),
      checkUsername(website.username_unclaimed, website),
    ]);
    expect(responses[0].status, `${name} should have claimed status`).toBe(
      QueryStatus.CLAIMED
    );
    expect(responses[1].status, `${name} should have available status`).toBe(
      QueryStatus.AVAILABLE
    );
  });
});
