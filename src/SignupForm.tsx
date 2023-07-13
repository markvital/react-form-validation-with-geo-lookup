import React, { useState } from 'react';
import './SignupForm.css';

interface FormData {
  firstName: string;
  lastName: string;
  state: string;
  city: string;
  email: string;
  password: string;
}

const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    state: '',
    city: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const validateForm = () => {
	let isValid = true;
	const newErrors: Partial<FormData> = {};
  
	// Validate all fields are required
	Object.keys(formData).forEach((key) => {
	  const fieldName = key as keyof FormData; // Type assertion
	  if (formData[fieldName] === '') {
		newErrors[fieldName] = 'This field is required.';
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
    }
  };

  return (
    <form className="signup-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
        />
        {errors.firstName && <span className="error">{errors.firstName}</span>}
      </div>
      <div className="form-group">
        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
        />
        {errors.lastName && <span className="error">{errors.lastName}</span>}
      </div>
      <div className="form-group">
        <label htmlFor="state">State</label>
        <input
          type="text"
          id="state"
          name="state"
          value={formData.state}
          onChange={handleInputChange}
        />
        {errors.state && <span className="error">{errors.state}</span>}
      </div>
      <div className="form-group">
        <label htmlFor="city">City</label>
        <input
          type="text"
          id="city"
          name="city"
          value={formData.city}
          onChange={handleInputChange}
        />
        {errors.city && <span className="error">{errors.city}</span>}
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
        />
        {errors.password && <span className="error">{errors.password}</span>}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default SignupForm;