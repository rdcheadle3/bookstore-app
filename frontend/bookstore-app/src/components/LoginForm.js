import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik'; // Import necessary components from Formik library
import * as Yup from 'yup'; // Import Yup for form validation
import './forms.css'; // Import custom CSS

const LoginForm = () => {
  const initialValues = {
    username: '',
    password: '',
  };

  const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'), // Set validation rule for username field
    password: Yup.string().required('Password is required'), // Set validation rule for password field
  });

  const handleSubmit = (values, { resetForm }) => {
    // Handle form submission logic here
    console.log(values); // Log form values to the console
    resetForm(); // Reset the form after submission
  };

  return (
    <div>
      <h2>Login Form</h2>
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
            <label htmlFor="password">Password:</label>
            <Field type="password" id="password" name="password" /> {/* Field component for password input */}
            <ErrorMessage name="password" component="div" className="error" /> {/* Display error message for password validation */}
          </div>
          <button type="submit">Login</button>
        </Form>
      </Formik>
    </div>
  );
};

export default LoginForm;