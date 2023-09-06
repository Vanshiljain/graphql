// import { Test, TestingModule } from '@nestjs/testing';
// import { WebhooksController } from './stripeweb.controller';
// import { WebhooksService } from './stripeweb.service';
// import { StripeWebhookEventDto } from './webhook-event.dto';
// import { Response } from 'express';

// describe('WebhooksController', () => {
//   let controller: WebhooksController;
//   let mockWebhooksService: any;
//   let mockResponse: Partial<Response>;

//   beforeEach(async () => {
//     mockWebhooksService = {
//       processStripeWebhook: jest.fn(),
//     };

//     mockResponse = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };

//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [WebhooksController],
//       providers: [
//         {
//           provide: WebhooksService,
//           useValue: mockWebhooksService,
//         },
//       ],
//     }).compile();

//     controller = module.get<WebhooksController>(WebhooksController);
//   });

//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });

//   describe('handleStripeWebhook', () => {
//     it('should call processStripeWebhook with the correct payload', async () => {

//       const payload: StripeWebhookEventDto = {
//         type: 'checkout.session.completed',
//         data: {
//           object: {
//             id: 'session_id',
//             customer: 'customer_id',
//             customer_name: 'Customer Name',
//             status: 'success',
//             product_id: 'product_id',
//             subscription: 'subscription_id',
//             invoice_pdf: 'invoice.pdf',
//             product: 'product_name',
//             receipt_url: 'receipt_url',
//             invoice: {
//               id: 'invoice_id',
//             },
//             items: {
//               data: [
//                 {
//                   price: {
//                     product: 'product_id',
//                     product_data: {
//                       name: 'Product Name',
//                     },
//                   },
//                 },
//               ],
//             },
//             metadata: {
//               product_id: 'product_id',
//               type: 'recurring', // Update type to match the dto
//               product_metadata: '{}',
//             },
//             refund: null,
//             lines: {
//               data: [
//                 {
//                   price: {
//                     product: 'product_id',
//                     product_data: {
//                       name: 'Product Name',
//                     },
//                   },
//                 },
//               ],
//             },
//             billing_details: {
//               address: {
//                 city: null,
//                 country: 'Country',
//                 line1: null,
//                 line2: null,
//                 postal_code: null,
//                 state: null,
//               },
//               email: 'test@example.com',
//               name: 'Test User',
//               phone: null,
//             },
//             last_payment_error: null,
//             payment_intent: null,
//             checkout_session: {
//               id: 'checkout_session_id',
//               metadata: {
//                 product_id: 'product_id',
//                 productName: 'Product Name',
//               },
//             },
//           },
//         },
//       };
    

//       await controller.handleStripeWebhook(payload, mockResponse as Response);

 
//       expect(mockWebhooksService.processStripeWebhook).toHaveBeenCalledWith(payload, mockResponse);
//       expect(mockResponse.status).toHaveBeenCalledWith(200);
//       expect(mockResponse.json).toHaveBeenCalled();
//     });

//   });

//   afterEach(() => {
   
//     jest.clearAllMocks();
//   });
// });
// import { Test, TestingModule } from '@nestjs/testing';
// import { WebhooksController } from './stripeweb.controller';
// import { WebhooksService } from './stripeweb.service';
// import { StripeWebhookEventDto } from './webhook-event.dto';
// import { Response } from 'express';

// describe('WebhooksController', () => {
//   let webhooksController: WebhooksController;
//   let webhooksService: WebhooksService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [WebhooksController],
//       providers: [WebhooksService],
//     }).compile();

//     webhooksController = module.get<WebhooksController>(WebhooksController);
//     webhooksService = module.get<WebhooksService>(WebhooksService);
//   });

//   it('should be defined', () => {
//     expect(webhooksController).toBeDefined();
//   });

//   it('should handleStripeWebhook and call processStripeWebhook', () => {
//     const payload: StripeWebhookEventDto = {
//       type: 'test',
//       data: {
//       //         data: {
//           object: {
//             id: 'session_id',
//             customer: 'customer_id',
//             customer_name: 'Customer Name',
//             status: 'success',
//             product_id: 'product_id',
//             subscription: 'subscription_id',
//             invoice_pdf: 'invoice.pdf',
//             product: 'product_name',
//             receipt_url: 'receipt_url',
//             invoice: {
//               id: 'invoice_id',
//             },
//             items: {
//               data: [
//                 {
//                   price: {
//                     product: 'product_id',
//                     product_data: {
//                       name: 'Product Name',
//                     },
//                   },
//                 },
//               ],
//             },
//             metadata: {
//               product_id: 'product_id',
//               type: 'recurring', // Update type to match the dto
//               product_metadata: '{}',
//             },
//             refund: null,
//             lines: {
//               data: [
//                 {
//                   price: {
//                     product: 'product_id',
//                     product_data: {
//                       name: 'Product Name',
//                     },
//                   },
//                 },
//               ],
//             },
//             billing_details: {
//               address: {
//                 city: null,
//                 country: 'Country',
//                 line1: null,
//                 line2: null,
//                 postal_code: null,
//                 state: null,
//               },
//               email: 'test@example.com',
//               name: 'Test User',
//               phone: null,
//             },
//             last_payment_error: null,
//             payment_intent: null,
//             checkout_session: {
//               id: 'checkout_session_id',
//               metadata: {
//                 product_id: 'product_id',
//                 productName: 'Product Name',
//               },
//             },
//           },
//         },
//       };
    
//     const response: Response = {} as Response;

//     const processStripeWebhookSpy = jest
//       .spyOn(webhooksService, 'processStripeWebhook')
//       .mockResolvedValue(Promise.resolve() as Promise<void>);

//     webhooksController.handleStripeWebhook(payload, response);

//     expect(processStripeWebhookSpy).toHaveBeenCalledWith(payload, response);
//   });
// });
// import { Test, TestingModule } from '@nestjs/testing';
// import { WebhooksController } from './stripeweb.controller';
// import { WebhooksService } from './stripeweb.service';
// import { StripeWebhookEventDto } from './webhook-event.dto';
// import { Response } from 'express';

// describe('WebhooksController', () => {
//   let webhooksController: WebhooksController;
//   let webhooksService: WebhooksService;

//   const mockWebhooksService = {
//     processStripeWebhook: jest.fn(),
//   };

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [WebhooksController],
//       providers: [
//         {
//           provide: WebhooksService,
//           useValue: mockWebhooksService,
//         },
//       ],
//     }).compile();

//     webhooksController = module.get<WebhooksController>(WebhooksController);
//     webhooksService = module.get<WebhooksService>(WebhooksService);
//   });

//   it('should be defined', () => {
//     expect(webhooksController).toBeDefined();
//   });

//   it('should handleStripeWebhook and call processStripeWebhook', async () => {
//     const payload: StripeWebhookEventDto = {
//       type: 'test',
//       data: {
//       //         data: {
//           object: {
//             id: 'session_id',
//             customer: 'customer_id',
//             customer_name: 'Customer Name',
//             status: 'success',
//             product_id: 'product_id',
//             subscription: 'subscription_id',
//             invoice_pdf: 'invoice.pdf',
//             product: 'product_name',
//             receipt_url: 'receipt_url',
//             invoice: {
//               id: 'invoice_id',
//             },
//             items: {
//               data: [
//                 {
//                   price: {
//                     product: 'product_id',
//                     product_data: {
//                       name: 'Product Name',
//                     },
//                   },
//                 },
//               ],
//             },
//             metadata: {
//               product_id: 'product_id',
//               type: 'recurring', // Update type to match the dto
//               product_metadata: '{}',
//             },
//             refund: null,
//             lines: {
//               data: [
//                 {
//                   price: {
//                     product: 'product_id',
//                     product_data: {
//                       name: 'Product Name',
//                     },
//                   },
//                 },
//               ],
//             },
//             billing_details: {
//               address: {
//                 city: null,
//                 country: 'Country',
//                 line1: null,
//                 line2: null,
//                 postal_code: null,
//                 state: null,
//               },
//               email: 'test@example.com',
//               name: 'Test User',
//               phone: null,
//             },
//             last_payment_error: null,
//             payment_intent: null,
//             checkout_session: {
//               id: 'checkout_session_id',
//               metadata: {
//                 product_id: 'product_id',
//                 productName: 'Product Name',
//               },
//             },
//           },
//         },
//       };
    

//     const response: Response = {} as Response;

//     const processStripeWebhookSpy = jest
//       .spyOn(webhooksService, 'processStripeWebhook')
//       .mockResolvedValue(Promise.resolve() as Promise<void>);

//     await webhooksController.handleStripeWebhook(payload, response);

//     expect(processStripeWebhookSpy).toHaveBeenCalledWith(payload, response);
//     expect(response.status).toHaveBeenCalledWith(200);
//     expect(response.json).toHaveBeenCalled();
//   });
// });
import { Test, TestingModule } from '@nestjs/testing';
import { WebhooksController } from './stripeweb.controller';
import { WebhooksService } from './stripeweb.service';
import { StripeWebhookEventDto } from './webhook-event.dto';
import { Response } from 'express';

describe('WebhooksController', () => {
  let webhooksController: WebhooksController;
  let webhooksService: WebhooksService;

  const mockWebhooksService = {
    processStripeWebhook: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebhooksController],
      providers: [
        {
          provide: WebhooksService,
          useValue: mockWebhooksService,
        },
      ],
    }).compile();

    webhooksController = module.get<WebhooksController>(WebhooksController);
    webhooksService = module.get<WebhooksService>(WebhooksService);
  });

  it('should be defined', () => {
    expect(webhooksController).toBeDefined();
  });

  it('should handleStripeWebhook and call processStripeWebhook', async () => {
    const payload: StripeWebhookEventDto = {
      type: 'test',
      data: {
      //         data: {
          object: {
            id: 'session_id',
            customer: 'customer_id',
            customer_name: 'Customer Name',
            status: 'success',
            product_id: 'product_id',
            subscription: 'subscription_id',
            invoice_pdf: 'invoice.pdf',
            product: 'product_name',
            receipt_url: 'receipt_url',
            invoice: {
              id: 'invoice_id',
            },
            items: {
              data: [
                {
                  price: {
                    product: 'product_id',
                    product_data: {
                      name: 'Product Name',
                    },
                  },
                },
              ],
            },
            metadata: {
              product_id: 'product_id',
              type: 'recurring', // Update type to match the dto
              product_metadata: '{}',
            },
            refund: null,
            lines: {
              data: [
                {
                  price: {
                    product: 'product_id',
                    product_data: {
                      name: 'Product Name',
                    },
                  },
                },
              ],
            },
            billing_details: {
              address: {
                city: null,
                country: 'Country',
                line1: null,
                line2: null,
                postal_code: null,
                state: null,
              },
              email: 'test@example.com',
              name: 'Test User',
              phone: null,
            },
            last_payment_error: null,
            payment_intent: null,
            checkout_session: {
              id: 'checkout_session_id',
              metadata: {
                product_id: 'product_id',
                productName: 'Product Name',
              },
            },
          },
        },
      };
   
    const response: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const processStripeWebhookSpy = jest
      .spyOn(webhooksService, 'processStripeWebhook')
      .mockResolvedValue(Promise.resolve() as Promise<void>);

    await webhooksController.handleStripeWebhook(payload, response as Response);

    expect(processStripeWebhookSpy).toHaveBeenCalledWith(payload, response);

    // Verify that response.status() and response.json() are called
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalled();
  });
});
