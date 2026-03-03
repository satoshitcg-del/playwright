# IShef Test Plan

## 1. Overview

### 1.1 Project Information
| Property | Value |
|----------|-------|
| **System Under Test (SUT)** | IShef Accounting/Finance System |
| **Environment** | bo-dev.askmebill.com |
| **Test Framework** | Playwright |
| **Test Type** | E2E, UI, API |
| **Last Updated** | 2026-03-04 |

### 1.2 Test Objectives
- Verify core business workflows function correctly
- Ensure product configuration works for all 10 product types
- Validate authentication and authorization mechanisms
- Confirm billing workflow transitions are accurate
- Detect regression issues early in development cycle

---

## 2. Test Strategy

### 2.1 Test Levels

```
┌─────────────────────────────────────────────────────────────┐
│                     TEST PYRAMID                            │
├─────────────────────────────────────────────────────────────┤
│  ▲ E2E Tests (20%)     - Critical user journeys            │
│  │    └── Full workflow: Login → Product Config → Billing  │
│  ├────────────────────────────────────────────────────────  │
│  │ Integration Tests (30%) - API & component interactions  │
│  │    └── Auth state, Product CRUD, Status transitions     │
│  ├────────────────────────────────────────────────────────  │
│  ▼ Unit/Component Tests (50%) - Page objects, utilities    │
│       └── Form validation, Helper functions                │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Test Types

| Type | Focus | Tools | Coverage Target |
|------|-------|-------|-----------------|
| **UI Tests** | Visual elements, interactions | Playwright | 90% |
| **API Tests** | Backend integration | Playwright + API helpers | 80% |
| **E2E Tests** | Full user journeys | Playwright | 100% critical paths |
| **Accessibility** | WCAG compliance | Axe-core | Level AA |
| **Performance** | Page load times | Playwright + Lighthouse | <3s load |

### 2.3 Test Environments

| Environment | URL | Purpose | Data |
|-------------|-----|---------|------|
| Development | bo-dev.askmebill.com | Daily testing | Mock data |
| Staging | bo-staging.askmebill.com | Pre-release | Production-like |
| Production | bo.askmebill.com | Smoke tests | Live data |

---

## 3. Test Coverage Matrix

### 3.1 Current Coverage Status

| Module | Test File | Status | Priority | Coverage |
|--------|-----------|--------|----------|----------|
| **Authentication** | auth/login.spec.ts | ✅ Implemented | P0 | 70% |
| **Customer Detail** | customer/customer-detail.spec.ts | ✅ Implemented | P0 | 60% |
| **Customer List** | - | ⚠️ Missing | P1 | 0% |
| **Product List** | - | ⚠️ Missing | P1 | 0% |
| **Product Config** | - | ⚠️ Partial | P0 | 30% |
| **Billing Workflow** | - | ⚠️ Missing | P0 | 0% |
| **WL Status** | - | ⚠️ Missing | P1 | 0% |

### 3.2 Detailed Test Cases

#### 3.2.1 Authentication Module

| ID | Test Case | Steps | Expected Result | Priority | Status |
|----|-----------|-------|-----------------|----------|--------|
| AUTH-001 | Login with valid credentials | 1. Navigate to login<br>2. Enter valid username/password<br>3. Click login | Redirect to 2FA or dashboard | P0 | ✅ |
| AUTH-002 | Login with invalid credentials | 1. Enter invalid credentials<br>2. Click login | Error message displayed | P0 | ✅ |
| AUTH-003 | Complete 2FA flow | 1. Login with valid creds<br>2. Enter 2FA code<br>3. Submit | Redirect to dashboard | P0 | ✅ |
| AUTH-004 | Session persistence | 1. Login<br>2. Navigate to customer page<br>3. Verify no redirect | Stay on customer page | P0 | ✅ |
| AUTH-005 | Logout functionality | 1. Click logout<br>2. Verify redirect | Redirect to login page | P1 | ⚠️ Missing |
| AUTH-006 | Session timeout | 1. Login<br>2. Wait for timeout<br>3. Try action | Redirect to login | P2 | ⚠️ Missing |

#### 3.2.2 Customer Management

| ID | Test Case | Steps | Expected Result | Priority | Status |
|----|-----------|-------|-----------------|----------|--------|
| CUST-001 | View customer list | 1. Navigate to /customer<br>2. Verify table loads | Customer list displayed | P0 | ⚠️ Missing |
| CUST-002 | Search customer | 1. Enter search term<br>2. Click search | Filtered results | P1 | ⚠️ Missing |
| CUST-003 | Create new customer | 1. Click "Add Customer"<br>2. Fill form<br>3. Save | Customer created | P0 | ⚠️ Missing |
| CUST-004 | Edit customer details | 1. Select customer<br>2. Edit info<br>3. Save | Changes saved | P1 | ⚠️ Missing |
| CUST-005 | View customer detail | 1. Click customer name | Detail page opens | P0 | ✅ |
| CUST-006 | Customer pagination | 1. Navigate pages | Correct page displayed | P2 | ⚠️ Missing |

#### 3.2.3 Product Configuration

| ID | Test Case | Steps | Expected Result | Priority | Status |
|----|-----------|-------|-----------------|----------|--------|
| PROD-001 | Configure Thai Lotto | 1. Open Thai Lotto<br>2. Set clientName=superadmin<br>3. Save | Config saved | P0 | ✅ |
| PROD-002 | Configure Super API | 1. Open Super API<br>2. Set clientName<br>3. Save | Config saved | P0 | ✅ |
| PROD-003 | Configure Tiamut PGSOFT | 1. Open Tiamut<br>2. Sync product<br>3. Save | Sync successful | P0 | ✅ |
| PROD-004 | Configure Tiamut (ในเครือ) | 1. Open product<br>2. Set prefix<br>3. Sync<br>4. Save | Config saved | P0 | ⚠️ Missing |
| PROD-005 | Configure Tiamut (นอกเครือ) | 1. Open product<br>2. Set prefix<br>3. Sync<br>4. Save | Config saved | P0 | ⚠️ Missing |
| PROD-006 | Configure SportbookV.2 | 1. Open Sportbook<br>2. Set clientName<br>3. Save | Config saved | P0 | ⚠️ Missing |
| PROD-007 | Configure Auto (ในเครือ) | 1. Open auto product<br>2. Set prefix<br>3. Save | Config saved | P0 | ⚠️ Missing |
| PROD-008 | Configure Auto (นอกเครือ) | 1. Open auto product<br>2. Set prefix<br>3. Save | Config saved | P0 | ⚠️ Missing |
| PROD-009 | Add new product | 1. Click "Add Product"<br>2. Select product<br>3. Confirm | Product added | P1 | ⚠️ Missing |
| PROD-010 | Delete product | 1. Click delete<br>2. Confirm | Product removed | P1 | ⚠️ Missing |
| PROD-011 | Search products | 1. Enter search term<br>2. Click search | Filtered results | P2 | ✅ |

#### 3.2.4 Billing Workflow

| ID | Test Case | Steps | Expected Result | Priority | Status |
|----|-----------|-------|-----------------|----------|--------|
| BILL-001 | Create billing (DRAFT) | 1. Navigate to billing<br>2. Create new<br>3. Save as draft | Status = DRAFT | P0 | ⚠️ Missing |
| BILL-002 | Submit billing (PENDING) | 1. Open DRAFT billing<br>2. Submit | Status = PENDING | P0 | ⚠️ Missing |
| BILL-003 | Deliver billing | 1. Open PENDING billing<br>2. Mark delivered | Status = DELIVERED | P0 | ⚠️ Missing |
| BILL-004 | Verify payment | 1. Open DELIVERED<br>2. Verify payment | Status = VERIFYPAYMENT | P0 | ⚠️ Missing |
| BILL-005 | Mark as PAID | 1. Open VERIFYPAYMENT<br>2. Confirm payment | Status = PAID | P0 | ⚠️ Missing |
| BILL-006 | Partial payment | 1. Process partial payment | Status = PARTIALPAID | P1 | ⚠️ Missing |
| BILL-007 | Cancel billing | 1. Open any billing<br>2. Cancel | Status = CANCELLED | P1 | ⚠️ Missing |
| BILL-008 | Void billing | 1. Open PAID billing<br>2. Void | Status = VOID | P1 | ⚠️ Missing |

#### 3.2.5 WL Status

| ID | Test Case | Steps | Expected Result | Priority | Status |
|----|-----------|-------|-----------------|----------|--------|
| WL-001 | WL Pending status | 1. Create WL<br>2. Verify status | Status = PENDING | P1 | ⚠️ Missing |
| WL-002 | WL Success status | 1. Process WL<br>2. Complete | Status = SUCCESS | P1 | ⚠️ Missing |
| WL-003 | WL Failed status | 1. Process WL<br>2. Fail | Status = FAILED | P1 | ⚠️ Missing |

---

## 4. Risk Assessment

### 4.1 Risk Matrix

| Risk | Impact | Likelihood | Mitigation | Owner |
|------|--------|------------|------------|-------|
| **Test data corruption** | High | Medium | Use isolated test accounts, reset data before each run | QA Team |
| **Flaky tests due to timing** | Medium | High | Implement retry logic, use explicit waits | QA Team |
| **Authentication expiration** | High | Medium | Refresh auth token before test runs | DevOps |
| **Environment downtime** | High | Low | Set up staging environment fallback | DevOps |
| **Product configuration changes** | Medium | Medium | Maintain test data file, update selectors | QA Team |
| **Browser compatibility** | Low | Low | Test on Chromium/Firefox, skip WebKit | QA Team |
| **Rate limiting** | Medium | Medium | Add delays between API calls | QA Team |

### 4.2 Critical Risks (P0)

1. **Authentication Failure**: Tests fail due to 2FA or session issues
   - Mitigation: Use stored auth state, mock 2FA in test environment

2. **Product Configuration Errors**: Misconfigured products affect billing
   - Mitigation: Validate all configurations after setup

3. **Billing Status Corruption**: Incorrect status transitions
   - Mitigation: Comprehensive state transition testing

---

## 5. Entry & Exit Criteria

### 5.1 Entry Criteria (Before Testing)

| Criteria | Check | Status |
|----------|-------|--------|
| ✅ Test environment is up and accessible | bo-dev.askmebill.com | Verified |
| ✅ Test data is prepared | creator_master_001 has all products | Verified |
| ✅ Credentials are valid | admin_eiji login works | Verified |
| ✅ Playwright is configured | playwright.config.ts exists | Verified |
| ✅ Test cases are documented | This test plan | Complete |
| ⏳ Page objects are implemented | All page classes | In Progress |

### 5.2 Exit Criteria (Test Completion)

| Criteria | Target | Minimum |
|----------|--------|---------|
| Test Case Execution | 100% | 95% |
| Pass Rate | 100% | 95% |
| Critical Defects | 0 | 0 |
| Major Defects | 0 | ≤2 |
| Minor Defects | ≤5 | ≤10 |
| Code Coverage | 80% | 70% |

### 5.3 Suspension Criteria

Testing will be suspended if:
- Environment is down for >2 hours
- Critical authentication issues
- Database corruption
- Blocking defects in core workflows

---

## 6. Test Schedule

### 6.1 Sprint Planning

| Phase | Duration | Activities |
|-------|----------|------------|
| **Week 1** | 5 days | Complete missing test cases (Customer, Product, Billing) |
| **Week 2** | 5 days | API testing, negative test cases |
| **Week 3** | 5 days | Integration testing, bug fixes |
| **Week 4** | 5 days | Regression testing, documentation |

### 6.2 Daily Schedule

| Time | Activity |
|------|----------|
| 09:00 | Review failed tests from overnight run |
| 10:00 | Execute priority test cases |
| 14:00 | Bug verification and reporting |
| 16:00 | Test case development |
| 17:00 | Report generation |

---

## 7. Roles & Responsibilities

| Role | Name | Responsibilities |
|------|------|------------------|
| QA Lead | TBD | Test strategy, planning, reporting |
| Test Engineer | TBD | Test case development, execution |
| Automation Engineer | TBD | Framework maintenance, CI/CD |
| Developer | TBD | Bug fixes, environment support |

---

## 8. Deliverables

| Deliverable | Format | Due Date |
|-------------|--------|----------|
| Test Plan | Markdown | 2026-03-04 |
| Test Cases | TypeScript/Playwright | Weekly |
| Test Data | TypeScript fixtures | Ongoing |
| Test Report | HTML/JSON | Daily |
| Bug Reports | JIRA/GitHub Issues | As found |
| Test Summary | Markdown | End of sprint |

---

## 9. Appendix

### 9.1 Product Reference

| Product Name | Type | Configuration |
|--------------|------|---------------|
| Thai Lotto | lotto | clientName: superadmin |
| Super API | api | clientName: 1xpower, 24plus, etc. |
| DIRect_API | api | - |
| ระบบออโต้ Tiamut (PGSOFT) | tiamut | prefix: 2PP, 8BP, PG88 |
| ระบบออโต้ (นอกเครือ)Fix rate | auto | prefix: XO44 |
| ระบบออโต้ (นอกเครือ) | auto | prefix: PG54, APG, BWP, etc. |
| ระบบออโต้ (ในเครือ) | auto | prefix: SPG, KKP, NMP, etc. |
| SportbookV.2 | sportbook | clientName: 13KC, 1BNJ, etc. |
| ระบบออโต้ Tiamut (ในเครือ) | tiamut | prefix: 168NEW, 24AB, etc. |
| ระบบออโต้ Tiamut (นอกเครือ) | tiamut | prefix: ACEC, ASE, BYD, etc. |

### 9.2 Status Workflow

```
DRAFT → PENDING → DELIVERED → VERIFYPAYMENT → PAID
   ↓        ↓          ↓              ↓           ↓
CANCEL   (void)    OVERDUE      PARTIALPAID   REFUND
```

### 9.3 Glossary

| Term | Definition |
|------|------------|
| **IShef** | Internal accounting/finance system |
| **P0/P1/P2** | Priority levels (0=Critical, 1=High, 2=Medium) |
| **Tiamut** | Auto-sync product type |
| **WL** | White Label configuration |
| **2FA** | Two-Factor Authentication |
