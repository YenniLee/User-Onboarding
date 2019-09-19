import React, { useState, useEffect } from 'react';
import { Form, Field, withFormik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';

const UserForm = ({ values, status, errors, touched }) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if(status) {
            setUsers([...users, status]);
        }
    }, [status]);

    return (
        <div className='user-form'>
            <h1>User Form</h1>
            <Form>
                <Field 
                    type='text' 
                    name='name' placeholder='First Name Last Name'
                />
                {touched.name && errors.name && <p className='error'>{errors.name}</p>}

                <Field 
                    type='email'
                    name='email'
                    placeholder='email address'
                />
                {touched.email && errors.email && <p className='error'>{errors.email}</p>}

                <Field 
                    type='password'
                    name='password'
                    placeholder='********'
                />
                {touched.password && errors.password && <p className='error'>{errors.password}</p>}

                <label className='checkbox-container'>
                    Terms of Service
                    <Field 
                        type='checkbox'
                        name='terms'
                        checked={values.terms}
                    />
                </label>
                <button type='submit'>Submit</button>
            </Form>
            {users.map(user => (
                <ul key={user.id}>
                    <li>Name: {user.name}</li>
                    <li>Email: {user.email}</li>
                </ul>
            ))}
        </div>

    )
}



const FormikUserForm = withFormik({
    mapPropsToValues({ name, email, password, terms }) {
        return {
            name: name || '',
            email: email || '',
            password: password || '',
            terms: terms || false
        }
    },
    valildationSchema: Yup.object().shape({
        name: Yup.string().required('Please enter first name and last name'),
        email: Yup.string().email().required('Email is not valid'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is incorrect'),
        terms: Yup.boolean().required().oneOf([true], 'Must Accept Terms of Service')
    }),
    handleSubmit(values, { setStatus }) {
        axios
            .post('https://reqres.in/api/users/', values)
            .then(res => {
                setStatus(res.data);
            })
            .catch(error => console.log(error.response));
    }
})(UserForm)


export default FormikUserForm;