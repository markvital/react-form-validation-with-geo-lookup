import React, { useState, useEffect } from 'react';
import FormControl from './FormControl';
import './SignupForm.css';
import { FormData } from './FormData';


const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    state: '',
    city: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [authToken, setAuthToken] = useState<string>('');
  const [stateOptions, setStateOptions] = useState<string[]>([]);
  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const [loadingState, setLoadingState] = useState<boolean>(true);
  const [loadingCity, setLoadingCity] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [cachedCities, setCachedCities] = useState<{ [state: string]: string[] }>({});

  useEffect(() => {
    fetchAccessToken();
  }, []);

  useEffect(() => {
    if (authToken) {
      fetchUSStates();
    }
  }, [authToken]);

  useEffect(() => {
    if (authToken && formData.state) {
      fetchUSCities();
    }
  }, [authToken, formData.state]);
  

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
  
  const fetchUSStates = async () => {
    setLoadingState(true);
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
        setError('');
      } else {
        setError('Failed to fetch U.S. states');
      }
    } catch (error) {
      setError('Failed to fetch U.S. states');
    } finally {
      setLoadingState(false);
    }
  };

  const fetchUSCities = async () => {
    setLoadingCity(true);
    setCityOptions([]);
    try {
      if (cachedCities[formData.state]) {
        setCityOptions(cachedCities[formData.state]);
      } else {
        const response = await fetch(
          `https://www.universal-tutorial.com/api/cities/${formData.state}`,
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
          setCachedCities({ ...cachedCities, [formData.state]: extractedCityOptions });
        } else {
          setError(`Failed to fetch cities for ${formData.state}`);
        }
      }
    } catch (error) {
      setError(`Failed to fetch cities for ${formData.state}`);
    } finally {
      setLoadingCity(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors: Partial<FormData> = {};

    // Validate all fields are required
    Object.keys(formData).forEach((fieldName) => {
      const fieldValue = formData[fieldName as keyof FormData];
      if (fieldValue.trim() === '') {
        newErrors[fieldName as keyof FormData] = 'This field is required.';
        isValid = false;
      }
    });

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email !== '' && !emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Perform form submission (e.g., send a POST request)
      console.log(JSON.stringify(formData));
    } else {
      // Focus on the first input field with an error
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const inputRef = document.getElementById(firstErrorField) as HTMLInputElement | null;
        if (inputRef) {
          inputRef.focus();
        }
      }
    }
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
	const { name, value } = e.target;
	setFormData((prevData) => ({
	  ...prevData,
	  [name]: value,
	  city: '', // Reset city when state changes
	}));
  };

  const isCityDisabled = formData.state.trim() === '';

  if (loadingState) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {error && <p>Error: {error}</p>}
      <form className="signup-form" onSubmit={handleSubmit}>
        <FormControl
          name="firstName"
          value={formData.firstName}
          options={[]}
          error={errors.firstName || ''}
          onChange={handleInputChange}
          autoFocus={true}
        />
        <FormControl
          name="lastName"
          value={formData.lastName}
          options={[]}
          error={errors.lastName || ''}
          onChange={handleInputChange}
          autoFocus={false}
        />
        <FormControl
          name="state"
          value={formData.state}
          options={stateOptions}
          error={errors.state || ''}
          onChange={handleInputChange}
          autoFocus={false}
        />
        <FormControl
          name="city"
          value={loadingCity ? "loading..." : formData.city}
          options={cityOptions}
          error={errors.city || ''}
          onChange={handleInputChange}
          autoFocus={false}
          disabled={loadingCity}
        />
        <FormControl
          name="email"
          value={formData.email}
          options={[]}
          error={errors.email || ''}
          onChange={handleInputChange}
          autoFocus={false}
        />
        <FormControl
          name="password"
          value={formData.password}
          options={[]}
          error={errors.password || ''}
          onChange={handleInputChange}
          autoFocus={false}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SignupForm;
