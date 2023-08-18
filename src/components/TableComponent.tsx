import * as React from 'react';
import {
    Button, Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableProps,
    TableRow, Typography
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import  "../styles/navbar.css"
import { styled } from '@mui/system';
import TablePagination, {
    tablePaginationClasses as classes,
} from '@mui/base/TablePagination';
import {ChangeEvent, useEffect} from "react";
import {PUBLIC_URL} from "../api/api-commons";
import axios from "axios";
import '../styles/table.css'
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

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
}

interface props {
    data: response[]
}

const columns = [
    { id: "title", label: "Title", minWidth: "10%", align: "left" },
    { id: "description", label: "Description", minWidth: "30%", align: "left", whiteSpace: "wrap" },
    { id: "image", label: "Image", minWidth: "50%", align: "left" },
    { id: "id", label: "Link", minWidth: "10%", align: "left" }

]

const useStyles = makeStyles(() => ({
    responsiveImage: {
        maxWidth: '100%',
        height: 'auto',
    },
}));

const TableComponent: React.FC<props> = (props) => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const classes = useStyles();
    // @ts-ignore
    const {t} = useTranslation();
    const navigate = useNavigate();

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
    };

    const handleClick = (bargain_id: number) => {
        axios.get(PUBLIC_URL + `${process.env.REACT_APP_BARGAIN_URL}`, {
            headers: {
                'content-type': 'application/json',
                accept: 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            params: {
                id: bargain_id
            }
        })
            .then( response => {
                navigate('/bargain', { state: { bargain: response.data } });
            })
            .catch(err => {
                toast.error("Something went wrong")
            })
    }

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        console.log(rowsPerPage)
        setPage(0);
    };

    return (
        <div>
            <Paper className={classes.root}>
                <TableContainer className={classes.container}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map(column => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        <Typography variant="h6" gutterBottom>
                                            {column.label}
                                        </Typography>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {props.data
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map(data => {
                                    return (
                                        <TableRow key={data.id}>
                                            <TableCell component="th" scope="row" align="inherit" size="small" style={{ minWidth: columns[0].minWidth }}>
                                                { data.title }
                                            </TableCell>
                                            <TableCell component="th" scope="row" align="inherit" size="small" style={{ minWidth: columns[1].minWidth }}>
                                                { data.description.slice(0, 60) + '...' }
                                            </TableCell>
                                            <TableCell component="th" scope="row" align="inherit" size="small" style={{ minWidth: columns[2].minWidth, height: "auto" }}>
                                                <img src={ data.main_image_url } className={classes.responsiveImage} />
                                            </TableCell>
                                            <TableCell component="th" scope="row" align="inherit" size="small" style={{ minWidth: columns[3].minWidth }}>
                                                <Button variant="contained" onClick={() => handleClick(data.id)}>Check</Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            <Grid>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 15, 20, 25, 50, 100]}
                    count={props.data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Grid>
        </div>
    );
}
export default TableComponent