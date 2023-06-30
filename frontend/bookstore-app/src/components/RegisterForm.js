import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik'; // Import necessary components from Formik library
import * as Yup from 'yup'; // Import Yup for form validation
import './forms.css'; // Import custom CSS

const RegisterForm = () => {
  const initialValues = {
    username: '',
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'), // Set validation rule for username field
    email: Yup.string().email('Invalid email address').required('Email is required'), // Set validation rule for email field
    password: Yup.string().required('Password is required'), // Set validation rule for password field
  });

  const [isSubmitting, setIsSubmitting] = useState(false); // State to track form submission status

  const handleSubmit = (values, { resetForm }) => {
    setIsSubmitting(true); // Set isSubmitting to true when form is submitted

    // Simulate asynchronous form submission to the backend
    setTimeout(() => {
      console.log(values); // Log form values to the console

      // Perform API call or backend processing here

      resetForm(); // Reset the form after successful submission
      setIsSubmitting(false); // Set isSubmitting back to false
    }, 1000); // Simulating a 1-second delay

  };

  return (
    <div>
      <h2>Registration Form</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <div>
            <label htmlFor="username">Username:</label>
            <Field type="text" id="username" name="username" /> {/* Field component for username input */}
            <ErrorMessage name="username" component="div" className="error" /> {/* Display error message for username validation */}
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <Field type="email" id="email" name="email" /> {/* Field component for email input */}
            <ErrorMessage name="email" component="div" className="error" /> {/* Display error message for email validation */}
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <Field type="password" id="password" name="password" /> {/* Field component for password input */}
            <ErrorMessage name="password" component="div" className="error" /> {/* Display error message for password validation */}
          </div>
          <button type="submit">Register</button>
        </Form>
      </Formik>
    </div>
  );
};

export default RegisterForm;
