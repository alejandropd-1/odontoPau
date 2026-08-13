import { defineConfig } from 'tinacms';

import { assertTinaCloudConfiguration, resolveTinaBranch } from '../src/cms/tina/branch';
import { tinaCollections } from '../src/cms/tina/collections';
import { EditorialDashboard } from './dashboard/EditorialDashboard';

const branchResolution = resolveTinaBranch(process.env);
assertTinaCloudConfiguration(process.env);

export default defineConfig({
  branch: branchResolution.branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,
  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      mediaRoot: 'images',
      publicFolder: 'public',
    },
  },
  schema: {
    collections: tinaCollections,
  },
  cmsCallback: (cms) => {
    cms.plugins.add({
      __type: 'screen',
      name: 'Panel editorial',
      Icon: () => '✦',
      layout: 'fullscreen',
      Component: EditorialDashboard,
    });
    return cms;
  },
});
