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
    TableRow
} from '@mui/material';
import  "../styles/navbar.css"
import { styled } from '@mui/system';
import TablePagination, {
    tablePaginationClasses as classes,
} from '@mui/base/TablePagination';
import {useEffect} from "react";
import {PUBLIC_URL} from "../api/api-commons";
import axios from "axios";
import '../styles/table.css'

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
    { id: "title", label: "Title", minWidth: 50, align: "right" },
    { id: "description", label: "Description", minWidth: 170, align: "right" },
    { id: "image", label: "Image", minWidth: 170, align: "right" },
    { id: "id", label: "Link", minWidth: 50, align: "right" }

]

const TableComponent: React.FC<props> = (props) => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
    };

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
                                        {column.label}
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
                                            <TableCell component="th" scope="row" align="inherit" size="small">
                                                { data.title }
                                            </TableCell>
                                            <TableCell component="th" scope="row" align="inherit" size="small">
                                                { data.description.slice(0, 30) + '...' }
                                            </TableCell>
                                            <TableCell component="th" scope="row" align="inherit" size="small">
                                                <img src={ data.main_image_url } />
                                            </TableCell>
                                            <TableCell component="th" scope="row" align="inherit" size="small">
                                                <Button variant="contained">Contained</Button>
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