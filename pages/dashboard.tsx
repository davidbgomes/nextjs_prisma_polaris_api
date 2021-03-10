import React, { useCallback, useState, useEffect, useContext } from 'react';

import {
  Card,
  Tabs,
  ResourceList,
  ResourceItem,
  TextStyle,
  Page,
  Modal,
  TextContainer,
} from '@shopify/polaris';
import { useRouter } from 'next/router';

import IsAuthenticatedContext from '../components/IsAuthenticatedContext';

export default function dashboard(): JSX.Element {
  const [selected, setSelected] = useState(0);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);

  //Values that come from fetching order results when clicked
  const [resultProducts, setResultProducts]: any[] = useState([]);
  const [resultCustomers, setResultCustomers]: any[] = useState([]);

  const isAuthContext = useContext(IsAuthenticatedContext);
  const router = useRouter();

  const handleTabChange = useCallback(
    selectedTabIndex => setSelected(selectedTabIndex),
    [],
  );

  const handleModalClose = useCallback(() => {
    setModalOpen(false);
  }, []);

  const fetchProducts = async () => {
    const res = await fetch('http://localhost:8080/products');
    const products = await res.json();
    return products;
  };

  const fetchCustomers = async () => {
    const res = await fetch('http://localhost:8080/customers');
    const customers = await res.json();
    return customers;
  };

  const fetchOrders = async () => {
    const res = await fetch('http://localhost:8080/orders');
    const orders = await res.json();
    return orders;
  };

  useEffect(() => {
    if (isAuthContext.isAuthenticated === false) {
      router.push('/login');
    }

    fetchProducts()
      .then(products => setProducts(products))
      .catch(error => {
        console.warn(JSON.stringify(error, null, 2));
      });

    fetchCustomers()
      .then(customers => setCustomers(customers))
      .catch(error => {
        console.warn(JSON.stringify(error, null, 2));
      });

    fetchOrders()
      .then(orders => setOrders(orders))
      .catch(error => {
        console.warn(JSON.stringify(error, null, 2));
      });
  }, []);

  const tabs = [
    {
      id: 'all-products',
      content: 'Products',
      accessibilityLabel: 'All products',
      panelID: 'all-products-content',
    },
    {
      id: 'all-customers',
      content: 'Customers',
      panelID: 'all-customers-content',
    },
    {
      id: 'all-orders',
      content: 'Orders',
      panelID: 'all-orders-content',
    },
  ];

  const toggleModal = async id => {
    const res = await fetch(`http://localhost:8080/orders/${id}`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + isAuthContext.authToken,
      },
    });
    const result = await res.json();

    const result_products: any[] = [];
    for (let i = 0; i < result.length; i++) {
      result_products.push(result[i].products);
    }

    setResultProducts(result_products);
    setResultCustomers(result[0].orders.customers);
    setModalOpen(true);
  };

  return (
    <Page title="Dashboard">
      <Card>
        <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
          <Card.Section title={tabs[selected].content}>
            {selected === 0 ? (
              <div>
                <ResourceList
                  resourceName={{ singular: 'customer', plural: 'customers' }}
                  items={products}
                  renderItem={item => {
                    const { id, name, price } = item;

                    return (
                      <ResourceItem
                        onClick={() => false}
                        id={id}
                        name={name}
                        media={
                          <TextStyle variation="strong">{`#${id}`}</TextStyle>
                        }
                        accessibilityLabel={`View details for ${name}`}
                      >
                        <h3>
                          <TextStyle variation="strong">{name}</TextStyle>
                        </h3>
                        <div>{`${price}€`}</div>
                      </ResourceItem>
                    );
                  }}
                />
              </div>
            ) : selected === 1 ? (
              <div>
                <ResourceList
                  resourceName={{ singular: 'customer', plural: 'customers' }}
                  items={customers}
                  renderItem={item => {
                    const { id, first_name, last_name, email, gender } = item;

                    return (
                      <ResourceItem
                        onClick={() => false}
                        id={id}
                        media={
                          <TextStyle variation="strong">{`#${id}`}</TextStyle>
                        }
                        accessibilityLabel={`View details for ${first_name}`}
                      >
                        <h3>
                          <TextStyle variation="strong">{`${first_name} ${last_name}`}</TextStyle>
                        </h3>
                        <div>
                          <TextStyle>{`Email: ${email}`}</TextStyle>
                        </div>
                        <div>
                          <TextStyle>{`Gender: ${gender}`}</TextStyle>
                        </div>
                      </ResourceItem>
                    );
                  }}
                />
              </div>
            ) : (
              selected === 2 && (
                <div>
                  <ResourceList
                    resourceName={{ singular: 'customer', plural: 'customers' }}
                    items={orders}
                    renderItem={item => {
                      const { id } = item;

                      return (
                        <ResourceItem
                          id={id}
                          media={
                            <TextStyle variation="strong">{`#${id}`}</TextStyle>
                          }
                          accessibilityLabel={`View details for Order ${id}`}
                          onClick={() => toggleModal(id)}
                        ></ResourceItem>
                      );
                    }}
                  />
                </div>
              )
            )}
          </Card.Section>
        </Tabs>
      </Card>
      {modalOpen && (
        <Modal
          open={modalOpen}
          onClose={handleModalClose}
          title="Order Details"
        >
          <Modal.Section>
            <TextContainer>
              <p>{`Customer: ${resultCustomers.first_name} ${resultCustomers.last_name}`}</p>
              {resultProducts.map((item, i) => {
                return (
                  <Card sectioned subdued key={i}>
                    <TextContainer>
                      <p key={i}>{`Product: ${item.name}`}</p>
                      <p key={i}>{`Price: ${item.price}€`}</p>
                    </TextContainer>
                  </Card>
                );
              })}
            </TextContainer>
          </Modal.Section>
        </Modal>
      )}
    </Page>
  );
}
