const User = require("../models/user");
const Program = require("../models/program");
const Batch = require("../models/batch");
const Enrollment = require("../models/enrollment");
const shortid = require("shortid");

const handleErrors = (res, error) => {
  let errors = {};
  if (error.message === "invalid-mobile") {
    errors = { ...errors, mobile: "Please enter a valid mobile number." };
  }
  if (error.message === "wrong-number") {
    errors = { ...errors, payMobile: "Wrong Mobile Number" };
  }
  if (error.message === "pay-prev") {
    errors = {
      ...errors,
      payPrev: "Please the complete the payment for the previous enrollment.",
    };
  }
  if (error.message === "payment-not-done") {
    errors = {
      ...errors,
      payError:
        "Unable to Make Payment, Make sure entered details are right. If you have entered the details correctly, there may be an issue with the banking server.",
    };
  }
  if (error.message === "double-enroll") {
    errors = {
      ...errors,
      doubleEnroll: "You have Already Enrolled in this batch.",
    };
  }
  if (error.code === 11000) {
    errors = { ...errors, mobile: "Mobile Number is already registered." };
  }

  if (error.errors) {
    error = error.errors;
    if (error.gender) {
      errors = { ...errors, gender: error.gender.message };
    }
    if (error.batchId) {
      errors = { ...errors, batchId: error.batchId.message };
    }
    if (error.age) {
      errors = { ...errors, age: error.age.message };
    }
    if (error.month) {
      errors = { ...errors, month: error.month.message };
    }
  }
  return res.status(400).json({ errors: errors });
};

const enrollUser = async (req, res) => {
  const { firstName, lastName, age, month, gender, batch, mobile } = req.body;
  try {
    let batchObj = await Batch.findOne({
      batchId: batch.value,
    });

    if (!batchObj) {
      batchObj = await Batch.create({
        batchId: batch.value,
        startHour: batch.startHour,
        endHour: batch.endHour,
        AMPM: batch.AMPM,
      });
    }

    let program = await Program.findOne({
      month,
      batch: batchObj,
    });

    if (!program) {
      program = await Program.create({
        month,
        batch: batchObj,
      });
    }

    let user = await User.findOne({
      mobile,
    });

    if (!user) {
      user = await User.create({
        firstName,
        lastName,
        age,
        gender: gender.value,
        mobile,
      });
    }

    let enrollment = await Enrollment.findOne({
      user,
      program,
    });

    if (!enrollment) {
      let enrollments = await Enrollment.find({
        user,
      });

      for (let enrollment of enrollments) {
        if (!enrollment.isPaid) {
          throw new Error("pay-prev");
        }
      }

      enrollment = await Enrollment.create({
        id: shortid.generate(),
        user,
        program,
      });
    } else {
      throw new Error("double-enroll");
    }

    return res.status(201).json({ enrollment });
  } catch (error) {
    handleErrors(res, error);
  }
};

const getEnrolls = async (req, res) => {
  const { mobile } = req.params;

  try {
    const user = await User.findOne({
      mobile,
    });

    if (!user) {
      throw new Error("wrong-number");
    }

    let enrollments = await Enrollment.find({ user }).populate({
      path: "program",
      populate: "batch",
    });

    return res.status(200).send({ enrollments, user });
  } catch (error) {
    handleErrors(res, error);
  }
};

const CompletePayment = (enroll, cardNo, cardHolder, cvv) => {
  return new Promise((resolve) => {
    const randomNumber = Math.random();
    if (randomNumber < 0.8) {
      resolve(true);
    } else {
      resolve(false);
    }
  });
};

const payEnroll = async (req, res) => {
  const { id } = req.params;
  const { cardNo, cardHolder, cvv } = req.body;

  try {
    const enroll = await Enrollment.findOne({
      id,
    });

    const done = await CompletePayment(enroll, cardNo, cardHolder, cvv);
    if (done) {
      const updatedEnroll = await Enrollment.findOneAndUpdate(
        {
          id,
        },
        {
          isPaid: true,
        }
      );

      return res.status(200).send(updatedEnroll);
    } else {
      throw new Error("payment-not-done");
    }
  } catch (error) {
    handleErrors(res, error);
  }
};

module.exports = { enrollUser, getEnrolls, payEnroll };
