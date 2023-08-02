import React, {useLayoutEffect, useState} from 'react';
import Dropzone from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import '../styles/bargainForm.css'
import {Box, Button, Container, Grid, Stack, Typography} from "@mui/material";
import {object, string, TypeOf} from "zod";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import {FormProvider, useForm} from "react-hook-form";
import FormInput from "./FormInput";
import LoadingButton from "@mui/lab/LoadingButton";
import {ReactComponent as LogoSvg} from "../assets/CebulaSpark.svg";
import {LinkItem} from "../pages/LoginPage";
import {zodResolver} from "@hookform/resolvers/zod";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {toast} from "react-toastify";
import {PUBLIC_URL} from "../api/api-commons";
import {checkTokenValidity} from "../api/user";
import MultiSelect from "./MultiSelect";

interface CategoryData {
    id: number;
    name: string;
    active: boolean;
    created_at: string;
    updated_at: string;
}

interface Bargain {
    title: string,
    description: string,
    link: string;
}

interface ImageUpdateFormProps {
    onSubmit: (image: File) => void;
}

const bargainSchema = object({
    title: string().min(4, 'Title is too short').max(70, 'Too many characters'),
    description: string().min(4, 'Description is to short').max(500, 'To many characters'),
    link: string().url('Provide valid link')
});

type isBargain = TypeOf<typeof bargainSchema>;

const defaultValues: isBargain = {
    title: '',
    description: '',
    link: ''
};

const BargainCreateForm: React.FC<ImageUpdateFormProps> = ({ onSubmit }) => {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [date, setDate] = React.useState<Dayjs | null>(dayjs());
    const [isLogged, setIsLogged] = useState(false);
    const [categories, setCategories] = useState([])
    const [selectedCategories, setSelectedCategories] = useState<CategoryData[]>([])

    const {t} = useTranslation();
    const navigate = useNavigate();

    const handleSelectionChange = async (selectedValues: CategoryData[]) => {
        console.log(selectedValues)
        await setSelectedCategories(selectedValues)
    };

    useLayoutEffect( () => {
        const checkToken = async () => {
            const result = await checkTokenValidity();
            setIsLogged(result)
        }
        checkToken().then()
        fetchCategories().then()
    }, [isLogged]);

    const handleDrop = (acceptedFiles: File[]) => {
        setSelectedImage(acceptedFiles[0]);
    };

    const fetchCategories = async () => {
        axios.get(PUBLIC_URL + `${process.env.REACT_APP_CATEGORIES_URL}`, {
            headers: {
                'content-type': 'application/json',
                Accept: 'application/json'
            }
        })
            .then( response => {
                setCategories(response.data)
            })
    }

    const methods = useForm<isBargain>({
        resolver: zodResolver(bargainSchema),
        defaultValues,
    });

    const onSubmitHandler = (bargain: Bargain) => {
        const formData = new FormData();

        if (selectedImage) {
            formData.append('image', selectedImage);
        }

        if (!selectedCategories) {
            toast.info('You have to choose atleast one category')
            return
        }

        selectedCategories.forEach((category, index) => {
            formData.append(`category[${index}][id]`, category.id.toString());
            formData.append(`category[${index}][name]`, category.name);
            formData.append(`category[${index}][active]`, category.active.toString());
            formData.append(`category[${index}][created_at]`, category.created_at);
            formData.append(`category[${index}][updated_at]`, category.updated_at);
        });

        formData.append('bargain[description]', bargain.description.toString())
        formData.append('bargain[link]', bargain.link.toString())
        formData.append('bargain[title]', bargain.title.toString())
        formData.append('bargain[ends_at', date)

        console.log(formData)

        axios.post(PUBLIC_URL + `${process.env.REACT_APP_BARGAIN_CREATE}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': localStorage.getItem('token'),
                Accept: 'application/json'
            },
        })
            .then((response) => {
                toast.success('Bargain has been created')
            })
            .catch((error) => {
                toast.error('Could not create a bargain');
            });
    }

    return (
        <div>
                <Grid
                    container
                    justifyContent='center'
                    alignItems='center'
                    sx={{ width: '100%', height: '100%' }}
                >
                            <FormProvider {...methods}>
                                        <Box
                                            display='flex'
                                            flexDirection='column'
                                            justifyContent='center'
                                            component='form'
                                            onSubmit={methods.handleSubmit(onSubmitHandler)}
                                        >
                                            <Typography
                                                variant='h6'
                                                component='h1'
                                                sx={{ textAlign: 'center', mb: '1.5rem' }}
                                            >
                                                Fill up the form
                                            </Typography>

                                            <FormInput
                                                label='Title'
                                                name='title'
                                                focused
                                                required
                                            />
                                            <FormInput
                                                label='Link'
                                                name='link'
                                                required
                                                focused
                                            />
                                            <FormInput
                                                label='Description'
                                                name='description'
                                                required
                                                focused
                                                fullWidth
                                                multiline
                                                sx={{ mb: 2 }}
                                            />
                                            <MultiSelect label="Categories" categories={categories} value={selectedCategories} onChange={handleSelectionChange}/>
                                            <div className="date-picker" >
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DatePicker
                                                        label="Ending date"
                                                        value={date}
                                                        onChange={(newDate) => setDate(newDate)}
                                                        views={['year', 'month', 'day']}
                                                        minDate={dayjs()}
                                                    />
                                                </LocalizationProvider>
                                            </div>
                                            <Dropzone onDrop={handleDrop} accept="image/*" multiple={false}>
                                                {({ getRootProps, getInputProps }) => (
                                                    <div className="dropzone" {...getRootProps()}>
                                                        <FontAwesomeIcon icon={faImage} className="dropzone-icon" />
                                                        {selectedImage ? (
                                                            <img src={URL.createObjectURL(selectedImage)} alt="Selected" />
                                                        ) : (
                                                            <p>Click or drag 'n' drop an image here</p>
                                                        )}
                                                        <input {...getInputProps()} />
                                                    </div>
                                                )}
                                            </Dropzone>
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
    );
};

export default BargainCreateForm;
