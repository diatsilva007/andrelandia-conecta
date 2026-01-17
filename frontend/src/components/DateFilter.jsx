import React from "react";
import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

export default function DateFilter({
  value,
  onChange,
  options = ["Dia", "Semana", "Mês", "Personalizado"],
}) {
  return (
    <Box mb={2}>
      <FormControl fullWidth variant="outlined" size="small">
        <InputLabel id="date-filter-label">Período</InputLabel>
        <Select
          labelId="date-filter-label"
          value={value}
          label="Período"
          onChange={onChange}
        >
          {options.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
