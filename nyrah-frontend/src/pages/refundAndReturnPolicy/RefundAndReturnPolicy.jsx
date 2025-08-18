import React from "react";

function RefundAndReturnPolicy() {
  return (
    <div className="px-[1rem] md:px-[3rem] pt-[6rem] lg:pt-[9rem] pb-7 space-y-3">
      <div className="font-cardo uppercase text-3xl text-center">
        <h1>Return & Refund Policy – Nyrah Jewellery</h1>
      </div>
      <div className="text-center font-poppins tracking-wider ">
        <p>
          At Nyrah Jewellery, every piece is crafted with precision, care, and
          attention to detail. We strive for complete customer satisfaction
          while maintaining the highest quality standards.
        </p>
      </div>
      <hr className="text-[#dddddd] my-[2rem]" />
      <div className="space-y-5">
        <h1 className="uppercase font-poppins tracking-wider">
          1. Eligibility for Returns & Refunds
        </h1>
        <div>
          <ul style={{ paddingLeft: "2rem" }}>
            <li>
              <strong>Non-Customized Jewellery :</strong>&nbsp;Eligible for
              return within 7 days of delivery if unused, unworn, and in
              original packaging with all tags and certificates intact.
            </li>
            <li>
              <strong>Customized / Made-to-Order Jewellery :</strong>&nbsp;Due
              to personalization, no returns or refunds are accepted unless the
              product is defective or incorrect.
            </li>
            <li>
              <strong>Defective or Wrong Product :</strong>&nbsp;Report within
              48 hours of delivery with unboxing photos/videos for verification.
            </li>
          </ul>
        </div>

        <h1 className="uppercase font-poppins tracking-wider">
          2. Refund Process
        </h1>
        <div>
          <ul style={{ paddingLeft: "2rem" }}>
            <li>
              Refunds are initiated only after our quality team inspects and
              approves the returned product.
            </li>
            <li>
              Amount will be refunded to the original payment method (including
              Diners Club cards) within 7–10 working days.
            </li>
            <li>Shipping charges, duties, and taxes are non-refundable.</li>
          </ul>
        </div>

        <h1 className="uppercase font-poppins tracking-wider">
          3. Non-Returnable Items
        </h1>
        <div>
          <ul style={{ paddingLeft: "2rem" }}>
            <li>
              Earrings (for hygiene reasons)
            </li>
            <li>
              Customized, engraved, or resized jewellery
            </li>
            <li>
              Items purchased during special sales or clearance
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

        <h1 >CONTACT US</h1>
        <div>For any query, please reach out:</div>
        <div>
          <strong>
            nyrahbyjhanvi@gmail.com
          </strong>
          <br />
        </div>
        <div>
          <strong style={{ marginTop: "1.8rem" }}>+91 9737527178</strong>
        </div>
      </div>
    </div>
  );
}

export default RefundAndReturnPolicy;
