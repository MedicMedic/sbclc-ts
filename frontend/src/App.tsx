import { BrowserRouter as Router, Routes, Route, Navigate, RouterProvider } from "react-router-dom";
import { LogisticsLayout } from "@/polymet/layouts/logistics-layout";
import LoginPage from "@/polymet/pages/login";
import { DashboardPage } from "@/polymet/pages/dashboard";
import { ApprovalsPage } from "./polymet/pages/approvals";
import { ImportBookingPage } from "@/polymet/pages/import-booking";
import { DomesticBookingPage } from "@/polymet/pages/domestic-booking";
import { QuotationsPage } from "@/polymet/pages/quotations";
import { MonitoringPage } from "@/polymet/pages/monitoring";
import { CashAdvancePage } from "@/polymet/pages/cash-advance";
import { ReportsPage } from "@/polymet/pages/reports";
import { AdminUsersPage } from "@/polymet/pages/admin-users";
import  MasterSetupPage from "@/polymet/pages/master-setup";
import { BillingPage } from "@/polymet/pages/billing";
import { CollectionMonitoringPage } from "@/polymet/pages/collection-monitoring";
import { RequireAuth } from "@/components/RequireAuth"; // ✅ import
import { ProfilePage } from "@/polymet/pages/profile";
import { RFPEntryPage } from "@/polymet/pages/rfp-entry";
import { RFPSummaryPage } from "@/polymet/pages/rfp-summary";

export default function SBCLCLogisticsApp() {
  return (
    <Router>
      <Routes>
        {/* Authentication */}
        <Route path="/login" element={<LoginPage />} />

        {/* Redirect root "/" → "/login" */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Main Dashboard (protected) */}
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <LogisticsLayout>
                <DashboardPage />
              </LogisticsLayout>
            </RequireAuth>
          }
        />

        {/* Import Operations */}
        <Route
          path="/import/booking"
          element={
            <RequireAuth>
              <LogisticsLayout>
                <ImportBookingPage />
              </LogisticsLayout>
            </RequireAuth>
          }
        />

        <Route
          path="/import/booking/:id"
          element={
            <RequireAuth>
              <LogisticsLayout>
                <ImportBookingPage />
              </LogisticsLayout>
            </RequireAuth>
          }
        />

        {/* Domestic Operations */}
        <Route
          path="/domestic/booking"
          element={
            <RequireAuth>
              <LogisticsLayout>
                <DomesticBookingPage />
              </LogisticsLayout>
            </RequireAuth>
          }
        />

        <Route
          path="/domestic/booking/:id"
          element={
            <RequireAuth>
              <LogisticsLayout>
                <DomesticBookingPage />
              </LogisticsLayout>
            </RequireAuth>
          }
        />

        {/* Quotations */}
        <Route
          path="/quotations"
          element={
            <RequireAuth>
              <LogisticsLayout>
                <QuotationsPage />
              </LogisticsLayout>
            </RequireAuth>
          }
        />

        <Route
          path="/quotations/:id"
          element={
            <RequireAuth>
              <LogisticsLayout>
                <QuotationsPage />
              </LogisticsLayout>
            </RequireAuth>
          }
        />

        {/* Monitoring */}
        <Route
          path="/monitoring"
          element={
            <RequireAuth>
              <LogisticsLayout>
                <MonitoringPage />
              </LogisticsLayout>
            </RequireAuth>
          }
        />

        {/* Cash Advance */}
        <Route
          path="/cash-advance"
          element={
            <RequireAuth>
              <LogisticsLayout>
                <CashAdvancePage />
              </LogisticsLayout>
            </RequireAuth>
          }
        />

        {/* RFP (Request for Payment) */}
        <Route
          path="/rfp/entry"
          element={
            <LogisticsLayout>
              <RFPEntryPage />
            </LogisticsLayout>
          }
        />

        <Route
          path="/rfp/summary"
          element={
            <LogisticsLayout>
              <RFPSummaryPage />
            </LogisticsLayout>
          }
        />

        {/* Reports */}
        <Route
          path="/reports"
          element={
            <RequireAuth>
              <LogisticsLayout>
                <ReportsPage />
              </LogisticsLayout>
            </RequireAuth>
          }
        />

        {/* Billing */}
        <Route
          path="/billing"
          element={
            <RequireAuth>
              <LogisticsLayout>
                <BillingPage />
              </LogisticsLayout>
            </RequireAuth>
          }
        />

        <Route
          path="/collection-monitoring"
          element={
            <RequireAuth>
              <LogisticsLayout>
                <CollectionMonitoringPage />
              </LogisticsLayout>
            </RequireAuth>
          }
        />

        {/* Administration */}
        <Route
          path="/admin/users"
          element={
            <RequireAuth>
              <LogisticsLayout>
                <AdminUsersPage />
              </LogisticsLayout>
            </RequireAuth>
          }
        />

        <Route
          path="/admin/master-setup"
          element={
            <RequireAuth>
              <LogisticsLayout>
                <MasterSetupPage />
              </LogisticsLayout>
            </RequireAuth>
          }
        />

        <Route
          path="/profile"
          element={
            <LogisticsLayout>
              <ProfilePage />
            </LogisticsLayout>
          }
        />

        <Route
          path="/approvals"
          element={
            <LogisticsLayout>
              <ApprovalsPage />
            </LogisticsLayout>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
