import { useCallback, useState } from 'react';

import { Layout, Page, SettingToggle, TextStyle } from '@shopify/polaris';

export default function A(): JSX.Element {
  const [isDirty, setIsDirty] = useState(false);

  const toggleIsDirty = useCallback(() => setIsDirty(isDirty => !isDirty), []);

  const contentStatus = isDirty ? 'Disable' : 'Enable';
  const textStatus = isDirty ? 'enabled' : 'disabled';

  return (
    <Page title="Account">
      <Layout>
        <Layout.Section>
          <SettingToggle
            action={{
              content: contentStatus,
              onAction: toggleIsDirty,
            }}
            enabled={isDirty}
          >
            This setting is{' '}
            <TextStyle variation="strong">{textStatus}</TextStyle>.
          </SettingToggle>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
