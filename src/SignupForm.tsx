import React, { useState, useEffect, useRef } from 'react';
import './SignupForm.css';


interface FormData {
  firstName: string;
  lastName: string;
  state: string;
  city: string;
  email: string;
  password: string;
}

interface FormControlProps {
  name: keyof FormData;
  value: string;
  options: string[];
  error: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  autoFocus: boolean;
  disabled?: boolean;
}

const FormControl: React.FC<FormControlProps> = ({
  name,
  value,
  options,
  error,
  onChange,
  autoFocus,
  disabled = false,
}) => {
  const inputRef = useRef<HTMLInputElement | HTMLSelectElement>(null);

  React.useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const splitCamelCase = (str: string) => {
    return str
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Split camel case
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
      .join(' ');
  };

  const label = splitCamelCase(name as string);

  const renderControl = () => {
    if (options && options.length > 0) {
      return (
        <select
          className="form-control"
          id={name as string}
          name={name as string}
          value={value}
          onChange={onChange}
          ref={inputRef as React.RefObject<HTMLSelectElement>}
          disabled={disabled}
        >
          <option value="">Select {label}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        className="form-control"
        type="text"
        id={name as string}
        name={name as string}
        value={value}
        onChange={onChange}
        ref={inputRef as React.RefObject<HTMLInputElement>}
        placeholder={value ? '' : label}
        disabled={disabled}
      />
    );
  };

  return (
    <div className="form-group">
      {renderControl()}
      {error && <span className="error">{error}</span>}
    </div>
  );
};

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
		console.log('fetching states', extractedStateOptions);
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
        setError('');
		console.log('fetching cities', extractedCityOptions)
      } else {
        setError('Failed to fetch cities');
      }
    } catch (error) {
      setError('Failed to fetch cities');
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
