const settledOrdersFilter = {
  $or: [
    { paymentMethod: "COD" },
    { paymentStatus: { $in: ["paid", "refunded"] } },
  ],
};

module.exports = { settledOrdersFilter };
