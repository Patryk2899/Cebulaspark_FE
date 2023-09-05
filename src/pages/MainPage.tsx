import {FC, useEffect, useLayoutEffect, useState} from "react";
import Navbar from "../components/Navbar";
import {checkTokenValidity} from "../api/user";
import * as React from "react";
import axios from "axios";
import {PUBLIC_URL} from "../api/api-commons";
import {FormControl, Grid, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import '../styles/main.css'
import TableComponent from "../components/TableComponent";
import IconButton from "@mui/material/IconButton";
import SearchIcon from '@mui/icons-material/Search';

interface CategoryData {
    id: number;
    name: string;
    active: boolean;
    created_at: string;
    updated_at: string;
}


interface response {
    id: number;
    ends_at: string;
    title: string;
    description: string;
    link: string;
    main_image_url: string;
    created_at: string;
}

const MainPage: FC = () => {

    const formControlStyle = {
        width: '100%',
        margin: '10px',
    };

    const [data, setData] = React.useState<response[]>([]);
    const [isLogged, setIsLogged] = useState(false);
    const [categories, setCategories] = useState([])
    const [category, setCategory] = useState<CategoryData>(null)
    const [searchQuery, setSearchQuery] = useState('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleChange = async (event: React.ChangeEvent<CategoryData>) => {
        updateCategory(event.target.value as CategoryData).then();
        fetchData(event.target.value).then();
    };

    const updateCategory = async (value: CategoryData) => {
        setCategory(value as CategoryData);
    }

    const sortByTitle = () => {
        if(data) {
            setData(data.slice().sort((a, b) => a.title.localeCompare(b.title)))
            console.log("HERERRERE")
            return
        }
    }
    const sortByNewest = () => {
        setData(data.slice().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()))
    }

    const sortByOldest = () => {
        setData(data.slice().sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()))
    }

    const fetchData = async (p: any) => {
        axios.get(PUBLIC_URL + `${process.env.REACT_APP_BARGAIN_SHOW_URL}`, {
            headers: {
                'content-type': 'application/json',
                accept: 'application/json',
            },
            params: {
                category: p
            }
        }).then(response => {
            setData(response.data)
            console.log(response.data)
        })
    }

    useEffect(() => {
        fetchData(null).then()
        console.log(data)
    }, [])

    const fetchCategories = async () => {
        axios.get(PUBLIC_URL + `${process.env.REACT_APP_CATEGORIES_URL}`, {
            headers: {
                'content-type': 'application/json',
                accept: 'application/json',
            },
            params: {
                category: category
            }
        })
            .then( response => {
                setCategories(response.data)
            })
    }

    const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = searchQuery == '' ? null : searchQuery
        axios.get(PUBLIC_URL + `${process.env.REACT_APP_BARGAIN_SHOW_URL}`, {
            headers: {
                'content-type': 'application/json',
                accept: 'application/json',
            },
            params: {
                category: category,
                query: query
            }
        }).then(response => {
            setData(response.data)
            console.log(response.data)
        })
    }

    useLayoutEffect( () => {
        const checkToken = async () => {
            const result = await checkTokenValidity();
            setIsLogged(result)
        }
        checkToken().then()
        fetchCategories().then()
    }, [isLogged]);

    return (
        <div>
            <div>
                <Navbar
                    isLoggedIn={isLogged}
                    showSorting={true}
                    sortByNewest={sortByNewest}
                    sortByOldest={sortByOldest}
                    sortByTitle={sortByTitle}
                />
            </div>
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
            >
                <Grid marginTop="20px">
                    <FormControl style={formControlStyle}>
                        <Grid container spacing={2} marginRight="10px">
                            <Grid marginRight="10px">
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
                            </Grid>
                            <Grid marginRight="10px">
                                <TextField
                                    variant="outlined"
                                    value={searchQuery}
                                    onChange={handleInputChange}
                                    fullWidth="100%"
                                />
                            </Grid>
                            <Grid>
                                <IconButton onClick={handleSearch} aria-label="Search">
                                    <SearchIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </FormControl>
                </Grid>
            </Grid>
            <TableComponent data={data}/>
        </div>
    )
}
export default MainPage;
