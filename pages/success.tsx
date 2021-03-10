import { Page, Card, DisplayText, Icon } from '@shopify/polaris';
import { MobileAcceptMajor } from '@shopify/polaris-icons';

export default function success(): JSX.Element {
  return (
    <Page title="Success">
      <Card sectioned>
        <Icon source={MobileAcceptMajor} />
        <div style={{ textAlign: 'center', marginTop: '15px' }}>
          <DisplayText size="large"> Thank you! </DisplayText>
          <DisplayText>Your order was processed successfully</DisplayText>
        </div>
      </Card>
    </Page>
  );
}
