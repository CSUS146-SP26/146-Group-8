/**
 * Pinata IPFS service.
 *
 * Uploads files to IPFS via Pinata's pinning service and returns the CID
 * (Content Identifier) — a hash that uniquely points to the file on IPFS.
 *
 * The JWT lives in frontend/.env as VITE_PINATA_JWT and is never committed.
 *
 * NOTE on production hardening: Vite exposes VITE_-prefixed vars to the
 * browser, so anyone inspecting DevTools can see the JWT. For real production
 * we'd proxy uploads through a backend that holds the key server-side.
 * For this academic demo, exposing it client-side is acceptable.
 */

import { PinataSDK } from "pinata";

const JWT = import.meta.env.VITE_PINATA_JWT;

if (!JWT) {
  console.error(
    "[pinata] VITE_PINATA_JWT is missing. Add it to frontend/.env and restart Vite."
  );
}

// Pinata's public gateway — used to construct viewable URLs for the CID.
const PINATA_GATEWAY = "gateway.pinata.cloud";

const pinata = new PinataSDK({
  pinataJwt: JWT,
  pinataGateway: PINATA_GATEWAY,
});

/**
 * Upload a single File (from an <input type="file">) to IPFS via Pinata.
 *
 * @param {File} file - the video file selected by the creator
 * @returns {Promise<{ cid: string, url: string, size: number }>}
 */
export async function uploadFileToIPFS(file) {
  if (!file) throw new Error("No file provided");
  if (!JWT) throw new Error("Pinata JWT not configured");

  try {
    // Pinata SDK v2 syntax: public network is implicit for free-tier accounts.
    const result = await pinata.upload.public.file(file);

    // Pinata returns either { cid } or { IpfsHash } depending on SDK version.
    const cid = result.cid || result.IpfsHash;
    if (!cid) {
      console.error("[pinata] Unexpected response shape:", result);
      throw new Error("Upload succeeded but no CID returned");
    }

    return {
      cid,
      url: `https://${PINATA_GATEWAY}/ipfs/${cid}`,
      size: file.size,
    };
  } catch (err) {
    console.error("[pinata] Upload failed:", err);
    throw new Error(err.message || "IPFS upload failed");
  }
}

/**
 * Build the public gateway URL for a given CID.
 * Used by the Player page to stream the video.
 */
export function gatewayUrl(cid) {
  return `https://${PINATA_GATEWAY}/ipfs/${cid}`;
}