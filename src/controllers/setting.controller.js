import db from "../database/models/index.js";

export const getMaintenanceStatus = async (req, res) => {
  try {
    const setting = await db.Setting.findOne();
    if (!setting) return res.json({ maintenanceMode: false });
    res.json({ maintenanceMode: setting.maintenanceMode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const toggleMaintenance = async (req, res) => {
  try {
    const { maintenanceMode } = req.body; // true/false

    let setting = await db.Setting.findOne();
    if (!setting) {
      setting = await db.Setting.create({ maintenanceMode });
    } else {
      setting.maintenanceMode = maintenanceMode;
      await setting.save();
    }

    res.json({ success: true, maintenanceMode: setting.maintenanceMode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
