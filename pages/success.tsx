import Link from 'next/link'
import { Layout, Page, SettingToggle, TextStyle, Form, FormLayout, TextField, Select, Button, Card, DisplayText, Icon} from '@shopify/polaris'
import { MobileAcceptMajor } from '@shopify/polaris-icons'


export default function success(): JSX.Element {

    return (
        <Page title="Success">
            <Card sectioned style={{backgroundColor: "antiquewhite"}}>
                <Icon source={MobileAcceptMajor} />
                <div style={{textAlign:"center", marginTop:"15px"}}>
                    <DisplayText size="large"> Thank you! </DisplayText>
                    <DisplayText variation="strong">Your order was processed successfully</DisplayText>
                </div>
            </Card>
        </Page>
    )
}
