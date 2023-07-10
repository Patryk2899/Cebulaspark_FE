import {FC} from "react";
import {object, string, TypeOf} from "zod";
import {FormProvider, SubmitHandler, useForm} from "react-hook-form";
import axios from "axios";
import {PUBLIC_URL} from "../api/api-commons";
import {toast} from "react-toastify";
import {useNavigate, useSearchParams} from "react-router-dom";
import {Box, Grid, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import {zodResolver} from "@hookform/resolvers/zod";
import FormInput from "../components/FormInput";
import LoadingButton from "@mui/lab/LoadingButton";

const passwordSchema = object({
    password: string()
        .min(1, 'Password is required')
        .min(8, 'Password must be more than 8 characters')
        .max(32, 'Password must be less than 32 characters'),
    passwordConfirm: string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: 'Passwords do not match',
});

type schema = TypeOf<typeof passwordSchema>;


const ForgotPasswordPage: FC = () => {

    // @ts-ignore
    const {t} = useTranslation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const defaultValues: schema = {
        password: '',
        passwordConfirm: '',
    };

    const methods = useForm<schema>({
        resolver: zodResolver(passwordSchema),
        defaultValues,
    });

    const onSubmitHandler: SubmitHandler<schema> = (values: schema) => {
        console.log(searchParams.get("reset_token"))
        axios.put(PUBLIC_URL + `${process.env.REACT_APP_NEW_PASSWORD}`, { reset_password_token: searchParams.get("reset_token"),
                                                                                    password: values.password,
                                                                                    password_confirmation: values.passwordConfirm },
        {
            headers:
                { "Content-Type": 'application/json',
                  Accept: "*/*" }
        })
            .then(response => {
                toast.success(t('password.success'))
                navigate('/')
            })
            .catch(err => {
                toast.error(t('password.linkExpired'))
                navigate('/')
            })
    };

    return (
        <div>
            <Box
                display='flex'
                flexDirection='column'
                width='100%'
                justifyContent='center'
                alignItems='center'
                component='form'
                noValidate
                autoComplete='off'
                sx={{ paddingRight: { sm: '3rem' } }}
                onSubmit={methods.handleSubmit(onSubmitHandler)}
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
                        {t('password.newPassword')}
                    </Typography>
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
                            marginInline: 'auto',
                        }}
                    >
                        {t('password.confirmButton')}
                    </LoadingButton>
                </FormProvider>
            </Box>
        </div>
    );
};

export default ForgotPasswordPage