import { useState, useEffect } from 'react';

import {
  Page,
  Form,
  FormLayout,
  TextField,
  Select,
  Button,
  Card,
  ChoiceList,
} from '@shopify/polaris';
import { useRouter } from 'next/router';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';

type Inputs = {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  products: string[];
};

export default function Home(): JSX.Element {
  const router = useRouter();

  const checkoutSchema = yup.object().shape({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup.string().email().required(),
    gender: yup.string().required(),
    products: yup.array().min(1),
  });

  const { errors, handleSubmit, control } = useForm<Inputs>();

  const [products, setProducts]: any[] = useState([]);
  const [productsErrorMessage, setProductsErrorMessage] = useState('');
  const [choices, setChoices]: any[] = useState([]);

  useEffect(() => {
    fetchProducts()
      .then(products => {
        setProducts(products);

        //SET CHOICES FOR CHOICELIST
        const choices_obj: any[] = [];
        for (let i = 0; i < products.length; i++) {
          choices_obj.push({
            id: products[i].id,
            label: products[i].name,
            value: products[i].name,
            helpText: `${products[i].price}€`,
          });
        }
        setChoices(choices_obj);
      })
      .catch(error => {
        console.warn(JSON.stringify(error, null, 2));
      });
  }, []);

  const fetchProducts = async () => {
    const res = await fetch('http://localhost:8080/products');
    const products = await res.json();
    return products;
  };

  const onSubmit = data => {
    checkoutSchema.isValid(data).then(function (valid) {
      if (valid) {
        //Filter through db products to get only the ones that were sent as form data
        const productsFiltered: any[] = products.filter(el =>
          data.products.includes(el.name),
        );

        fetch('http://localhost:8080/orders', {
          headers: { 'Content-Type': 'application/json' },
          method: 'post',
          body: JSON.stringify({
            customers: {
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              gender: data.gender,
            },
            products: productsFiltered,
          }),
        })
          .then(() => {
            router.push('/success');
          })
          .catch(error => console.warn(error));
      } else {
        if (data.products.length === 0) {
          setProductsErrorMessage('Please insert at least one product');
        }
      }
    });
  };

  const options = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ];

  return (
    <Page title="Order Form">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Card title="Personal Details" sectioned subdued>
          <FormLayout>
            <Controller
              name="firstName"
              label="Name"
              as={TextField}
              control={control}
              defaultValue=""
              rules={{ required: true }}
            />
            {errors.firstName && <p className="errorText">Invalid Name</p>}
            <Controller
              name="lastName"
              label="Surname"
              as={TextField}
              control={control}
              defaultValue=""
              rules={{ required: true }}
            />
            {errors.lastName && <p className="errorText">Invalid Surname</p>}
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
              as={<Select label="Gender" options={options} />}
              control={control}
              name="gender"
              defaultValue="male"
            />
          </FormLayout>
        </Card>
        <Card title="Products" sectioned subdued>
          <FormLayout>
            <Controller
              name="products"
              label="Products"
              control={control}
              defaultValue={[]}
              rules={{ minLength: 50 }}
              as={props => (
                <ChoiceList
                  allowMultiple
                  title="Select the products to checkout"
                  choices={choices}
                  selected={props.value}
                  onChange={selected => props.onChange(selected)}
                />
              )}
            />
            {productsErrorMessage !== '' && (
              <p className="errorText">{productsErrorMessage}</p>
            )}
          </FormLayout>
        </Card>
        <Button outline submit>
          Order
        </Button>
      </Form>
    </Page>
  );
}
