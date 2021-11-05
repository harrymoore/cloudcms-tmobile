#!/bin/sh

# build form fields from definition
# npx cloudcms-util create-form-fields --data-path ./ --qname xyz:document --overwrite

# use cloudcms-util import feature to upload a local copy of the content model to a cloud cms branch
# npm install cloudcms-util

# local docker "Test 1" project
# npx cloudcms-util import -g ../gitana-localhost-test1.json --branch master --all-definitions

# harry's dev projects:
npx cloudcms-util import -g ../gitana-harry-tmobile.json --branch master --all-definitions

# T-Mobile projects:
# npx cloudcms-util import -g ../gitana-tmobile-prod.json --branch master --all-definitions
