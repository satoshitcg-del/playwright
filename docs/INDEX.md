# IShef Playwright Automation
## Documentation Index

---

## 📚 เอกสารทั้งหมดในโปรเจกต์

### 📘 เอกสารหลัก (Essential Documents)

| เอกสาร | ไฟล์ | รายละเอียด |
|--------|------|-----------|
| **README** | [../README.md](../README.md) | เอกสารเริ่มต้น ภาพรวมโปรเจกต์ |
| **Project Documentation** | [../PROJECT_DOCUMENTATION.md](../PROJECT_DOCUMENTATION.md) | เอกสารหลักส่งหัวหน้า |
| **Quick Start** | [../QUICKSTART.md](../QUICKSTART.md) | คู่มือเริ่มต้นใช้งานอย่างรวดเร็ว |
| **Handover Guide** | [../HANDOVER_GUIDE.md](../HANDOVER_GUIDE.md) | คู่มือสำหรับทีมรับต่อ |
| **Changelog** | [../CHANGELOG.md](../CHANGELOG.md) | บันทึกการเปลี่ยนแปลง |

---

### 📗 คู่มือการใช้งาน (User Guides)

#### สำหรับผู้เริ่มต้น
1. [Quick Start Guide](../QUICKSTART.md) - เริ่มต้นภายใน 10 นาที
2. [README - Installation](../README.md#-quick-start) - ขั้นตอนการติดตั้ง
3. [README - Running Tests](../README.md#-running-tests) - วิธีรัน tests

#### สำหรับนักพัฒนา
1. [Handover Guide - Maintenance](../HANDOVER_GUIDE.md#-วิธี-maintenance) - วิธีดูแลรักษา
2. [Handover Guide - Adding Tests](../HANDOVER_GUIDE.md#-วิธีเพิ่ม-test-cases-ใหม่) - เพิ่ม test cases ใหม่
3. [Handover Guide - Troubleshooting](../HANDOVER_GUIDE.md#-troubleshooting-guide) - แก้ไขปัญหา

---

### 📕 เอกสารโครงการ (Project Documents)

#### สำหรับหัวหน้า/ผู้บริหาร
1. [Project Documentation - Executive Summary](../PROJECT_DOCUMENTATION.md#-executive-summary) - สรุปผู้บริหาร
2. [Project Documentation - Scope & Objectives](../PROJECT_DOCUMENTATION.md#-scope--objectives) - ขอบเขตและเป้าหมาย
3. [Project Documentation - Test Coverage](../PROJECT_DOCUMENTATION.md#-test-coverage-report) - รายงานความครอบคลุม

#### สำหรับทีมพัฒนา
1. [Project Documentation - Project Structure](../PROJECT_DOCUMENTATION.md#️-project-structure) - โครงสร้างโปรเจกต์
2. [Project Documentation - Configuration](../PROJECT_DOCUMENTATION.md#-configuration-details) - รายละเอียดการตั้งค่า
3. [Project Documentation - CI/CD](../PROJECT_DOCUMENTATION.md#-cicd-integration) - การ integrate CI/CD

---

### 📙 เอกสารอ้างอิง (Reference)

#### Configuration Files
| ไฟล์ | รายละเอียด |
|------|-----------|
| [../playwright.config.ts](../playwright.config.ts) | การตั้งค่าหลักของ Playwright |
| [../package.json](../package.json) | Dependencies และ scripts |
| [../tsconfig.json](../tsconfig.json) | การตั้งค่า TypeScript |
| [../.env.example](../.env.example) | ตัวอย่าง environment variables |

#### Source Code Documentation
| โฟลเดอร์ | รายละเอียด |
|----------|-----------|
| [../pages/](../pages/) | Page Object Models |
| [../tests/](../tests/) | Test suites |
| [../fixtures/](../fixtures/) | Test data |
| [../utils/](../utils/) | Helper utilities |
| [../config/](../config/) | Environment configuration |

---

### 📊 รายงาน (Reports)

| รายงาน | ตำแหน่ง | รายละเอียด |
|--------|---------|-----------|
| **HTML Report** | `../playwright-report/index.html` | รายงานการทดสอบแบบ interactive |
| **JSON Results** | `../test-results/test-results.json` | ผลลัพธ์ในรูปแบบ JSON |
| **Screenshots** | `../test-results/` | Screenshots เมื่อ test fail |
| **Videos** | `../test-results/` | Video recordings |
| **Traces** | `../test-results/` | Trace files สำหรับ debugging |

---

## 🎯 Quick Access by Role

### 👨‍💼 สำหรับหัวหน้าทีม / ผู้บริหาร

```
📄 เอกสารที่ควรอ่าน:
├── PROJECT_DOCUMENTATION.md (Executive Summary)
├── PROJECT_DOCUMENTATION.md (Scope & Objectives)
├── PROJECT_DOCUMENTATION.md (Test Coverage Report)
└── CHANGELOG.md
```

### 👨‍💻 สำหรับ QA Engineer / Developer ที่รับต่อ

```
📄 เอกสารที่ควรอ่าน:
├── README.md
├── QUICKSTART.md
├── HANDOVER_GUIDE.md (ทั้งหมด)
└── PROJECT_DOCUMENTATION.md (Project Structure)
```

### 🔧 สำหรับ DevOps / CI-CD

```
📄 เอกสารที่ควรอ่าน:
├── PROJECT_DOCUMENTATION.md (CI/CD Integration)
├── playwright.config.ts
└── package.json
```

---

## 🔍 ค้นหาตามหัวข้อ

### การติดตั้ง (Installation)
- [Quick Start - Installation](../QUICKSTART.md#1-initial-setup)
- [README - Quick Start](../README.md#-quick-start)
- [Project Doc - Setup Guide](../PROJECT_DOCUMENTATION.md#-setup--installation-guide)

### การรัน Tests
- [README - Running Tests](../README.md#-running-tests)
- [Quick Start - Running Tests](../QUICKSTART.md#6-running-specific-tests)
- [Project Doc - Running Tests](../PROJECT_DOCUMENTATION.md#-running-tests)

### การแก้ไขปัญหา
- [Handover Guide - Troubleshooting](../HANDOVER_GUIDE.md#-troubleshooting-guide)
- [Quick Start - Troubleshooting](../QUICKSTART.md#-troubleshooting)

### การเพิ่ม Tests ใหม่
- [Handover Guide - Adding Tests](../HANDOVER_GUIDE.md#-วิธีเพิ่ม-test-cases-ใหม่)

### การ Maintenance
- [Handover Guide - Maintenance](../HANDOVER_GUIDE.md#-วิธี-maintenance)

### CI/CD Integration
- [Project Doc - CI/CD](../PROJECT_DOCUMENTATION.md#-cicd-integration)

---

## 📞 ข้อมูลติดต่อ

| บทบาท | รายละเอียด |
|-------|-----------|
| **QA Lead** | qa-lead@company.com |
| **Dev Lead** | dev-team@company.com |
| **Project Location** | `/Users/testjumpcloud3/Documents/GitHub/playwright` |

---

## 🔄 เวอร์ชั่น

- **Current Version**: 1.0.0
- **Last Updated**: 2026-03-04
- **Status**: Initial Release

---

*เอกสารนี้เป็นส่วนหนึ่งของ IShef Playwright Automation Project*
