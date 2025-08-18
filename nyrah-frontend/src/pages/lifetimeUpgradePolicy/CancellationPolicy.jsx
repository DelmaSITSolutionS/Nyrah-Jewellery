import React from "react";
function CancellationPolicy() {
  return (
    <div className="px-[1rem] md:px-[3rem] pt-[6rem] lg:pt-[9rem] pb-7 space-y-3">
      <div className="font-cardo text-3xl text-center uppercase">
        <h1>Cancellation Policy – Nyrah Jewellery</h1>
      </div>
      <hr className="w-full text-[#dddddd] my-[2rem]" />

      <div className="space-y-5">
        <h1 className="uppercase font-poppins tracking-wider">
          1. Order Cancellation by Customer
        </h1>
        <div>
          <ul style={{ paddingLeft: "2rem" }}>
            <li>
              Orders can be cancelled within 24 hours of purchase for a full
              refund.
            </li>
            <li>
              After 24 hours, cancellations are not possible if production has
              started.
            </li>
            <li>
              For customized/made-to-order jewellery, cancellations after
              confirmation will incur a 30% advance retention fee due to
              material and labour costs.
            </li>
          </ul>
        </div>

        <h1 className="uppercase font-poppins tracking-wider">
          2. Order Cancellation by Nyrah Jewellery
        </h1>
        <div>
          <p className="mb-2">We may cancel orders in cases of :</p>
          <ul style={{ paddingLeft: "2rem" }}>
            <li>
              Payment failure or verification issues (including Diners Club
              security alerts)
            </li>
            <li>Incorrect product listing or pricing errors</li>
            <li>Non-availability of required gemstones or materials</li>
          </ul>
        </div>

        <h1 className="uppercase font-poppins tracking-wider">
          3. Refund Timelines
        </h1>
        <div>
          <ul style={{ paddingLeft: "2rem" }}>
            <li>
              Refunds for cancelled orders will be processed within 5–7 working
              days to the original payment method, subject to bank and Diners
              Club processing timelines (up to 14 working days).
            </li>
          </ul>
        </div>

         <h1 className="font-poppins capitalize tracking-wider">IMPORTANT NOTES</h1>
        <div>
          <ul style={{ paddingLeft: "2rem" }}>
            <li>
              All returns require a Return Authorization Number (RAN) from our customer care before dispatch.
            </li>
            <li>
             International customers are responsible for return shipping costs, customs duties, and taxes.
            </li>
            <li>Refund timelines may vary depending on the payment method, including Diners Club policies.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CancellationPolicy;
