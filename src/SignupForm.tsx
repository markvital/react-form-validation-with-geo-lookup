import React, { useState, useRef } from 'react';
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
	fieldName: keyof FormData;
	value: string;
	error: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	autoFocus: boolean;
  }
  
  const FormControl: React.FC<FormControlProps> = ({ fieldName, value, error, onChange, autoFocus }) => {
	const inputRef = useRef<HTMLInputElement>(null);
  
	React.useEffect(() => {
	  if (autoFocus && inputRef.current) {
		inputRef.current.focus();
	  }
	}, [autoFocus]);
  
	const label = fieldName
	  .replace(/([a-z])([A-Z])/g, '$1 $2') // Split camel case
	  .split(' ')
	  .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
	  .join(' ');
  
	return (
	  <div className="form-group">
		<input
		  type="text"
		  id={fieldName as string}
		  name={fieldName as string}
		  value={value}
		  onChange={onChange}
		  ref={inputRef}
		  placeholder={value ? '' : label}
		/>
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
	  Object.keys(formData).forEach((fieldName) => {
		const fieldValue = formData[fieldName as keyof FormData];
		if (fieldValue === '') {
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
  
	return (
	  <form className="signup-form" onSubmit={handleSubmit}>
		{Object.keys(formData).map((fieldName) => (
		  <FormControl
			key={fieldName}
			fieldName={fieldName as keyof FormData}
			value={formData[fieldName as keyof FormData]}
			error={errors[fieldName as keyof FormData] || ''}
			onChange={handleInputChange}
			autoFocus={fieldName === Object.keys(errors)[0]}
		  />
		))}
		<button type="submit">Submit</button>
	  </form>
	);
  };
  
  export default SignupForm;
