/**
 * Test Data for IShef Automation
 */

export const CUSTOMERS = {
  creator_master_001: {
    username: 'creator_master_001',
    products: [
      {
        name: 'Thai Lotto',
        clientName: 'superadmin',
        type: 'lotto'
      },
      {
        name: 'Super API',
        clientName: '1xpower',
        alternativeClientNames: ['24plus', '1819gaming', '4cinternet', '4lowin', '77xcompany', 'abagroup'],
        type: 'api'
      },
      {
        name: 'DIRect_API( สำหรับทดสอบเท่านั้น )',
        type: 'api'
      },
      {
        name: 'ระบบออโต้ Tiamut (PGSOFT)',
        prefix: '2PP',
        alternativePrefixes: ['8BP', 'PG88'],
        type: 'tiamut',
        needsSync: true
      },
      {
        name: 'ระบบออโต้ (นอกเครือ)Fix rate',
        prefix: 'XO44',
        type: 'auto'
      },
      {
        name: 'ระบบออโต้ (นอกเครือ)',
        prefix: 'PG54',
        alternativePrefixes: ['APG', 'BWP', 'TBP', 'PGSP', 'PACG', 'P168'],
        type: 'auto'
      },
      {
        name: 'ระบบออโต้ (ในเครือ)',
        prefix: 'SPG',
        alternativePrefixes: ['KKP', 'NMP', 'QP', 'GPG', 'GP'],
        type: 'auto'
      },
      {
        name: 'SportbookV.2',
        clientName: '13KC',
        alternativeClientNames: ['1BNJ', '911B', 'AINB', 'AKUB', 'AMBK'],
        type: 'sportbook'
      },
      {
        name: 'ระบบออโต้ Tiamut (ในเครือ)',
        prefix: '168NEW',
        alternativePrefixes: ['24AB', '24AMB', '369S', 'AMB007', 'AMB126', 'AMB42'],
        type: 'tiamut',
        needsSync: true
      },
      {
        name: 'ระบบออโต้ Tiamut (นอกเครือ)',
        prefix: 'ACEC',
        alternativePrefixes: ['ASE', 'BYD', 'JUMP', 'MUE', 'UKK'],
        type: 'tiamut',
        needsSync: true
      }
    ]
  }
};

export const PRODUCT_TYPES = {
  TIAMUT: 'tiamut',
  LOTTO: 'lotto',
  API: 'api',
  SPORTBOOK: 'sportbook',
  AUTO: 'auto'
};

export const BILLING_STATUS = {
  DRAFT: 'DRAFT',
  PENDING: 'PENDING',
  DELIVERED: 'DELIVERED',
  VERIFYPAYMENT: 'VERIFYPAYMENT',
  PAID: 'PAID',
  CANCELLED: 'CANCELLED'
};

export const WL_STATUS = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED'
};
