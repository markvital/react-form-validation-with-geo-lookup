import React, { useRef } from 'react';
import { FormData } from './FormData';


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

  export default FormControl;