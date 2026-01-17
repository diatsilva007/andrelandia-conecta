import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

export default function AnalyticCard({
  title,
  value,
  color = "primary",
  icon,
}) {
  return (
    <Card sx={{ boxShadow: 2, borderRadius: 3, bgcolor: `${color}.light` }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
          {icon && <Box fontSize={32}>{icon}</Box>}
          <Box>
            <Typography
              variant="h6"
              color={`${color}.main`}
              fontWeight={600}
              align="center"
            >
              {title}
            </Typography>
            <Typography
              variant="h4"
              fontWeight={800}
              color={`${color}.main`}
              align="center"
            >
              {value}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
