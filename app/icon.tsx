import { readFileSync } from "fs";
import { join } from "path";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  const iconPath = join(
    process.cwd(),
    "public/images/Overture_icon_transparent_32.png"
  );
  const iconBuffer = readFileSync(iconPath);
  return new Response(iconBuffer, {
    headers: { "Content-Type": "image/png" },
  });
}
