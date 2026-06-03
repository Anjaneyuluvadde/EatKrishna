/// <reference lib="deno.ns" />

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request): Promise<Response> => {
  // HANDLE CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    // PARSE REQUEST BODY
    const body = await req.json();

    const {
      orderNumber,
      customerName,
      customer_phone,
      customer_email,
      address,
      paymentMethod,
      subtotal,
      shipping,
      total,
      orderDate,
      items,
    } = body;

    console.log("ORDER DATA:", body);

    // ENV VARIABLES
    const META_TOKEN = Deno.env.get("META_WHATSAPP_TOKEN");
    const PHONE_NUMBER_ID = Deno.env.get("META_PHONE_NUMBER_ID");
    const ADMIN_PHONE = Deno.env.get("ADMIN_WHATSAPP_NUMBER");

    // VALIDATION
    if (!META_TOKEN || !PHONE_NUMBER_ID || !ADMIN_PHONE) {
      throw new Error("Missing Meta environment variables");
    }

    // CUSTOMER PHONE DEBUG
    console.log("CUSTOMER PHONE:", customer_phone);

    // FORMAT CUSTOMER PHONE
    const rawPhone =
      body.customerPhone ||
      body.customer_phone ||
      "";

    console.log("RAW PHONE:", rawPhone);

    // REMOVE EVERYTHING EXCEPT NUMBERS
    let safeCustomerPhone = String(rawPhone).replace(/\D/g, "");

    // REMOVE EXTRA 91 IF ALREADY EXISTS
    if (safeCustomerPhone.startsWith("91")) {
      safeCustomerPhone = safeCustomerPhone.slice(2);
    }

    // FINAL FORMAT
    const formattedPhone = `91${safeCustomerPhone}`;

    console.log("FORMATTED PHONE:", formattedPhone);
    // TEMPLATE PARAMETERS
    const templateParameters = [
      {
        type: "text",
        text: customerName || "Customer",
      },
      {
        type: "text",
        text: orderNumber || "0000",
      },
      {
        type: "text",
        text:
          orderDate ||
          new Date().toLocaleDateString("en-IN"),
      },
    ];

    // =========================================
    // SEND MESSAGE TO CUSTOMER
    // =========================================

    const customerResponse = await fetch(
      `https://graph.facebook.com/v25.0/${PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${META_TOKEN}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          messaging_product: "whatsapp",

          to: formattedPhone,

          type: "template",

          template: {
            name: "jaspers_market_order_confirmation_v1",

            language: {
              code: "en_US",
            },

            components: [
              {
                type: "body",

                parameters: templateParameters,
              },
            ],
          },
        }),
      }
    );

    const customerData = await customerResponse.json();

    console.log("CUSTOMER RESPONSE:", customerData);

    // =========================================
    // SEND MESSAGE TO ADMIN
    // =========================================

    const adminResponse = await fetch(
      `https://graph.facebook.com/v25.0/${PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${META_TOKEN}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          messaging_product: "whatsapp",

          to: ADMIN_PHONE,

          type: "template",

          template: {
            name: "jaspers_market_order_confirmation_v1",

            language: {
              code: "en_US",
            },

            components: [
              {
                type: "body",

                parameters: templateParameters,
              },
            ],
          },
        }),
      }
    );

    const adminData = await adminResponse.json();

    console.log("ADMIN RESPONSE:", adminData);

    // CHECK FOR META ERRORS
    const isCustomerOk = customerResponse.ok;
    const isAdminOk = adminResponse.ok;

    if (!isAdminOk) {
      // Admin notification is critical
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to send message to Admin",
          customerError: customerData,
          adminError: adminData,
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
          status: 500,
        }
      );
    }

    // SUCCESS RESPONSE
    return new Response(
      JSON.stringify({
        success: true,
        message: isCustomerOk ? "WhatsApp messages sent successfully" : "Admin message sent, but customer message failed (e.g. not in allowed list)",
        customer: customerData,
        admin: adminData,
        partialSuccess: !isCustomerOk,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },

        status: 200,
      }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error";

    console.error("FUNCTION ERROR:", message);

    return new Response(
      JSON.stringify({
        success: false,
        error: message,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },

        status: 500,
      }
    );
  }
});