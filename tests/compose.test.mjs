import assert from 'node:assert/strict';
import { test } from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// The UCS compose decides whether anyone can log in after an App Center
// upgrade. It used to enable WeKan's LDAP group filter with no group name and
// no group id attribute, carried over from 6.09, where that meant "in any
// group". WeKan 12.x refuses an incomplete group filter (wekan/wekan#3700), so
// after the 12.32 upgrade every LDAP login failed with "LDAP authentication
// failed". Access on UCS is the (wekanActivated=TRUE) user filter instead.

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const compose = fs.readFileSync(path.join(root, 'component/compose'), 'utf8');
const env = Object.fromEntries(
  [...compose.matchAll(/^\s*-\s*([A-Z][A-Z0-9_]*)=(.*)$/gm)].map((m) => [m[1], m[2].trim()]),
);

test('login is restricted by the wekanActivated user filter, not a group', () => {
  assert.equal(env.LDAP_USER_SEARCH_FILTER, '@%@wekan/LDAP_USER_SEARCH_FILTER@%@');
  assert.equal(env.LDAP_GROUP_FILTER_ENABLE, 'false');
});

test('the group lookup is complete, so Domain Admins become WeKan admins', () => {
  assert.equal(env.LDAP_SYNC_ADMIN_STATUS, 'true');
  assert.ok(env.LDAP_SYNC_ADMIN_GROUPS, 'LDAP_SYNC_ADMIN_GROUPS is set');
  for (const key of ['LDAP_GROUP_FILTER_GROUP_ID_ATTRIBUTE',
    'LDAP_GROUP_FILTER_GROUP_MEMBER_ATTRIBUTE', 'LDAP_GROUP_FILTER_GROUP_MEMBER_FORMAT']) {
    assert.ok(env[key], `${key} must be set, or WeKan answers with no groups and nobody is admin`);
  }
  assert.equal(env.LDAP_GROUP_FILTER_GROUP_ID_ATTRIBUTE, 'cn');
});

// Negative: a filter switched on again must name its group. WeKan refuses one
// that does not, which is exactly what locked everybody out.
test('a group filter is never enabled without a group name', () => {
  if (env.LDAP_GROUP_FILTER_ENABLE === 'true') {
    assert.ok(env.LDAP_GROUP_FILTER_GROUP_NAME, 'LDAP_GROUP_FILTER_GROUP_NAME');
  }
});
