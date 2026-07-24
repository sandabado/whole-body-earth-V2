import { NextResponse } from "next/server";
import { getAddress, verifyMessage, type Hex } from "viem";
import { buildReadingClaimMessage, type PublicReadingClaim } from "@/lib/wallet/reading-claim";
import { consumeReadingNonce } from "@/lib/wallet/nonce-store";

type BindPayload = {
  address?: string;
  signature?: string;
  chainId?: number;
  nonce?: string;
  issuedAt?: string;
  expirationTime?: string;
  claimHash?: string;
  reading?: PublicReadingClaim;
};

const HASH_PATTERN = /^0x[0-9a-f]{64}$/i;
const NONCE_PATTERN = /^[a-zA-Z0-9]{8,}$/;

export async function POST(request: Request) {
  const body = (await request.json()) as BindPayload;
  if (!body.address || !body.signature || !body.chainId || !body.nonce || !body.issuedAt
    || !body.expirationTime || !body.claimHash || !body.reading
    || !HASH_PATTERN.test(body.claimHash) || !NONCE_PATTERN.test(body.nonce)) {
    return NextResponse.json({ error: "Incomplete reading claim." }, { status: 400 });
  }

  const issuedAt = Date.parse(body.issuedAt);
  const expirationTime = Date.parse(body.expirationTime);
  const now = Date.now();
  if (!Number.isFinite(issuedAt) || !Number.isFinite(expirationTime)
    || issuedAt > now + 30_000 || expirationTime <= now || expirationTime - issuedAt > 5 * 60 * 1000) {
    return NextResponse.json({ error: "Reading claim has expired." }, { status: 400 });
  }

  let address: `0x${string}`;
  try {
    address = getAddress(body.address);
  } catch {
    return NextResponse.json({ error: "Invalid wallet address." }, { status: 400 });
  }

  const url = new URL(request.url);
  const forwardedHost = request.headers.get("x-forwarded-host");
  const domain = forwardedHost ?? request.headers.get("host") ?? url.host;
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const protocol = forwardedProto ?? url.protocol.replace(":", "");
  const uri = `${protocol}://${domain}`;
  const message = buildReadingClaimMessage({
    domain,
    address,
    uri,
    chainId: body.chainId,
    nonce: body.nonce,
    issuedAt: body.issuedAt,
    expirationTime: body.expirationTime,
    claimHash: body.claimHash,
    reading: body.reading,
  });

  const valid = await verifyMessage({
    address,
    message,
    signature: body.signature as Hex,
  }).catch(() => false);

  if (!valid || !consumeReadingNonce(body.nonce)) {
    return NextResponse.json({ error: "Signature or nonce verification failed." }, { status: 401 });
  }

  return NextResponse.json({
    bound: true,
    verified: true,
    address,
    reading: body.reading,
    claimHash: body.claimHash,
    persisted: false,
    message: "Signature verified. The private reading remains in this browser.",
  }, {
    headers: { "Cache-Control": "no-store" },
  });
}
