import {Box, Container, Grid, Stack, Typography} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import {ReactComponent as LogoSvg} from '../assets/CebulaSpark.svg';
import {FC, useEffect, useLayoutEffect, useState} from 'react';
import {FormProvider, SubmitHandler, useForm} from 'react-hook-form';
import {object, string, TypeOf} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import FormInput from '../components/FormInput';
import {LinkItem} from './LoginPage';
import "../styles/login.css"
import axios from 'axios';
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import {checkTokenValidity} from "../api/user"
import {PUBLIC_URL} from "../api/api-commons";
import {useTranslation} from "react-i18next";

const signupSchema = object({
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

type ISignUp = TypeOf<typeof signupSchema>;

const SignupPage: FC = () => {

    // @ts-ignore
    const {t} = useTranslation();
    const navigate = useNavigate();

    useLayoutEffect( () => {
        const checkToken = async () => {
            const result = await checkTokenValidity();
            if (result) {
                navigate("/main")
            }
        }
        checkToken().then(r => {})
    }, []);

    const defaultValues: ISignUp = {
        email: '',
        password: '',
        passwordConfirm: '',
    };

    const methods = useForm<ISignUp>({
        resolver: zodResolver(signupSchema),
        defaultValues,
    });

    const onSubmitHandler: SubmitHandler<ISignUp> = (values: ISignUp) => {
        axios.post(PUBLIC_URL + `${process.env.REACT_APP_SIGNUP_URL}`, { user: values })
            .then(response => {
                toast.success("Account created!")
                navigate('/')
            })
            .catch(err => {
                console.log(PUBLIC_URL)
                toast.error(err.response.data.status.message)
            })
    };

    return (
        <Container
            maxWidth={false}
            sx={{ height: '100vh', backgroundColor: { xs: '#fff', md: '#f4f4f4' } }}
        >
            <Grid
                container
                justifyContent='center'
                alignItems='center'
                sx={{ width: '100%', height: '100%' }}
            >
                <Grid
                    item
                    sx={{ maxWidth: '70rem', width: '100%', backgroundColor: '#fff' }}
                >
                    <Grid
                        container
                        sx={{
                            boxShadow: { sm: '0 0 5px #ddd' },
                            py: '6rem',
                            px: '1rem',
                        }}
                    >
                        <FormProvider {...methods}>
                            <Typography
                                variant='h4'
                                component='h1'
                                sx={{
                                    textAlign: 'center',
                                    width: '100%',
                                    mb: '1.5rem',
                                    pb: { sm: '3rem' },
                                }}
                            >
                                {t('signup.welcome')}
                            </Typography>
                            <Grid
                                item
                                container
                                justifyContent='space-between'
                                rowSpacing={5}
                                sx={{
                                    maxWidth: { sm: '45rem' },
                                    marginInline: 'auto',
                                }}
                            >
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    sx={{ borderRight: { sm: '1px solid #ddd' } }}
                                >
                                    <Box
                                        display='flex'
                                        flexDirection='column'
                                        component='form'
                                        noValidate
                                        autoComplete='off'
                                        sx={{ paddingRight: { sm: '3rem' } }}
                                        onSubmit={methods.handleSubmit(onSubmitHandler)}
                                    >
                                        <Typography
                                            variant='h6'
                                            component='h1'
                                            sx={{ textAlign: 'center', mb: '1.5rem' }}
                                        >
                                            {t('signup.newAccount')}
                                        </Typography>

                                        <FormInput
                                            label='Email'
                                            type='email'
                                            name='email'
                                            focused
                                            required
                                        />
                                        <FormInput
                                            type={t('signup.password')}
                                            label='Password'
                                            name='password'
                                            required
                                            focused
                                        />
                                        <FormInput
                                            type='password'
                                            label={t('signup.confirmPassword')}
                                            name='passwordConfirm'
                                            required
                                            focused
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
                                            {t('signup.signUp')}
                                        </LoadingButton>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6} sx={{}} >
                                    <LogoSvg className="responsive"/>
                                </Grid>
                            </Grid>
                            <Grid container justifyContent='center'>
                                <Stack sx={{ mt: '3rem', textAlign: 'center' }}>
                                    <Typography sx={{ fontSize: '0.9rem', mb: '1rem' }}>
                                        {t('signup.haveAccount')} <LinkItem to='/'>{t('signup.login')}</LinkItem>
                                    </Typography>
                                </Stack>
                            </Grid>
                        </FormProvider>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
};

export default SignupPage;