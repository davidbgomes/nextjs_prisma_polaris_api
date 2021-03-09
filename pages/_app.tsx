import { AppProvider , Navigation, Frame} from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import { AppProps } from 'next/app';
import {HomeMajor, KeyMajor, AnalyticsMajor} from '@shopify/polaris-icons';
import IsAuthenticatedContext from "../components/IsAuthenticatedContext.tsx"
import { useState, useCallback, useEffect } from 'react';

import '@shopify/polaris/dist/styles.css';
import '@/styles/globals.css';

export default function MyApp({ Component, pageProps }: AppProps): JSX.Element {

	const [selected, setSelected] = useState('/index')
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [authToken, setAuthToken] = useState(false)

	useEffect(() => {
	    setSelected(window.location.pathname)
  	});

  	const login = () =>{
  		setIsAuthenticated(true)
  	}

  	const setAuthTokenFunction = (token) =>{
  		setAuthToken(token)
  	}

  return (
  		<IsAuthenticatedContext.Provider value={{isAuthenticated: isAuthenticated, login: login, authToken: authToken, setAuthTokenFunction: setAuthTokenFunction}}>
	    	<AppProvider i18n={enTranslations} features={{ newDesignLanguage: true }}>
		    	<Frame
		          	navigation={
		          	<Navigation location={selected}>
				    	<Navigation.Section
					    	items={[
					    		{
					    			url: '/',
					    			label: 'Home',
					    			icon: HomeMajor,
					    			matches:true,
					    			selected:selected === '/',
					    		},
					    		{
					    			url: '/login',
					    			label: 'Login',
					    			icon: KeyMajor,
					    			selected:selected === '/login',
					    			disabled: isAuthenticated
					    		},
					    		{
					    			url: '/dashboard',
					    			label: 'Dashboard',
					    			icon: AnalyticsMajor,
					    			selected:selected === '/dashboard',
					    			disabled: isAuthenticated === false,
					    		},
					    	]}
			    		/>
		    		</Navigation>}
		        >
	      			<Component {...pageProps} />
		        </Frame>
	    	</AppProvider>
	    </IsAuthenticatedContext.Provider>
  	);
}
