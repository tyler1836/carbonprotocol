// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const help = process.env.MORALIS_API_KEY
export default function handler(req, res) {
  res.status(200).json({ help })
}
