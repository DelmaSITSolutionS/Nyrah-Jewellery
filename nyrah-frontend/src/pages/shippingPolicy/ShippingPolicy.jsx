import React from "react";

function ShippingPolicy() {
  return (
    <div className="px-[1rem] md:px-[3rem] pt-[6rem] lg:pt-[9rem] pb-7 space-y-3">
      <div className="font-cardo text-3xl text-center uppercase">
        <h1>SHIPPING &nbsp;POLICY</h1>
      </div>
      <div className="text-center font-poppins text-sm md:text-lg tracking-wider">
        <p>
          At Nyrah Jewelry, we take great care to ensure your jewelry reaches
          you safely and promptly.
        </p>
      </div>
      <hr className="w-full text-[#dddddd] my-[2rem]" />
    <div className="space-y-5 ">
        <h1 className="font-poppins tracking-wider">1. PROCESSING TIME</h1>
        <div >
          <ul style={{ paddingLeft: "2rem" }}>
            <li>
              <strong>Ready Jewelry (Regular Designs) :</strong>&nbsp;Ships
              within 5-7 business days after order confirmation.
            </li>
            <li>
              <strong>Customized / Made-to-Order Jewelry :</strong>&nbsp;Ships
              within 15-20 business days (depending on design complexity).
            </li>
          </ul>
        </div>

        <h1 className="font-poppins tracking-wider">
          2. PREFERRED COURIER PARTNERS
        </h1>
        <div className="font-poppins text-sm tracking-wide">
          We partner with trusted and globally recognized courier services for
          secure and fast delivery :
        </div>
        <div>
          <ul style={{ paddingLeft: "2rem" }}>
            <li>
              <strong>DHL</strong>
            </li>
            <li>
              <strong>FedEx</strong>
            </li>
            <li>
              <strong>UPS (United Parcel Service)</strong>
            </li>
            <li>
              <strong>City International</strong>
            </li>
          </ul>
        </div>

        <h1 className="font-poppins tracking-wider">3. ESTIMATED DELIVERY TIMES</h1>
        <div>
          <ul style={{ paddingLeft: "2rem" }}>
            <li>
              <strong>Domestic (India) :</strong>&nbsp;2-5 business-days after
              dispatch
            </li>
            <li>
              <strong>International :</strong>&nbsp;7-15 business-days after
              dispatch, depending on destination and customs clearance
            </li>
          </ul>
        </div>

        <h1 className="font-poppins tracking-wider">4. SHIPPING CHARGES</h1>
        <div>
          <ul style={{ paddingLeft: "2rem" }}>
            <li>
              <strong>Free shipping</strong>&nbsp;All shipments are fully
              insured until delivery.
            </li>
            <li>
              <strong>International shipping</strong>&nbsp;is calculated at
              checkout based on your location and order weight.
            </li>
          </ul>
        </div>

        <h1 className="font-poppins tracking-wider">5. TRACKING & INSURANCE</h1>
        <div>
          <ul style={{ paddingLeft: "2rem" }}>
            <li>
              Free shippingAll shipments are&nbsp;<strong>fully insured</strong>
              &nbsp;until delivery.
            </li>
            <li>
              You will receive a&nbsp;<strong>tracking number</strong>&nbsp;as
              soon as your order is shipped.
            </li>
          </ul>
        </div>

        <h1 className="font-poppins tracking-wider">6. CUSTOMS, DUTIES & TAXES</h1>
        <div>
          <ul style={{ paddingLeft: "2rem" }}>
            <li>
              For &nbsp;<strong>international orders,</strong>&nbsp;duties,
              taxes, or customs fees (if applicable) are the responsibility of
              the buyer.
            </li>
            <li>
              Customs clearance procedures may cause delays beyond our control.
            </li>
          </ul>
        </div>

        <h1 className="font-poppins tracking-wider">IMPORTANT NOTES</h1>
        <div>
          <ul style={{ paddingLeft: "2rem" }}>
            <li>
              Ensure your shipping address is accurate; we are not responsible
              for delivery issues caused by incorrect addresses.
            </li>
            <li>
              If your parcel is delayed, lost, or damaged, contact us at&nbsp;
              <strong>nyrahbyjhanvi@gmail.com</strong>&nbsp;and we'llassist you.
            </li>
          </ul>
        </div>

        <h1 className="font-poppins tracking-wider">CONTACT US</h1>
        <div>For any shipping questions, please reach out:</div>
        <div>
          <strong>nyrahbyjhanvi@gmail.com</strong>
          <br />
        </div>
        <div>
          <strong style={{ marginBottom: "2rem" }}>+91 9737527178</strong>
        </div>
        <div>
          Your official address will get the item, which Nyrah Jewelry will
          deliver to your doorstep.
        </div>
      </div>
    </div>
  );
}

export default ShippingPolicy;
