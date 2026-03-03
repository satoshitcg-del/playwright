# QA Review Checklist

## Overview

ใช้ checklist นี้สำหรับตรวจสอบคุณภาพของ test code, test cases, และ test execution ก่อน merge และ release

---

## 📋 Pre-Review Checklist

ก่อนเริ่ม review ให้ตรวจสอบว่า:

- [ ] รัน test ทั้งหมดผ่าน locally
- [ ] ไม่มี console.log ที่ไม่จำเป็น
- [ ] Code ผ่าน linting (ถ้ามี)
- [ ] Commit messages ชัดเจน

---

## 🧪 Test Case Review Checklist

### Test Structure

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1 | ใช้ AAA pattern (Arrange-Act-Assert) | ☐ | |
| 2 | Test name อธิบายสิ่งที่ทดสอบชัดเจน | ☐ | ควรขึ้นต้นด้วย "should" |
| 3 | แต่ละ test เป็นอิสระ (ไม่พึ่งพา test อื่น) | ☐ | |
| 4 | ใช้ beforeEach สำหรับ common setup | ☐ | |
| 5 | ไม่มี duplicate code (ใช้ helpers/fixtures) | ☐ | |

### Assertions

| # | Item | Status | Notes |
|---|------|--------|-------|
| 6 | มี assertions ที่ชัดเจนและเฉพาะเจาะจง | ☐ | |
| 7 | ไม่ใช้ expect(true).toBe(true) แบบ generic | ☐ | |
| 8 | ตรวจสอบทั้ง positive และ negative cases | ☐ | |
| 9 | ใช้ appropriate matchers (toHaveURL, toBeVisible, etc.) | ☐ | |

### Test Data

| # | Item | Status | Notes |
|---|------|--------|-------|
| 10 | ใช้ fixtures สำหรับ test data | ☐ | |
| 11 | Test data ไม่ซ้ำกันเมื่อรันหลายครั้ง | ☐ | |
| 12 | มี invalid/edge case data | ☐ | |
| 13 | ไม่ hardcode sensitive data (ใช้ env vars) | ☐ | |

---

## 📄 Page Object Review Checklist

### Structure

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1 | Extend BasePage class | ☐ | |
| 2 | Locators อยู่ใน constructor | ☐ | |
| 3 | ใช้ readonly สำหรับ locators | ☐ | |
| 4 | Method names เป็น verbs ที่ชัดเจน | ☐ | |
| 5 | ไม่มี assertions ใน page objects | ☐ | |

### Best Practices

| # | Item | Status | Notes |
|---|------|--------|-------|
| 6 | ซ่อน implementation details (ไม่ expose raw locators) | ☐ | |
| 7 | ใช้ wait strategies ที่เหมาะสม | ☐ | |
| 8 | มี error handling สำหรับ edge cases | ☐ | |
| 9 | Reusable methods (ไม่ duplicated ระหว่าง pages) | ☐ | |

### Selectors

| # | Item | Status | Notes |
|---|------|--------|-------|
| 10 | ใช้ user-facing selectors (text, role) เป็นหลัก | ☐ | |
| 11 | มี data-testid สำหรับ elements ที่ไม่มี text | ☐ | |
| 12 | ไม่ใช้ xpath ที่ซับซ้อน | ☐ | |
| 13 | Avoid brittle selectors (index-based, dynamic classes) | ☐ | |

---

## ⚙️ Configuration Review Checklist

### Playwright Config

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1 | Base URL ถูกต้อง | ☐ | |
| 2 | Timeouts เหมาะสมกับ application | ☐ | |
| 3 | Retries ตั้งค่าเหมาะสม | ☐ | CI: 2, Local: 0 |
| 4 | Workers ตั้งค่าไม่ให้ cause flakiness | ☐ | |
| 5 | Projects ครอบคลุม target browsers | ☐ | |

### Environment

| # | Item | Status | Notes |
|---|------|--------|-------|
| 6 | .env.example อัปเดตครบถ้วน | ☐ | |
| 7 | ไม่ commit .env file | ☐ | ตรวจสอบ .gitignore |
| 8 | Credentials ไม่ hardcode ใน code | ☐ | |

---

## 🔄 Test Execution Review Checklist

### Before Running

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1 | Environment พร้อมใช้งาน | ☐ | |
| 2 | Test data ถูกต้อง | ☐ | |
| 3 | Authentication state valid | ☐ | |
| 4 | No blocking defects | ☐ | |

### During Execution

| # | Item | Status | Notes |
|---|------|--------|-------|
| 5 | Tests run without intervention | ☐ | |
| 6 | No random failures (flaky) | ☐ | |
| 7 | Screenshots/video captured on failure | ☐ | |
| 8 | Console errors logged | ☐ | |

### After Execution

| # | Item | Status | Notes |
|---|------|--------|-------|
| 9 | Test report generated | ☐ | |
| 10 | Failed tests มี trace/screenshot | ☐ | |
| 11 | บันทึก bugs ที่พบ | ☐ | |
| 12 | Test results documented | ☐ | |

---

## 🐛 Bug Reporting Checklist

เมื่อพบ bug ระหว่าง testing:

| # | Item | Status |
|---|------|--------|
| 1 | Title อธิบายปัญหาชัดเจน | ☐ |
| 2 | Steps to reproduce ละเอียด | ☐ |
| 3 | Expected vs Actual result | ☐ |
| 4 | Environment (browser, URL) | ☐ |
| 5 | Screenshot/Video attached | ☐ |
| 6 | Severity/Priority กำหนด | ☐ |
| 7 | Related test case referenced | ☐ |

---

## ✅ Final Sign-off Checklist

ก่อน merge PR หรือ release:

### Code Quality

- [ ] ผ่าน code review จาก peer
- [ ] ไม่มี console.log หรือ debug code
- [ ] Comments อธิบาย complex logic (ถ้ามี)
- [ ] TypeScript types ครบถ้วน

### Test Coverage

- [ ] ครอบคลุม critical paths (P0)
- [ ] มี test สำหรับ bug fixes
- [ ] Test coverage ≥ 70%
- [ ] No skipped tests ที่ไม่มีเหตุผล

### Documentation

- [ ] README อัปเดต (ถ้ามีการเปลี่ยนแปลง)
- [ ] Test plan อัปเดต
- [ ] Breaking changes บันทึกไว้

### Execution

- [ ] รัน test ทั้งหมดผ่าน 100%
- [ ] Flaky tests ถูกแก้ไขหรือ document
- [ ] Performance ไม่ degrade
- [ ] Cross-browser tests ผ่าน (ถ้ามี)

---

## 📝 Review Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Test Engineer | | | |
| QA Lead | | | |
| Developer | | | |

---

## 🎯 Priority Definitions

| Priority | Description | Response Time |
|----------|-------------|---------------|
| **P0 - Critical** | System down, data loss, security breach | Immediate |
| **P1 - High** | Major feature broken, workaround difficult | 24 hours |
| **P2 - Medium** | Feature partially broken, workaround exists | 1 week |
| **P3 - Low** | Cosmetic issues, minor inconveniences | Next sprint |

---

## 📊 Test Coverage Categories

### Must Have (P0)

- [ ] Authentication (login, 2FA, logout)
- [ ] Customer CRUD operations
- [ ] Product configuration (all 10 products)
- [ ] Billing status transitions
- [ ] Critical business workflows

### Should Have (P1)

- [ ] Customer list/search
- [ ] Product add/remove
- [ ] WL status management
- [ ] Error handling
- [ ] Validation messages

### Nice to Have (P2)

- [ ] Pagination
- [ ] Sorting
- [ ] Filter combinations
- [ ] Accessibility
- [ ] Performance benchmarks

---

## 🔗 Related Documents

- [Test Plan](./TEST_PLAN.md)
- [Testing Guidelines](./TESTING_GUIDELINES.md)
- [Test Data](../fixtures/test-data.ts)
- [Playwright Config](../playwright.config.ts)
