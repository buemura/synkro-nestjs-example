export enum WorkflowName {
  ORDER_PROCESSING = 'order-processing',
  PRODUCT_IMPORT = 'product-import',
}

export enum OrderProcessingStep {
  REDUCE_STOCK = 'reduce-stock',
  CREATE_PAYMENT = 'create-payment',
  PROCESS_PAYMENT = 'process-payment',
  START_SHIPPING = 'start-shipping',
  COMPLETE_SHIPPING = 'complete-shipping',
  PAYMENT_FAILED = 'payment-failed',
}

export enum ProductImportStep {
  SAVE_FILE = 'save-file',
  PARSE_AND_INSERT = 'parse-and-insert',
  COMPLETE_IMPORT = 'complete-import',
  NOTIFY_USER = 'notify-user',
}
