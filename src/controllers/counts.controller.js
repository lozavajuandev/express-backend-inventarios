import dbConnection from "../config/db";

const createNewCount = async (req, res) => {
  const { itemCode, itemName, firmCode, ssw, count, typeCount, username } =
    req.body;

    const newCount = dbConnection.query("INSERT")

  return res
    .status(201)
    .json({
      message: `${itemCode} was counted`,
      count,
      itemDescription: req.body,
    });
};

export default createNewCount;
