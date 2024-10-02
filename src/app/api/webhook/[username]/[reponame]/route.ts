import prisma from "@/db";
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

export default async function POST(
  req: NextApiRequest,
  res: NextApiResponse,
  { params }: { params: { username: string; reponame: string } }
) {
  const { username, reponame } = params;
  const payload = req.body;
  const action = req.headers["X-GitHub-Event"];
  //Right now we not add serect to the webhook url , i want add store secrcet in user database.check x-signature-sha-256 header if you wand add
  if (
    !username ||
    !reponame ||
    !payload ||
    payload.sender.username !== username ||
    payload.repository.name !== reponame
  ) {
    return res.status(200).json({ message: "Ignored event" });
  }
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    throw new Error("User not found");
  }
  if (action === "ping") {
    const { id, name, full_name, html_url, description } = payload.repository;
    // Check if the repository already exists
    const repoInDb = await prisma.repository.findUnique({
      where: { githubId: id },
    });
    //if already exists return
    if (repoInDb) {
      return res.status(200).json({ message: "Ignored event" });
    }
    // Create a new repository
    const repository = await prisma.repository.create({
      data: {
        githubId: id,
        name,
        fullName: full_name,
        htmlUrl: html_url,
        description,
        user: {
          connect: {
            id: user.id, // Connect using the userId
          },
        },
      },
    });

    return res.status(200).json({ message: "Repository created" });
  }
  if (action === "issue_comment") {
    if (payload.action !== "created" || !payload.comment) {
      return res.status(200).json({ message: "Ignored event" });
    }

  }
  const { amount: int, recipient: string } =
    extractBountyCommand(payload.comment.body) || {};
}


// model Issue {
//     id           Int            @id @default(autoincrement())
//     githubId     String            @unique
//     number       Int
//     title        String
//     body         String?
//     state        String
//     htmlUrl      String
//     createdAt    DateTime
//     updatedAt    DateTime
//     closedAt     DateTime?
//     repository   Repository     @relation(fields: [repositoryId], references: [id])
//     repositoryId Int
//     userId       String
//     user         User           @relation(fields: [userId], references: [id])
//     comments     IssueComment[]
//     bounties     Bounty[]
//   }
  
//   model IssueComment {
//     id        Int      @id @default(autoincrement())
//     githubId  String      @unique
//     body      String
//     createdAt DateTime
//     updatedAt DateTime
//     issue     Issue    @relation(fields: [issueId], references: [id])
//     issueId   Int
//     userId    String
//     user      User     @relation(fields: [userId], references: [id])
//     bounty    Bounty?
//   }
  
//   model Bounty {
//     id         Int           @id @default(autoincrement())
//     amount     Float
//     currency   String        @default("USD")
//     status     Status        @default(OPEN)
//     createdAt  DateTime      @default(now())
//     updatedAt  DateTime      @updatedAt
//     issue      Issue         @relation(fields: [issueId], references: [id])
//     issueId    Int
//     repo       Repository    @relation(fields: [repoId], references: [id])
//     repoId     Int
//     creatorId  String
//     creator    User          @relation(fields: [creatorId], references: [id])
//     comment    IssueComment  @relation(fields: [commentId], references: [id])
//     commentId  Int           @unique
//     assignedTo String?
//     claims     BountyClaim[]
//   }
  
//   model BountyClaim {
//     id         Int      @id @default(autoincrement())
//     status     String   @default("PENDING")
//     createdAt  DateTime @default(now())
//     updatedAt  DateTime @updatedAt
//     bounty     Bounty   @relation(fields: [bountyId], references: [id])
//     bountyId   Int
//     claimant   User     @relation(fields: [claimantId], references: [id])
//     claimantId String
//   }
  
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