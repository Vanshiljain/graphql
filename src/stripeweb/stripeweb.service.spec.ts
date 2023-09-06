// import { Test, TestingModule } from '@nestjs/testing';
// import { getModelToken } from '@nestjs/mongoose';
// import { WebhooksService } from './stripeweb.service';
// import { StripeWebhookEventDto } from './webhook-event.dto';
// import { StripeSubscription } from './strpe-subscription.schema';
// import { StripeInvoice } from './stripe-invoice.schema';
// import { PaymentIntent } from './paymentintentmodel';
// import { GithubLoginService } from '../githubUser/githubUser.service';
// import { Response } from 'express';

// describe('WebhooksService', () => {
//   let service: WebhooksService;
//   let mockStripeSubscriptionModel: any;
//   let mockStripeInvoiceModel: any;
//   let mockPaymentModel: any;
//   let mockGithubLoginService: any;
//   let mockResponse: Partial<Response>;

//   beforeEach(async () => {
//     mockStripeSubscriptionModel = {
//       create: jest.fn(),
//       save: jest.fn(),
//     };

//     mockStripeInvoiceModel = {
//       create: jest.fn(),
//       save: jest.fn(),
//     };

//     mockPaymentModel = {
//       create: jest.fn(),
//       save: jest.fn(),
//     };

//     mockGithubLoginService = {
//       getGithubUserDetails: jest.fn(),
//     };

//     mockResponse = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };

//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         WebhooksService,
//         {
//           provide: getModelToken('StripeSubscription'),
//           useValue: mockStripeSubscriptionModel,
//         },
//         {
//           provide: getModelToken('StripeInvoice'),
//           useValue: mockStripeInvoiceModel,
//         },
//         {
//           provide: getModelToken('paymentIntent'),
//           useValue: mockPaymentModel,
//         },
//         {
//           provide: GithubLoginService,
//           useValue: mockGithubLoginService,
//         },
//       ],
//     }).compile();

//     service = module.get<WebhooksService>(WebhooksService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   describe('processStripeWebhook', () => {
//     it('should process checkout.session.completed webhook for recurring session', async () => {
//       // Mock the input payload
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

//       mockGithubLoginService.getGithubUserDetails.mockResolvedValue(/* Mocked user details */);

//       // Mock the create and save methods for StripeSubscription model
//       const createStripeSubscriptionSpy = jest.spyOn(mockStripeSubscriptionModel, 'create');
//       createStripeSubscriptionSpy.mockReturnValue({
//         ...payload.data.object, // Mocked data returned by create
//         save: jest.fn(),
//       });

//       // Call the method to be tested
//       await service.processStripeWebhook(payload, mockResponse as Response);

//       // Assertions
//       expect(mockGithubLoginService.getGithubUserDetails).toHaveBeenCalledWith('Vanshiljain');
//       expect(createStripeSubscriptionSpy).toHaveBeenCalledWith({
//         userId: '64ddcb0434015edd0169d6e1',
//         subscriptionId: 'session_id',
//         metadata: payload,
//         product: {
//           product_id: 'product_id',
//           product_metadata: {},
//         },
//       });
//       expect(mockResponse.status).toHaveBeenCalledWith(200);
//       expect(mockResponse.json).toHaveBeenCalledWith(/* Mocked response data */);
//     });

//     // Add more test cases for other webhook types and scenarios here
//   });

//   // Add more test cases for other service methods as needed

//   afterEach(() => {
//     // Clear all mocked function calls and resets
//     jest.clearAllMocks();
//   });
// });
import { Test, TestingModule } from '@nestjs/testing';
import { WebhooksService } from './stripeweb.service';
import { getModelToken } from '@nestjs/mongoose';
import { StripeWebhookEventDto } from './webhook-event.dto';
import { Response } from 'express';
import { GithubLoginService } from '../githubUser/githubUser.service';
import { GitHubUserDetails } from '@app/githubUser/github.schema';
describe('WebhooksService', () => {
  let webhooksService: WebhooksService;

  const mockStripeSubscriptionModel = {};
  const mockStripeInvoiceModel = {};
  const mockPaymentModel = {};
  const mockGithubLoginService = {
    
        getGithubUserDetails: jest.fn().mockResolvedValue({
          _id: '1',
          username: 'testuser',
          email: 'testuser@example.com',
          name: 'Test User',
          // Add other properties as needed
        } as GitHubUserDetails), // Use type assertion to specify the return type
      };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebhooksService,
        {
          provide: getModelToken('StripeSubscription'),
          useValue: mockStripeSubscriptionModel,
        },
        {
          provide: getModelToken('StripeInvoice'),
          useValue: mockStripeInvoiceModel,
        },
        {
          provide: getModelToken('paymentIntent'),
          useValue: mockPaymentModel,
        },
        {
          provide: GithubLoginService,
          useValue: mockGithubLoginService,
        },
      ],
    }).compile();

    webhooksService = module.get<WebhooksService>(WebhooksService);
  });

  it('should be defined', () => {
    expect(webhooksService).toBeDefined();
  });

  it('should processStripeWebhook', async () => {
    const payload: StripeWebhookEventDto = {
      type: 'test',
      data: {
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
    const response: Response = {} as Response;
    const getGithubUserDetailsSpy = jest
    .spyOn(webhooksService.githubLoginService, 'getGithubUserDetails')
    .mockResolvedValue({
      _id: '1',
      username: 'testuser',
      email: 'testuser@example.com',
      name: 'Test User',
    
    } as GitHubUserDetails);

    const result = await webhooksService.processStripeWebhook(payload, response);

    expect(getGithubUserDetailsSpy).toHaveBeenCalledWith('Vanshiljain');
    // Add more assertions based on your test scenario
  });
});


