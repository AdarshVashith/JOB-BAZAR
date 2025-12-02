const prisma = require("../db/prisma.js");

const createJob = async (req, res) => {
  const { title, company, location, description, requirements, salary, type } = req.body;
  const { hrId } = req.params;
  
  console.log('Creating job with data:', { title, company, location, description, requirements, salary, type, hrId });
  
  if (!title || !company || !location || !description || !requirements) {
    return res.status(400).json({ message: "All required fields must be filled" });
  }
  
  try {
    const job = await prisma.job.create({
      data: { 
        title, 
        company, 
        location, 
        description, 
        requirements, 
        salary: salary || null, 
        type: type || 'full-time', 
        hrId: parseInt(hrId) 
      }
    });
    return res.status(201).json({ message: "Job created successfully", job });
  } catch (err) {
    console.error('Job creation error:', err);
    return res.status(500).json({ message: "Server Error: " + err.message });
  }
};

const getJobs = async (req, res) => {
  const { search, location, skills } = req.query;
  
  try {
    const jobs = await prisma.job.findMany({
      where: {
        AND: [
          search ? { title: { contains: search, mode: 'insensitive' } } : {},
          location ? { location: { contains: location, mode: 'insensitive' } } : {},
          skills ? { requirements: { contains: skills, mode: 'insensitive' } } : {}
        ]
      },
      include: { hr: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json(jobs);
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
};

const getJobById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const job = await prisma.job.findUnique({
      where: { id: parseInt(id) },
      include: { hr: { select: { name: true, email: true } } }
    });
    
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    
    return res.status(200).json(job);
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
};

const updateJob = async (req, res) => {
  const { id } = req.params;
  const { title, company, location, description, requirements, salary, type } = req.body;
  
  try {
    const job = await prisma.job.update({
      where: { id: parseInt(id) },
      data: { title, company, location, description, requirements, salary, type }
    });
    return res.status(200).json({ message: "Job updated successfully", job });
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
};

const deleteJob = async (req, res) => {
  const { id } = req.params;
  
  try {
    await prisma.job.delete({ where: { id: parseInt(id) } });
    return res.status(200).json({ message: "Job deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
};

const applyForJob = async (req, res) => {
  const { jobId, candidateId } = req.params;
  
  console.log('Applying for job:', { jobId, candidateId });
  
  try {
    // Check if already applied
    const existingApplication = await prisma.application.findUnique({
      where: { jobId_candidateId: { jobId: parseInt(jobId), candidateId: parseInt(candidateId) } }
    });
    
    if (existingApplication) {
      return res.status(400).json({ message: "Already applied for this job" });
    }
    
    const application = await prisma.application.create({
      data: { jobId: parseInt(jobId), candidateId: parseInt(candidateId), status: 'pending' }
    });
    
    console.log('Application created:', application);
    return res.status(201).json({ message: "Application submitted successfully", application });
  } catch (err) {
    console.error('Apply for job error:', err);
    return res.status(500).json({ message: "Server Error: " + err.message });
  }
};

const getApplications = async (req, res) => {
  const { candidateId } = req.params;
  
  try {
    const applications = await prisma.application.findMany({
      where: { candidateId: parseInt(candidateId) },
      include: { job: { include: { hr: { select: { name: true } } } } },
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json(applications);
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
};

const getJobsByHR = async (req, res) => {
  const { hrId } = req.params;
  
  try {
    const jobs = await prisma.job.findMany({
      where: { hrId: parseInt(hrId) },
      include: { hr: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json(jobs);
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
};

const getApplicationsByJob = async (req, res) => {
  const { jobId } = req.params;
  
  try {
    const applications = await prisma.application.findMany({
      where: { jobId: parseInt(jobId) },
      include: { 
        candidate: { select: { name: true, email: true, phoneNumber: true } },
        job: { select: { title: true, company: true, location: true, type: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json(applications);
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
};

const updateApplicationStatus = async (req, res) => {
  const { applicationId } = req.params;
  const { status, response } = req.body;
  
  console.log('Updating application status:', { applicationId, status, response });
  
  if (!['pending', 'accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }
  
  try {
    const application = await prisma.application.update({
      where: { id: parseInt(applicationId) },
      data: { status, response: response || null, updatedAt: new Date() }
    });
    
    console.log('Application status updated:', application);
    return res.status(200).json({ message: "Application status updated successfully", application });
  } catch (err) {
    console.error('Update application status error:', err);
    return res.status(500).json({ message: "Server Error: " + err.message });
  }
};

module.exports = { createJob, getJobs, getJobById, updateJob, deleteJob, applyForJob, getApplications, getJobsByHR, getApplicationsByJob, updateApplicationStatus };