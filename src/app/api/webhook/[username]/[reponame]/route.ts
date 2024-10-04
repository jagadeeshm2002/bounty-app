import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";

export async function POST(
  req: NextRequest,
  context: { params?: { username?: string; reponame?: string } }
) {
  try {
    const { username, reponame } = context.params || {};
    console.log(username, reponame);

    if (!username || !reponame) {
      return NextResponse.json(
        { message: "Username or repo name not found" },
        { status: 404 }
      );
    }

    const payload = await req.json();
    const action = req.headers.get("x-github-event");

    if (
      !payload ||
      payload.sender.login !== username ||
      payload.repository.name !== reponame
    ) {
      return NextResponse.json({ message: "Ignored event" }, { status: 200 });
    }

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (action === "ping") {
      return handlePingEvent(payload, user);
    }

    if (action === "issue_comment") {
      return handleIssueCommentEvent(payload, user);
    }

    return NextResponse.json(
      { message: "Unhandled event type" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in webhook handler:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

async function handlePingEvent(payload: any, user: any) {
  const { id, name, full_name, html_url, description } = payload.repository;
  const githubId = id.toString();

  const repoInDb = await prisma.repository.findUnique({
    where: { githubId: githubId },
  });

  if (repoInDb) {
    return NextResponse.json(
      { message: "Repository already exists" },
      { status: 200 }
    );
  }

  await prisma.repository.create({
    data: {
      githubId: githubId,
      name,
      fullName: full_name,
      htmlUrl: html_url,
      description,
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  return NextResponse.json({ message: "Repository created" }, { status: 200 });
}

async function handleIssueCommentEvent(payload: any, user: any) {
  if (payload.action !== "created" || !payload.comment) {
    return NextResponse.json({ message: "Ignored event" }, { status: 200 });
  }

  const { amount, recipient } =
    extractBountyCommand(payload.comment.body) ?? {};

  if (!amount || !recipient) {
    return NextResponse.json(
      { message: "Invalid bounty command" },
      { status: 200 }
    );
  }

  const githubId = payload.repository?.id.toString();

  const repo = await prisma.repository.findUnique({
    where: { githubId: githubId },
  });
  const issueId = payload.issue.id.toString();
  const existingBounty = await prisma.bounty.findUnique({
    where: { issueId },
  });

  if (existingBounty) {
    return NextResponse.json(
      { message: "Already bounty was assigned to this issue" },
      { status: 404 }
    );
  }

  if (!repo) {
    return NextResponse.json(
      { message: "Repository not found" },
      { status: 404 }
    );
  }

  const bounty = await prisma.bounty.create({
    data: {
      amount: amount,
      assignedTo: recipient,
      creator: {
        connect: {
          id: user.id,
        },
      },
      repo: {
        connect: {
          id: repo.id,
        },
      },
      issueId: issueId,
      issue_url: payload.issue.url,
      issueCommentId: payload.comment.id.toString(),
      issueComment_url: payload.comment.url,
      issueCommentBody: payload.comment.body,
    },
  });

  return NextResponse.json(
    { message: "Bounty created", bountyId: bounty.id },
    { status: 200 }
  );
}

function extractBountyCommand(
  commentBody: string
): { amount: string; recipient: string } | null {
  const match = commentBody.match(/\/bounty \$(\d+) @(\w+)/);
  if (match) {
    return {
      amount: match[1],
      recipient: match[2],
    };
  }
  return null;
}
