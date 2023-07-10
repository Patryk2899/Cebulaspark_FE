import {
    Container,
    Grid,
    Box,
    Typography,
    Stack,
    FormControlLabel,
    Checkbox, FormControl, InputLabel, Select,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import {FC, useLayoutEffect, useState} from 'react';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import {Link, useNavigate} from 'react-router-dom';
import { literal, object, string, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '../components/FormInput';
import styled from '@emotion/styled';
import {ReactComponent as LogoSvg} from "../assets/CebulaSpark.svg";
import {checkTokenValidity} from "../api/user";
import MenuItem from "@mui/material/MenuItem";
import * as React from "react";
import {Trans, useTranslation} from "react-i18next";
import i18next from "i18next";

export const LinkItem = styled(Link)`
  text-decoration: none;
  color: #3683dc;
  &:hover {
    text-decoration: underline;
    color: #5ea1b6;
  }
`;

const loginSchema = object({
    email: string().min(1, 'Email is required').email('Email is invalid'),
    password: string()
        .min(1, 'Password is required')
        .min(8, 'Password must be more than 8 characters')
        .max(32, 'Password must be less than 32 characters'),
    persistUser: literal(true).optional(),
});

type ILogin = TypeOf<typeof loginSchema>;

const LoginPage: FC = () => {
    const defaultValues: ILogin = {
        email: '',
        password: '',
    };

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

    const methods = useForm<ILogin>({
        resolver: zodResolver(loginSchema),
        defaultValues,
    });

    const onSubmitHandler: SubmitHandler<ILogin> = (values: ILogin) => {
        console.log(values);
    };

    // @ts-ignore
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
                    <FormProvider {...methods}>
                        <Grid
                            container
                            sx={{
                                boxShadow: { sm: '0 0 5px #ddd' },
                                py: '6rem',
                                px: '1rem',
                            }}
                        >
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
                                            {t("login.LogIntoYourAccount")}
                                        </Typography>

                                        <FormInput
                                            label='Email'
                                            type='email'
                                            name='email'
                                            focused
                                            required
                                        />
                                        <FormInput
                                            type='Password'
                                            label={t('login.password')}
                                            name='password'
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
                                            {t('login.login')}
                                        </LoadingButton>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Box
                                        display='flex'
                                        flexDirection='column'
                                        sx={{ paddingLeft: { sm: '3rem' }, rowGap: '1rem' }}
                                    >
                                        <LogoSvg className="responsive"/>
                                    </Box>
                                </Grid>
                            </Grid>
                            <Grid container justifyContent='center'>
                                <Stack sx={{ mt: '3rem', textAlign: 'center' }}>
                                    <Typography sx={{ fontSize: '0.9rem', mb: '1rem' }}>
                                        {t('login.needAnAccount')}
                                        <LinkItem to='/signup'>{t('login.signUpHere')}</LinkItem>
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.9rem' }}>
                                        <LinkItem to='/forgotPassword'>{t('login.forgotPassword')}</LinkItem>
                                    </Typography>
                                </Stack>
                            </Grid>
                        </Grid>
                    </FormProvider>
                </Grid>
            </Grid>
        </Container>
    );
};

export default LoginPage;