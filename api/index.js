export default function handler(req, res) {
  res.status(200).json({
    status: 'ok',
    message: 'CivicBloom & FoundHub Vercel API Gateway',
    timestamp: new Date().toISOString(),
  });
}
