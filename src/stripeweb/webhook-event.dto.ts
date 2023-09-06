import { ApiProperty } from '@nestjs/swagger';

export class StripeWebhookEventDto {
  @ApiProperty()
  type: string;

  @ApiProperty()
  data: {
    object: {
      id: string;
      customer: string;
      customer_name: string;
      status: string;
      product_id: string;
      subscription: string;
      invoice_pdf: string;
      product:string; // Add the invoice_pdf field
      receipt_url: string;
      invoice: {
        id: string;
       
      };
      items: {
        data: {
          price: {
            product: string;
            product_data: {
              name: string;
              // Add more fields as needed
            };
          };
        }[];
      };
      metadata: {
        product_id: string;
        type: string; // Add the 'type' field
        product_metadata: string; // Add the 'product_metadata' field
      };
      refund: {
        id: string;
        amount: number;
        currency: string;
        reason: string;
        // Add more refund-related fields as needed
      } | null;
       
     
      lines: {
        data: {
          price: {
            product: string;
            product_data: {
              name: string;
              // Add more fields as needed
            };
          };
        }[];
      };
      billing_details: {
        address: {
          city: string | null;
          country: string;
          line1: string | null;
          line2: string | null;
          postal_code: string | null;
          state: string | null;
        };
        email: string;
        name: string;
        phone: string | null;
      };
      last_payment_error:any;
    
      

      payment_intent: any;
      checkout_session: {
        id:string,
        metadata: {
          
          product_id: string;
          productName: string;
        };
      };
    };
  };
}
