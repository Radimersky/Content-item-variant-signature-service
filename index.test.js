const index = require('./index');

const _variant = {
  "system": {
    "id": "50613e08-130a-40c9-b106-4e5093b41cf4",
    "name": "blabla",
    "codename": "blabla",
    "language": "default",
    "type": "le_only_7e78a77",
    "collection": "default",
    "sitemap_locations": [],
    "last_modified": "2022-02-28T08:47:30.2609716Z",
    "workflow_step": "published"
  },
  "elements": {
    "le": {
      "type": "text",
      "name": "le",
      "value": "xxx"
    }
  }
}

test('sign and verify', () => {
  const result = index.sign(_variant);

  const isVerified = index.verify(result.hash, result.signature);
  
  expect(isVerified).toBe(true);
})