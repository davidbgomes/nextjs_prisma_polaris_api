import { useContext, useState } from 'react';

import {
  Page,
  Form,
  FormLayout,
  TextField,
  Button,
  Card,
} from '@shopify/polaris';
import { useRouter } from 'next/router';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';

import IsAuthenticatedContext from '../components/IsAuthenticatedContext';

type Inputs = {
  email: string;
  password: string;
};

export default function login(): JSX.Element {
  const { handleSubmit, control, errors } = useForm<Inputs>();
  const router = useRouter();
  const isAuthContext = useContext(IsAuthenticatedContext);

  const [loginError, setLoginError] = useState('');

  const checkoutSchema = yup.object().shape({
    email: yup.string().required(),
    password: yup.string().required(),
  });

  const onSubmit = async data => {
    checkoutSchema.isValid(data).then(function (valid) {
      if (valid) {
        fetch('http://localhost:8080/auth', {
          headers: { 'Content-Type': 'application/json' },
          method: 'post',
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        })
          .then(async res => {
            if (res.status === 200) {
              const token = await res.json();
              isAuthContext.setAuthTokenFunction(token.token);
              isAuthContext.login();
              router.push('/dashboard');
            } else {
              setLoginError('Invalid User');
              console.warn('Error ', res.status);
            }
          })
          .catch(error => console.warn(error));
      }
    });
  };

  return (
    <Page title="Login">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Card sectioned subdued>
          <FormLayout>
            <Controller
              name="email"
              label="Email"
              as={TextField}
              control={control}
              defaultValue=""
              rules={{ required: true }}
            />
            {errors.email && <p className="errorText">Invalid Email</p>}
            <Controller
              name="password"
              label="Password"
              as={TextField}
              control={control}
              type="password"
              rules={{ required: true }}
            />
            {errors.email && <p className="errorText">Invalid Password</p>}
            {loginError !== '' && <p className="errorText">{loginError}</p>}
          </FormLayout>
        </Card>
        <Button outline submit>
          Login
        </Button>
      </Form>
    </Page>
  );
}
