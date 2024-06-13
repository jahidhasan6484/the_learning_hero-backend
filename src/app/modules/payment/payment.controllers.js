const { ObjectId } = require("mongodb");
const SSLCommerzPayment = require("sslcommerz-lts");
const Payment = require("./payment.model");
const User = require("../user/user.model");

const IS_LIVE = false;

const payNow = async (req, res) => {
  try {
    const userId = req._id;
    const payInfo = req.body;
    const transactionId = new ObjectId().toString();

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const data = {
      total_amount: payInfo.fee,
      currency: "BDT",
      tran_id: transactionId, // use unique tran_id for each api call
      success_url: `${process.env.SERVER}/payment/success?transactionId=${transactionId}`,
      fail_url: `${process.env.SERVER}/payment/fail?transactionId=${transactionId}`,
      cancel_url: `${process.env.SERVER}/payment/cancel?transactionId=${transactionId}`,
      ipn_url: "http://localhost:3030/ipn",
      shipping_method: "Courier",
      product_name: "Course Fee",
      product_category: "Education",
      product_profile: "general",
      cus_name: user.name,
      cus_email: user.email,
      cus_add1: "Dhaka",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: "01711111111",
      ship_name: user.name,
      ship_add1: "Dhaka",
      ship_city: "Dhaka",
      ship_state: "Dhaka",
      ship_postcode: 1000,
      ship_country: "Bangladesh",
    };

    const sslcz = new SSLCommerzPayment(
      process.env.STORE_ID,
      process.env.STORE_PASSWORD,
      IS_LIVE
    );
    sslcz
      .init(data)
      .then(async (apiResponse) => {
        // Redirect the user to payment gateway
        let GatewayPageURL = apiResponse.GatewayPageURL;

        const newPayment = new Payment({
          transactionId,
          courseId: payInfo.courseId,
          userId,
          fee: payInfo.fee,
          paid: false,
        });

        await newPayment.save();

        res.status(200).json({ url: GatewayPageURL });
      })
      .catch((error) => {
        console.error("Payment initiation error:", error);
        return res.status(500).json({ message: "Payment initiation failed" });
      });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const paymentSuccess = async (req, res) => {
  const { transactionId } = req.query;
  try {
    const result = await Payment.findOneAndUpdate(
      { transactionId: transactionId },
      { paid: true },
      { new: true }
    );

    if (result.paid == true) {
      res.redirect(
        `${process.env.CLIENT}/payment/success?transactionId=${transactionId}`
      );
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const paymentFail = async (req, res) => {
  const { transactionId } = req.query;

  try {
    const result = await Payment.deleteOne({ transactionId: transactionId });

    if (result.deletedCount > 0) {
      res.redirect(`${process.env.CLIENT}/payment/failed`);
    } else {
      return res.status(404).json({ message: "Transaction record not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const paymentCancel = async (req, res) => {
  const { transactionId } = req.query;

  try {
    const result = await Payment.deleteOne({ transactionId: transactionId });

    if (result.deletedCount > 0) {
      res.redirect(`${process.env.CLIENT}/payment/canceled`);
    } else {
      return res.status(404).json({ message: "Transaction record not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  payNow,
  paymentSuccess,
  paymentFail,
  paymentCancel,
};
