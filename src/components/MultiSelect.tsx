import React, { useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select, Chip } from '@mui/material';
import {string} from "zod";

interface CategoryData {
    id: number;
    name: string;
    active: boolean;
    created_at: string;
    updated_at: string;
}

interface MultiSelectProps {
    label: string;
    categories: CategoryData[];
    value: CategoryData[];
    onChange: (selectedValues: CategoryData[]) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ label, categories, value,onChange }) => {

    const handleSelectionChange = (event: React.ChangeEvent<{ value: CategoryData[] }>) => {
        const selectedValues = event.target.value as CategoryData[];
        console.log(selectedValues)
        onChange(selectedValues);
    };

    return (
        <FormControl fullWidth>
            <InputLabel>{label}</InputLabel>
            <Select
                multiple
                value={value}
                onChange={handleSelectionChange}
                renderValue={(selected) => (
                    <div>
                        {(selected as CategoryData[]).map((value) => (
                            <Chip key={value.id} label={value.name } />
                        ))}
                    </div>
                )}
            >
                {categories.map((category) => (
                    <MenuItem key={category.id} value={category}>
                        {category.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default MultiSelect