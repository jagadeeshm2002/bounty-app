import type { NextApiRequest, NextApiResponse } from "next";
interface ExtendedNextApiRequest extends NextApiRequest {
  rawBody: Buffer;
}
export const config = {
  api: {
    bodyParser: {
      json: {
        verify: (
          req: ExtendedNextApiRequest,
          res: NextApiResponse,
          buf: Buffer
        ) => {
          req.rawBody = buf;
        },
      },
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "POST") {
    const payload = req.body;

    if (payload.action !== "created" || !payload.comment) {
      return res.status(200).json({ message: "Ignored event" });
    }
    const bountyCommand = extractBountyCommand(payload.comment.body);
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
function extractBountyCommand(
  commentBody: string
): { amount: number; recipient: string } | null {
  const match = commentBody.match(/\/bounty \$(\d+) @(\w+)/);
  if (match) {
    return {
      amount: parseInt(match[1], 10),
      recipient: match[2],
    };
  }
  return null;
}
