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

  useEffect(() => {
    fetchAccessToken();
  }, []);

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
        console.log("auth-token", auth_token);
      } else {
        // Handle error response
        console.error('Failed to fetch access token');
      }
    } catch (error) {
      // Handle fetch error
      console.error('Failed to fetch access token', error);
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

  return (
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
        options={['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut']}
        error={errors.state || ''}
        onChange={handleStateChange}
        autoFocus={false}
      />
      <FormControl
        name="city"
        value={formData.city}
        options={
          formData.state === 'California'
            ? ['Los Angeles', 'San Francisco', 'San Diego']
            : []
        }
        error={errors.city || ''}
        onChange={handleInputChange}
        autoFocus={false}
        disabled={isCityDisabled}
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
  );
};

export default SignupForm;
