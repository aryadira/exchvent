const express = require("express");

const getAll = (req, res) => {
  return res.status(200).send({ message: "success" });
};

module.exports = {
  getAll,
};
