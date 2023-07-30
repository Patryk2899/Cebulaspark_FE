import React, {FC, useLayoutEffect, useState} from "react";
import {Box, Grid, Typography} from "@mui/material";
import {FormProvider, SubmitHandler, useForm} from "react-hook-form";
import FormInput from "../components/FormInput";
import LoadingButton from "@mui/lab/LoadingButton";
import {zodResolver} from "@hookform/resolvers/zod";
import {object, string, TypeOf} from "zod";
import Navbar from "../components/Navbar";
import {checkTokenValidity} from "../api/user";
import {PUBLIC_URL} from "../api/api-commons";
import axios from "axios";
import {toast} from "react-toastify";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";

interface EmailRequestForm {
    email: string;
    password: string;
    password_confirmation: string;
}

const emailChangeSchema = object({
    email: string().min(1, 'Email is required').email('Email is invalid'),
    password: string()
        .min(1, 'Password is required')
        .min(8, 'Password must be more than 8 characters')
        .max(32, 'Password must be less than 32 characters'),
    passwordConfirm: string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: 'Passwords do not match',
});


type isEmailChange = TypeOf<typeof emailChangeSchema>;

const ForgotPasswordPage: FC = () => {
    const [isLogged, setIsLogged] = useState(false);

    // @ts-ignore
    const {t} = useTranslation();
    const navigate = useNavigate();

    useLayoutEffect( () => {
        const checkToken = async () => {
            const result = await checkTokenValidity();
            setIsLogged(result)
        }
        checkToken().then()
    }, [isLogged]);

    const onSubmitHandler: SubmitHandler<isEmailChange> = (values: isEmailChange) => {
        axios.post(PUBLIC_URL + `${process.env.REACT_APP_EMAIL_CHANGE}`, {
            email: values.email,
            password: values.password
        }, {
            headers: {
                'content-type': 'application/json',
                accept: 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        })
            .then(response => {
                toast.success('Email has been changed')
                navigate('/main')
            })
            .catch(err => {
                console.log(err)
                toast.error(err.response.data)
            })
    }

    const defaultValues: isEmailChange = {
        email: '',
        password: '',
        passwordConfirm: '',
    };

    const methods = useForm<isEmailChange>({
        resolver: zodResolver(emailChangeSchema),
        defaultValues,
    });

    return (
        <div>
            <Navbar isLoggedIn={isLogged}/>
            <Grid
                container
                justifyContent='center'
                alignItems='center'
                sx={{ width: '100%', height: '100%' }}
                marginTop="30px"
            >
                <FormProvider {...methods}>
                    <Box
                        display='flex'
                        flexDirection='column'
                        justifyContent='center'
                        component='form'
                        onSubmit={methods.handleSubmit(onSubmitHandler)}
                    >

                        <FormInput
                            label='Email'
                            name='email'
                            focused
                            required
                        />
                        <FormInput
                            label='Password'
                            name='password'
                            required
                            focused
                            type="Password"
                        />
                        <FormInput
                            label='Password confirmation'
                            name='passwordConfirm'
                            required
                            focused
                            type="Password"
                        />
                        <LoadingButton
                            loading={false}
                            type='submit'
                            variant='contained'
                            sx={{
                                py: '0.8rem',
                                mt: 2,
                                width: '80%',
                                marginInline: 'auto',
                            }}
                        >
                            Submit
                        </LoadingButton>
                    </Box>

                </FormProvider>
            </Grid>
        </div>
    )
};

export default ForgotPasswordPage