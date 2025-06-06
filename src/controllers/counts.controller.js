import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createNewCount = async (req, res) => {
  const { itemCode, itemName, firmName, ssw, count, countType, userId } =
    req.body;

  try {
    if (
      !itemCode ||
      !itemName ||
      !firmName ||
      !ssw ||
      !count ||
      !countType ||
      !userId
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newCount = await prisma.counts.create({
      data: {
        itemCode,
        itemName,
        firmName,
        ssw,
        count,
        countType,
        userId,
      },
      select: {
        id: true,
        itemCode: true,
        itemName: true,
        firmName: true,
        ssw: true,
        count: true,
        countType: true,
        userId: true,
      },
    });

    return res.status(201).json({
      message: `${itemCode} was counted`,
      count: newCount,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error creating count" });
  }
};

const listCounts = async (req, res) => {
  const counts = await prisma.counts.findMany({
    select: {
      itemCode: true,
      itemName: true,
      count: true,
      userId: true,
      firmName: true,
      ssw: true,
      countType: true,
      createdAt: true,
      
    }
    ,
  });
  if (!counts || counts.length === 0) {
    return res.status(404).json({ message: "No counts found" });
  }
  return res.status(200).json({ counts });
};

export  { createNewCount, listCounts };
