const prisma = require("../db/prisma.js");

const getProfile = async (req, res) => {
  const { userId } = req.params;
  
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: parseInt(userId) },
      include: { user: { select: { name: true, email: true, phoneNumber: true } } }
    });
    
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    
    return res.status(200).json(profile);
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
};

const createOrUpdateProfile = async (req, res) => {
  const { userId } = req.params;
  const { location, rolesLookingFor, technicalSkills, softSkills, toolsTech, degree, university, graduationYear, workExperience } = req.body;
  
  try {
    const profile = await prisma.profile.upsert({
      where: { userId: parseInt(userId) },
      update: { location, rolesLookingFor, technicalSkills, softSkills, toolsTech, degree, university, graduationYear, workExperience },
      create: { userId: parseInt(userId), location, rolesLookingFor, technicalSkills, softSkills, toolsTech, degree, university, graduationYear, workExperience }
    });
    
    return res.status(200).json({ message: "Profile updated successfully", profile });
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getProfile, createOrUpdateProfile };