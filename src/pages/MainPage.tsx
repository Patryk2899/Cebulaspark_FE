import {FC, useEffect, useLayoutEffect, useState} from "react";
import Navbar from "../components/Navbar";
import {checkTokenValidity} from "../api/user";
import * as React from "react";
import axios from "axios";
import {PUBLIC_URL} from "../api/api-commons";
import {FormControl, Grid, InputLabel, MenuItem, Select} from "@mui/material";
import '../styles/main.css'

interface CategoryData {
    id: number;
    name: string;
    active: boolean;
    created_at: string;
    updated_at: string;
}

const MainPage: FC = () => {

    const [isLogged, setIsLogged] = useState(false);
    const [categories, setCategories] = useState([])
    const [category, setCategory] = useState<CategoryData>()

    const handleChange = (event: React.ChangeEvent<CategoryData>) => {
        setCategory(event.target.value as CategoryData);
    };

    const fetchCategories = async () => {
        axios.get(PUBLIC_URL + `${process.env.REACT_APP_CATEGORIES_URL}`, {
            headers: {
                'content-type': 'application/json',
                accept: 'application/json',
            },
        })
            .then( response => {
                setCategories(response.data)
            })
    }

    useEffect(() => {
    }, [])

    useLayoutEffect( () => {
        const checkToken = async () => {
            const result = await checkTokenValidity();
            setIsLogged(result)
        }
        checkToken().then()
        fetchCategories().then()
    }, [isLogged]);

    useLayoutEffect( () => {
        const checkToken = async () => {
            const result = await checkTokenValidity();
            setIsLogged(result)
        }
        checkToken().then()
    }, [isLogged]);

    return (
        <div>
            <div>
                <Navbar isLoggedIn={isLogged}/>
            </div>
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
            >
                <Grid>
                    <FormControl margin='normal' fullWidth>
                        <InputLabel id="demo-simple-select-label">Category</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={category}
                            style={{ width: '150px' }}
                            onChange={handleChange}
                        >
                            {categories.map(item => {
                                return <MenuItem value={item}>{item.name}</MenuItem>;
                            })}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        </div>
    )
}
export default MainPage;

function componentDidMount() {
    throw new Error("Function not implemented.");
}
