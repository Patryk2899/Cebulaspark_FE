import {FC, useEffect, useLayoutEffect, useState} from "react";
import * as React from "react";
import Navbar from "../components/Navbar";
import {checkTokenValidity} from "../api/user";
import CommentBox from "../components/CommentBox";
import {Box, Button, Divider, Grid, Typography} from "@mui/material";
import {useLocation, useNavigate} from "react-router-dom";
import "../styles/bargain.css"
import axios from "axios";
import {PUBLIC_URL} from "../api/api-commons";
import {makeStyles} from "@mui/styles";
interface User {
    id: number
    email: string
}

interface Comment {
    id: number;
    body: string;
    author: string;
    associated_user: User;
    bargain_id: number;
}

interface Bargain {
    id: number;
    ends_at: string;
    title: string;
    description: string;
    link: string;
    main_image_url: string;
}

interface BargainProps {
    bargain: Bargain
    user: User
}

const useStyles = makeStyles(() => ({
    responsiveImage: {
        maxWidth: '100%',
        height: 'auto',
    },
}));

const BargainPage: FC<BargainProps> = (props) => {

    const [isLogged, setIsLogged] = useState(false);
    const [comments, setComments] = useState<Comment[]>([])

    const location = useLocation();
    const classes = useStyles();

    const fetchComments = async () => {
        axios.get(PUBLIC_URL + `${process.env.REACT_APP_COMMENTS_URL}` + '/' + location.state.bargain.id, {
            headers: {
                'content-type': 'application/json',
                accept: 'application/json',
            }
        })
            .then( response => {
                setComments(response.data)
            })
    }

    useEffect(() => {
        fetchComments().then()
    }, [])

    useLayoutEffect( () => {
        console.log(location)
        const checkToken = async () => {
            const result = await checkTokenValidity();
            setIsLogged(result)
        }
        checkToken().then()
    }, [isLogged]);

    return (
        <div>
            <Navbar isLoggedIn={isLogged}/>
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="80hv" border="1px solid #ccc" borderRadius="10px" padding="20px" margin="0 20px 20px">
                <Typography variant="h4" gutterBottom>
                    {location.state.bargain.title}
                </Typography>
                <Divider orientation="vertical">
                <Grid container spacing={4}>
                    <Grid item xs={8} md={6}>
                        <div className="image">
                            <img src={location.state.bargain.main_image_url} alt="Image Description" className={classes.responsiveImage} />
                        </div>
                    </Grid>
                    <Grid item xs={8} md={6}>
                        <Typography variant="h4" gutterBottom>
                            Description
                        </Typography>
                        <div className="text">
                            <p>{location.state.bargain.description}</p>
                        </div>
                        <Button variant="contained" href={location.state.bargain.link}> Go to ocassion </Button>
                    </Grid>
                </Grid>
                </Divider>
            </Box>
            <CommentBox comments={comments} bargain_id={location.state.bargain.id}/>
        </div>
    )
}
export default BargainPage;
