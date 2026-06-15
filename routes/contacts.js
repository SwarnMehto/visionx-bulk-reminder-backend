router.get("/progress/:jobId", async (req, res) => {
  const progress = await redis.get(`csv-progress-${req.params.jobId}`);

  res.json({
    progress: progress || 0,
  });
});