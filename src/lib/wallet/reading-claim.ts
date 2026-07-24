export type PublicReadingClaim = {
  house: number;
  element: string;
  archetype: string;
  pillar: string;
};

export type ReadingClaimMessageInput = {
  domain: string;
  address: string;
  uri: string;
  chainId: number;
  nonce: string;
  issuedAt: string;
  expirationTime: string;
  claimHash: string;
  reading: PublicReadingClaim;
};

export function buildReadingClaimMessage(input: ReadingClaimMessageInput) {
  return `${input.domain} wants you to sign in with your Ethereum account:
${input.address}

Bind a private Dodecanic reading commitment to this wallet. No transaction is executed and no birth data is included.

URI: ${input.uri}
Version: 1
Chain ID: ${input.chainId}
Nonce: ${input.nonce}
Issued At: ${input.issuedAt}
Expiration Time: ${input.expirationTime}
Request ID: dodecanic-reading
Resources:
- urn:wholebody:reading:${input.claimHash}

House: ${input.reading.house}
Element: ${input.reading.element}
Archetype: ${input.reading.archetype}
Pillar: ${input.reading.pillar}`;
}
