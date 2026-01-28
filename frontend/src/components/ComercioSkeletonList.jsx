import { Skeleton, Box, Grid } from "@mui/material";

export default function ComercioSkeletonList({ count = 4 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <Grid item xs={12} key={idx}>
          <Box
            sx={{
              borderRadius: { xs: 2, sm: 3, md: 4 },
              boxShadow: 6,
              bgcolor: "#fff",
              minHeight: { xs: 240, sm: 260, md: 280 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              p: { xs: 1.5, sm: 2 },
              mb: 2,
            }}
          >
            <Skeleton
              variant="rectangular"
              height={40}
              width="40%"
              sx={{ mb: 2, borderRadius: 2 }}
            />
            <Skeleton
              variant="circular"
              width={44}
              height={44}
              sx={{ mb: 1 }}
            />
            <Skeleton variant="text" width="60%" height={28} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="80%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="40%" height={20} sx={{ mb: 1 }} />
            <Skeleton
              variant="rectangular"
              height={32}
              width="100%"
              sx={{ mt: 2, borderRadius: 2 }}
            />
          </Box>
        </Grid>
      ))}
    </>
  );
}
