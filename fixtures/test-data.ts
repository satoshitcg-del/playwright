/**
 * Test Data for IShef Automation
 * 
 * This file contains all test data for the IShef system including:
 * - Customer configurations
 * - Product definitions with prefixes and client names
 * - Status constants
 * - Invalid/edge case data for negative testing
 * - Helper functions for generating test data
 */

// ============================================
// CONSTANTS
// ============================================

/**
 * Product Type Constants
 */
export const PRODUCT_TYPES = {
  TIAMUT: 'tiamut',
  LOTTO: 'lotto',
  API: 'api',
  SPORTBOOK: 'sportbook',
  AUTO: 'auto'
} as const;

/**
 * Billing Status Constants
 */
export const BILLING_STATUS = {
  DRAFT: 'DRAFT',
  PENDING: 'PENDING',
  DELIVERED: 'DELIVERED',
  VERIFYPAYMENT: 'VERIFYPAYMENT',
  PARTIALPAID: 'PARTIALPAID',
  PAID: 'PAID',
  OVERDUE: 'OVERDUE',
  VOID: 'VOID',
  REFUND: 'REFUND',
  CANCEL: 'CANCEL'
} as const;

/**
 * WL Status Constants
 */
export const WL_STATUS = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED'
} as const;

/**
 * Customer Type Constants
 */
export const CUSTOMER_TYPES = {
  CREATOR: 'creator',
  MASTER: 'master',
  AGENT: 'agent',
  MEMBER: 'member'
} as const;

// ============================================
// PREFIX CONSTANTS
// ============================================

/**
 * Tiamut Prefixes - PGSOFT
 */
export const TIAMUT_PGSOFT_PREFIXES = {
  DEFAULT: '2PP',
  ALT_8BP: '8BP',
  ALT_PG88: 'PG88'
} as const;

/**
 * Tiamut Prefixes - ในเครือ (Internal)
 */
export const TIAMUT_INTERNAL_PREFIXES = {
  DEFAULT: '168NEW',
  ALT_24AB: '24AB',
  ALT_24AMB: '24AMB',
  ALT_369S: '369S',
  ALT_AMB007: 'AMB007',
  ALT_AMB126: 'AMB126',
  ALT_AMB42: 'AMB42',
  ALT_AMB48: 'AMB48',
  ALT_AMB4X: 'AMB4X',
  ALT_AMBBET24: 'AMBBET24',
  ALT_AMBET: 'AMBET',
  ALT_AMBEX: 'AMBEX',
  ALT_AMBLOTTO: 'AMBLOTTO',
  ALT_AMBSLOT: 'AMBSLOT',
  ALT_AMBT: 'AMBT',
  ALT_AMBTT: 'AMBTT',
  ALT_AMBVV: 'AMBVV'
} as const;

/**
 * Tiamut Prefixes - นอกเครือ (External)
 */
export const TIAMUT_EXTERNAL_PREFIXES = {
  DEFAULT: 'ACEC',
  ALT_ASE: 'ASE',
  ALT_BYD: 'BYD',
  ALT_JUMP: 'JUMP',
  ALT_MUE: 'MUE',
  ALT_UKK: 'UKK',
  ALT_WOW: 'WOW',
  ALT_ZEAN: 'ZEAN'
} as const;

/**
 * Auto System Prefixes - นอกเครือ (External)
 */
export const AUTO_EXTERNAL_PREFIXES = {
  DEFAULT: 'PG54',
  ALT_APG: 'APG',
  ALT_BWP: 'BWP',
  ALT_TBP: 'TBP',
  ALT_PGSP: 'PGSP',
  ALT_PACG: 'PACG',
  ALT_P168: 'P168'
} as const;

/**
 * Auto System Prefixes - ในเครือ (Internal)
 */
export const AUTO_INTERNAL_PREFIXES = {
  DEFAULT: 'SPG',
  ALT_KKP: 'KKP',
  ALT_NMP: 'NMP',
  ALT_QP: 'QP',
  ALT_GPG: 'GPG',
  ALT_GP: 'GP',
  ALT_11AM: '11AM',
  ALT_123B: '123B',
  ALT_24PLAY: '24PLAY',
  ALT_4B: '4B',
  ALT_4MB: '4MB',
  ALT_51AM: '51AM',
  ALT_77A: '77A'
} as const;

/**
 * Fixed Rate Auto Prefixes
 */
export const AUTO_FIXED_PREFIXES = {
  DEFAULT: 'XO44'
} as const;

// ============================================
// CLIENT NAME CONSTANTS
// ============================================

/**
 * Thai Lotto Client Names
 */
export const LOTTO_CLIENT_NAMES = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  SYSTEM: 'system'
} as const;

/**
 * Super API Client Names
 */
export const SUPER_API_CLIENT_NAMES = {
  DEFAULT: '1xpower',
  ALT_24PLUS: '24plus',
  ALT_1819GAMING: '1819gaming',
  ALT_4CINTERNET: '4cinternet',
  ALT_4LOWIN: '4lowin',
  ALT_77XCOMPANY: '77xcompany',
  ALT_ABAGROUP: 'abagroup',
  ALT_ALL4SLOT: 'all4slot',
  ALT_AMB44: 'amb44',
  ALT_AMBBET: 'ambbet',
  ALT_AMBBET24: 'ambbet24'
} as const;

/**
 * Sportbook Client Names
 */
export const SPORTBOOK_CLIENT_NAMES = {
  DEFAULT: '13KC',
  ALT_1BNJ: '1BNJ',
  ALT_911B: '911B',
  ALT_AINB: 'AINB',
  ALT_AKUB: 'AKUB',
  ALT_AMBK: 'AMBK',
  ALT_AMBS: 'AMBS',
  ALT_AMBSEXY: 'AMBSEXY',
  ALT_ASK: 'ASK',
  ALT_B: 'B',
  ALT_B1: 'B1',
  ALT_BBBB: 'BBBB',
  ALT_BEEM: 'BEEM',
  ALT_BETFLIX: 'BETFLIX',
  ALT_BETFLIX2: 'BETFLIX2'
} as const;

// ============================================
// CUSTOMER DATA
// ============================================

export const CUSTOMERS = {
  creator_master_001: {
    username: 'creator_master_001',
    type: CUSTOMER_TYPES.CREATOR,
    products: [
      {
        name: 'Thai Lotto',
        clientName: LOTTO_CLIENT_NAMES.SUPERADMIN,
        type: PRODUCT_TYPES.LOTTO,
        configurable: true
      },
      {
        name: 'Super API',
        clientName: SUPER_API_CLIENT_NAMES.DEFAULT,
        alternativeClientNames: Object.values(SUPER_API_CLIENT_NAMES),
        type: PRODUCT_TYPES.API,
        configurable: true
      },
      {
        name: 'DIRect_API( สำหรับทดสอบเท่านั้น )',
        type: PRODUCT_TYPES.API,
        configurable: false
      },
      {
        name: 'ระบบออโต้ Tiamut (PGSOFT)',
        prefix: TIAMUT_PGSOFT_PREFIXES.DEFAULT,
        alternativePrefixes: Object.values(TIAMUT_PGSOFT_PREFIXES),
        type: PRODUCT_TYPES.TIAMUT,
        needsSync: true,
        configurable: true
      },
      {
        name: 'ระบบออโต้ (นอกเครือ)Fix rate',
        prefix: AUTO_FIXED_PREFIXES.DEFAULT,
        type: PRODUCT_TYPES.AUTO,
        configurable: true
      },
      {
        name: 'ระบบออโต้ (นอกเครือ)',
        prefix: AUTO_EXTERNAL_PREFIXES.DEFAULT,
        alternativePrefixes: Object.values(AUTO_EXTERNAL_PREFIXES),
        type: PRODUCT_TYPES.AUTO,
        configurable: true
      },
      {
        name: 'ระบบออโต้ (ในเครือ)',
        prefix: AUTO_INTERNAL_PREFIXES.DEFAULT,
        alternativePrefixes: Object.values(AUTO_INTERNAL_PREFIXES),
        type: PRODUCT_TYPES.AUTO,
        configurable: true
      },
      {
        name: 'SportbookV.2',
        clientName: SPORTBOOK_CLIENT_NAMES.DEFAULT,
        alternativeClientNames: Object.values(SPORTBOOK_CLIENT_NAMES),
        type: PRODUCT_TYPES.SPORTBOOK,
        configurable: true
      },
      {
        name: 'ระบบออโต้ Tiamut (ในเครือ)',
        prefix: TIAMUT_INTERNAL_PREFIXES.DEFAULT,
        alternativePrefixes: Object.values(TIAMUT_INTERNAL_PREFIXES),
        type: PRODUCT_TYPES.TIAMUT,
        needsSync: true,
        configurable: true
      },
      {
        name: 'ระบบออโต้ Tiamut (นอกเครือ)',
        prefix: TIAMUT_EXTERNAL_PREFIXES.DEFAULT,
        alternativePrefixes: Object.values(TIAMUT_EXTERNAL_PREFIXES),
        type: PRODUCT_TYPES.TIAMUT,
        needsSync: true,
        configurable: true
      }
    ]
  }
} as const;

// ============================================
// PRODUCT DEFINITIONS
// ============================================

export const PRODUCTS = {
  THAI_LOTTO: {
    name: 'Thai Lotto',
    type: PRODUCT_TYPES.LOTTO,
    defaultClientName: LOTTO_CLIENT_NAMES.SUPERADMIN,
    validClientNames: Object.values(LOTTO_CLIENT_NAMES)
  },
  SUPER_API: {
    name: 'Super API',
    type: PRODUCT_TYPES.API,
    defaultClientName: SUPER_API_CLIENT_NAMES.DEFAULT,
    validClientNames: Object.values(SUPER_API_CLIENT_NAMES)
  },
  TIAMUT_PGSOFT: {
    name: 'ระบบออโต้ Tiamut (PGSOFT)',
    type: PRODUCT_TYPES.TIAMUT,
    defaultPrefix: TIAMUT_PGSOFT_PREFIXES.DEFAULT,
    validPrefixes: Object.values(TIAMUT_PGSOFT_PREFIXES),
    needsSync: true
  },
  TIAMUT_INTERNAL: {
    name: 'ระบบออโต้ Tiamut (ในเครือ)',
    type: PRODUCT_TYPES.TIAMUT,
    defaultPrefix: TIAMUT_INTERNAL_PREFIXES.DEFAULT,
    validPrefixes: Object.values(TIAMUT_INTERNAL_PREFIXES),
    needsSync: true
  },
  TIAMUT_EXTERNAL: {
    name: 'ระบบออโต้ Tiamut (นอกเครือ)',
    type: PRODUCT_TYPES.TIAMUT,
    defaultPrefix: TIAMUT_EXTERNAL_PREFIXES.DEFAULT,
    validPrefixes: Object.values(TIAMUT_EXTERNAL_PREFIXES),
    needsSync: true
  },
  AUTO_EXTERNAL: {
    name: 'ระบบออโต้ (นอกเครือ)',
    type: PRODUCT_TYPES.AUTO,
    defaultPrefix: AUTO_EXTERNAL_PREFIXES.DEFAULT,
    validPrefixes: Object.values(AUTO_EXTERNAL_PREFIXES)
  },
  AUTO_INTERNAL: {
    name: 'ระบบออโต้ (ในเครือ)',
    type: PRODUCT_TYPES.AUTO,
    defaultPrefix: AUTO_INTERNAL_PREFIXES.DEFAULT,
    validPrefixes: Object.values(AUTO_INTERNAL_PREFIXES)
  },
  AUTO_FIXED: {
    name: 'ระบบออโต้ (นอกเครือ)Fix rate',
    type: PRODUCT_TYPES.AUTO,
    defaultPrefix: AUTO_FIXED_PREFIXES.DEFAULT,
    validPrefixes: Object.values(AUTO_FIXED_PREFIXES)
  },
  SPORTBOOK: {
    name: 'SportbookV.2',
    type: PRODUCT_TYPES.SPORTBOOK,
    defaultClientName: SPORTBOOK_CLIENT_NAMES.DEFAULT,
    validClientNames: Object.values(SPORTBOOK_CLIENT_NAMES)
  },
  DIRECT_API: {
    name: 'DIRect_API( สำหรับทดสอบเท่านั้น )',
    type: PRODUCT_TYPES.API,
    configurable: false
  }
} as const;

// ============================================
// INVALID/EDGE CASE DATA (Negative Testing)
// ============================================

/**
 * Invalid credentials for authentication testing
 */
export const INVALID_CREDENTIALS = {
  emptyUsername: {
    username: '',
    password: 'valid_password',
    expectedError: 'Please enter username'
  },
  emptyPassword: {
    username: 'valid_user',
    password: '',
    expectedError: 'Please enter password'
  },
  bothEmpty: {
    username: '',
    password: '',
    expectedError: 'Please enter username'
  },
  invalidUsername: {
    username: 'nonexistent_user_xyz',
    password: 'any_password',
    expectedError: 'Invalid username or password'
  },
  invalidPassword: {
    username: 'admin_eiji',
    password: 'wrong_password',
    expectedError: 'Invalid username or password'
  },
  specialCharsUsername: {
    username: '!@#$%^&*()',
    password: 'valid_password',
    expectedError: 'Invalid characters'
  },
  sqlInjection: {
    username: "'; DROP TABLE users; --",
    password: "'; DROP TABLE users; --",
    expectedError: 'Invalid username or password'
  },
  xssAttempt: {
    username: '<script>alert("xss")</script>',
    password: '<script>alert("xss")</script>',
    expectedError: 'Invalid username or password'
  },
  longUsername: {
    username: 'a'.repeat(256),
    password: 'valid_password',
    expectedError: 'Username too long'
  },
  longPassword: {
    username: 'valid_user',
    password: 'b'.repeat(256),
    expectedError: 'Password too long'
  }
} as const;

/**
 * Invalid 2FA codes
 */
export const INVALID_2FA_CODES = {
  empty: '',
  tooShort: '123',
  tooLong: '1234567',
  invalidChars: 'abcdef',
  expired: '000000', // Simulated expired code
  wrongCode: '111111'
} as const;

/**
 * Invalid product configurations
 */
export const INVALID_PRODUCT_CONFIGS = {
  thaiLotto: {
    emptyClientName: {
      clientName: '',
      expectedError: 'Client name is required'
    },
    invalidClientName: {
      clientName: 'invalid_client_xyz',
      expectedError: 'Invalid client name'
    },
    specialChars: {
      clientName: '!@#$%',
      expectedError: 'Invalid characters in client name'
    }
  },
  tiamut: {
    emptyPrefix: {
      prefix: '',
      expectedError: 'Prefix is required'
    },
    invalidPrefix: {
      prefix: 'XXX',
      expectedError: 'Invalid prefix'
    },
    tooLongPrefix: {
      prefix: 'TOOLONGPREFIX',
      expectedError: 'Prefix too long'
    },
    specialChars: {
      prefix: '!@#',
      expectedError: 'Invalid characters in prefix'
    }
  },
  superApi: {
    emptyClientName: {
      clientName: '',
      expectedError: 'Client name is required'
    },
    invalidClientName: {
      clientName: 'invalid_api_client',
      expectedError: 'Invalid client name'
    }
  }
} as const;

/**
 * Invalid billing data
 */
export const INVALID_BILLING_DATA = {
  emptyAmount: {
    amount: '',
    expectedError: 'Amount is required'
  },
  negativeAmount: {
    amount: '-100',
    expectedError: 'Amount must be positive'
  },
  zeroAmount: {
    amount: '0',
    expectedError: 'Amount must be greater than zero'
  },
  invalidAmount: {
    amount: 'abc',
    expectedError: 'Invalid amount'
  },
  pastDueDate: {
    dueDate: '2020-01-01',
    expectedError: 'Due date must be in the future'
  },
  emptyCustomer: {
    customerId: '',
    expectedError: 'Customer is required'
  }
} as const;

/**
 * Edge case data
 */
export const EDGE_CASE_DATA = {
  // Boundary values
  minPrefix: 'A',
  maxPrefix: 'ABCDEFGH',
  minUsername: 'a',
  maxUsername: 'a'.repeat(50),
  
  // Unicode characters
  unicodeUsername: '用户测试',
  unicodePassword: 'パスワード',
  
  // Whitespace
  leadingSpace: '  username',
  trailingSpace: 'username  ',
  multipleSpaces: 'user  name',
  tabCharacter: 'user\tname',
  newlineCharacter: 'user\nname',
  
  // Mixed valid/invalid
  validPrefixInvalidClient: {
    prefix: '2PP',
    clientName: 'invalid'
  },
  invalidPrefixValidClient: {
    prefix: 'XXX',
    clientName: 'superadmin'
  }
} as const;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Generate unique test data with timestamp
 */
export function generateUniqueData(base: string): string {
  const timestamp = Date.now();
  return `${base}_${timestamp}`;
}

/**
 * Get random item from array
 */
export function getRandomItem<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

/**
 * Get random prefix for product type
 */
export function getRandomPrefix(productType: keyof typeof PRODUCTS): string {
  const product = PRODUCTS[productType];
  if ('validPrefixes' in product) {
    return getRandomItem(product.validPrefixes);
  }
  return '';
}

/**
 * Get random client name for product type
 */
export function getRandomClientName(productType: keyof typeof PRODUCTS): string {
  const product = PRODUCTS[productType];
  if ('validClientNames' in product) {
    return getRandomItem(product.validClientNames);
  }
  return '';
}

/**
 * Generate test customer data
 */
export function generateTestCustomer(overrides?: Partial<typeof CUSTOMERS.creator_master_001>): typeof CUSTOMERS.creator_master_001 {
  return {
    ...CUSTOMERS.creator_master_001,
    username: generateUniqueData('test_customer'),
    ...overrides
  };
}

/**
 * Get all product names for a customer
 */
export function getProductNames(customerKey: keyof typeof CUSTOMERS): string[] {
  return CUSTOMERS[customerKey].products.map(p => p.name);
}

/**
 * Get configurable products for a customer
 */
export function getConfigurableProducts(customerKey: keyof typeof CUSTOMERS): typeof CUSTOMERS.creator_master_001.products {
  return CUSTOMERS[customerKey].products.filter(p => p.configurable !== false);
}

/**
 * Get products that need sync
 */
export function getSyncRequiredProducts(customerKey: keyof typeof CUSTOMERS): typeof CUSTOMERS.creator_master_001.products {
  return CUSTOMERS[customerKey].products.filter(p => p.needsSync === true);
}

/**
 * Validate prefix for product
 */
export function isValidPrefix(productName: string, prefix: string): boolean {
  const product = Object.values(PRODUCTS).find(p => p.name === productName);
  if (product && 'validPrefixes' in product) {
    return product.validPrefixes.includes(prefix as any);
  }
  return true;
}

/**
 * Validate client name for product
 */
export function isValidClientName(productName: string, clientName: string): boolean {
  const product = Object.values(PRODUCTS).find(p => p.name === productName);
  if (product && 'validClientNames' in product) {
    return product.validClientNames.includes(clientName as any);
  }
  return true;
}

// ============================================
// BILLING WORKFLOW DATA
// ============================================

export const BILLING_WORKFLOW = {
  validTransitions: [
    { from: BILLING_STATUS.DRAFT, to: BILLING_STATUS.PENDING },
    { from: BILLING_STATUS.PENDING, to: BILLING_STATUS.DELIVERED },
    { from: BILLING_STATUS.DELIVERED, to: BILLING_STATUS.VERIFYPAYMENT },
    { from: BILLING_STATUS.VERIFYPAYMENT, to: BILLING_STATUS.PAID },
    { from: BILLING_STATUS.DRAFT, to: BILLING_STATUS.CANCEL }
  ],
  invalidTransitions: [
    { from: BILLING_STATUS.PAID, to: BILLING_STATUS.PENDING, reason: 'Cannot revert from PAID' },
    { from: BILLING_STATUS.CANCEL, to: BILLING_STATUS.PENDING, reason: 'Cannot reactivate cancelled billing' },
    { from: BILLING_STATUS.VOID, to: BILLING_STATUS.PAID, reason: 'Void is terminal state' }
  ],
  terminalStates: [BILLING_STATUS.CANCEL, BILLING_STATUS.VOID, BILLING_STATUS.REFUND]
} as const;

// ============================================
// ENVIRONMENT CONFIG
// ============================================

export const ENVIRONMENT = {
  baseUrl: process.env.BASE_URL || 'https://bo-dev.askmebill.com',
  defaultUsername: process.env.USERNAME || 'admin_eiji',
  defaultPassword: process.env.PASSWORD || '0897421942@Earth',
  default2FACode: '999999',
  testCustomer: 'creator_master_001'
} as const;

// ============================================
// EXPORT ALL
// ============================================

export default {
  CUSTOMERS,
  PRODUCTS,
  PRODUCT_TYPES,
  BILLING_STATUS,
  WL_STATUS,
  CUSTOMER_TYPES,
  INVALID_CREDENTIALS,
  INVALID_2FA_CODES,
  INVALID_PRODUCT_CONFIGS,
  INVALID_BILLING_DATA,
  EDGE_CASE_DATA,
  BILLING_WORKFLOW,
  ENVIRONMENT,
  // Prefix exports
  TIAMUT_PGSOFT_PREFIXES,
  TIAMUT_INTERNAL_PREFIXES,
  TIAMUT_EXTERNAL_PREFIXES,
  AUTO_EXTERNAL_PREFIXES,
  AUTO_INTERNAL_PREFIXES,
  AUTO_FIXED_PREFIXES,
  // Client name exports
  LOTTO_CLIENT_NAMES,
  SUPER_API_CLIENT_NAMES,
  SPORTBOOK_CLIENT_NAMES,
  // Helper functions
  generateUniqueData,
  getRandomItem,
  getRandomPrefix,
  getRandomClientName,
  generateTestCustomer,
  getProductNames,
  getConfigurableProducts,
  getSyncRequiredProducts,
  isValidPrefix,
  isValidClientName
};
