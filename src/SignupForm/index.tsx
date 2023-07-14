import React, { useState, useEffect } from 'react';
import SignupForm from './SignupForm';

const FormContainer: React.FC = () => {
  // We could store access token somewhere in local storage or cookies to avoid extra request between reloads
  const [authToken, setAuthToken] = useState<string>('');
  const [stateOptions, setStateOptions] = useState<string[]>([]);
  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const [loadingState, setLoadingState] = useState<boolean>(true);
  const [loadingCity, setLoadingCity] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [cachedCities, setCachedCities] = useState<{ [state: string]: string[] }>({});

  useEffect(() => {
	const fetchAccessToken = async () => {
		try {
		  const response = await fetch('https://www.universal-tutorial.com/api/getaccesstoken', {
			method: 'GET',
			headers: {
			  Accept: 'application/json',
			  'api-token': 'ZlRaKJeHEEVSrf8D-ITOyje9R69Re5glxLokD8Jbsq4wwOQ9PMbIZogB3DsMHYJK2c4',
			  'user-email': 'giblets-08crispy@icloud.com',
			},
		  });
	
		  if (response.ok) {
			const data = await response.json();
			const { auth_token } = data;
			setAuthToken(auth_token);
		  } else {
			setError('Failed to fetch access token');
		  }
		} catch (error) {
		  setError('Failed to fetch access token');
		}
	};

    fetchAccessToken();
  }, []);

  useEffect(() => {
	const fetchUSStates = async () => {
		try {
		  const response = await fetch('https://www.universal-tutorial.com/api/states/United States', {
			method: 'GET',
			headers: {
			  Authorization: `Bearer ${authToken}`,
			  Accept: 'application/json',
			},
		  });
	
		  if (response.ok) {
			const data = await response.json();
			const extractedStateOptions = data.map((item: { state_name: string }) => item.state_name);
			setStateOptions(extractedStateOptions);
		  } else {
			setError('Failed to fetch U.S. states');
		  }
		} catch (error) {
		  setError('Failed to fetch U.S. states');
		} finally {
		  setLoadingState(false);
		}
	};

    if (authToken) {
      fetchUSStates();
    }
  }, [authToken]);

  const fetchUSCities = async (selectedState: string) => {
	setLoadingCity(true);
	setCityOptions([]);
	try {
		if (cachedCities[selectedState]) {
			setCityOptions(cachedCities[selectedState]);
		} else {
			const response = await fetch(
				`https://www.universal-tutorial.com/api/cities/${selectedState}`,
				{
					method: 'GET',
					headers: {
						Authorization: `Bearer ${authToken}`,
						Accept: 'application/json',
					},
				}
			);
		
			if (response.ok) {
				const data = await response.json();
				const extractedCityOptions = data.map((item: { city_name: string }) => item.city_name);
				setCityOptions(extractedCityOptions);
				setCachedCities({ ...cachedCities, [selectedState]: extractedCityOptions });
			} else {
				setError(`Failed to fetch cities for ${selectedState}`);
			}
		}
	} catch (error) {
	  setError(`Failed to fetch cities for ${selectedState}`);
	} finally {
	  setLoadingCity(false);
	}
  };

  return (
    <SignupForm
      stateOptions={stateOptions}
      cityOptions={cityOptions}
      loadingState={loadingState}
      loadingCity={loadingCity}
      error={error}
      fetchUSCities={fetchUSCities}
    />
  );
};

export default FormContainer;