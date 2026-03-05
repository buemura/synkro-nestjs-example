import type { SynkroWorkflow } from '@synkro/core';

import {
  OrderProcessingStep,
  ProductImportStep,
  WorkflowName,
} from './workflow.enum';

export const workflows: SynkroWorkflow[] = [
  {
    name: WorkflowName.ORDER_PROCESSING,
    steps: [
      {
        type: OrderProcessingStep.REDUCE_STOCK,
      },
      {
        type: OrderProcessingStep.CREATE_PAYMENT,
      },
      {
        type: OrderProcessingStep.PROCESS_PAYMENT,
        onFailure: OrderProcessingStep.PAYMENT_FAILED,
      },
      {
        type: OrderProcessingStep.START_SHIPPING,
      },
      {
        type: OrderProcessingStep.COMPLETE_SHIPPING,
      },
      {
        type: OrderProcessingStep.PAYMENT_FAILED,
      },
    ],
  },
  {
    name: WorkflowName.PRODUCT_IMPORT,
    steps: [
      {
        type: ProductImportStep.SAVE_FILE,
      },
      {
        type: ProductImportStep.PARSE_AND_INSERT,
      },
      {
        type: ProductImportStep.COMPLETE_IMPORT,
      },
      {
        type: ProductImportStep.NOTIFY_USER,
      },
    ],
  },
];
