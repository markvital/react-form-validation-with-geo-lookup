import React, { useState, useEffect } from 'react';
import FormControl from './FormControl';
import './SignupForm.css';
import { FormData } from './FormData';


interface Props {
  stateOptions: string[];
  cityOptions: string[];
  loadingState: boolean;
  loadingCity: boolean;
  error: string;
  fetchUSCities: (selectedState: string) => Promise<void>;
}

const SignupForm: React.FC<Props> = ({
  stateOptions,
  cityOptions,
  loadingState,
  loadingCity,
  error,
  fetchUSCities,
}) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    state: '',
    city: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  
  // handle states input change
  useEffect(() => {
    if (formData.state) {
      fetchUSCities(formData.state);
    }
  }, [formData.state]);

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
        />
        <FormControl
          name="state"
          value={formData.state}
          options={stateOptions}
          error={errors.state || ''}
          onChange={handleInputChange}
        />
        <FormControl
          name="city"
          value={loadingCity ? "loading..." : formData.city}
          options={cityOptions}
          error={errors.city || ''}
          onChange={handleInputChange}
          disabled={loadingCity}
        />
        <FormControl
          name="email"
          value={formData.email}
          error={errors.email || ''}
          onChange={handleInputChange}
        />
        <FormControl
          name="password"
          value={formData.password}
          error={errors.password || ''}
          onChange={handleInputChange}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SignupForm;
