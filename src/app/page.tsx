"use client";

import {
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Layout from "@/components/Layout";

export default function Dashboard() {
  return (
    <Layout>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardHeader title="Net Worth" />
              <CardContent>
                <Typography variant="h4" color="primary">
                  $0.00
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardHeader title="Monthly Spend" />
              <CardContent>
                <Typography variant="h4" color="secondary">
                  $0.00
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardHeader title="Top Category" />
              <CardContent>
                <Typography variant="h6">No data yet</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardHeader title="Budget Progress" />
              <CardContent>
                <Typography variant="h6">No budgets set</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardHeader title="Spend by Category" />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  No transaction data available yet. Import some CSV files to
                  see your spending breakdown.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardHeader title="Monthly Trends" />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  No transaction data available yet. Import some CSV files to
                  see your monthly spending trends.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
}
