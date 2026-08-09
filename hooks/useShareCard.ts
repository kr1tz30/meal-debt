import { useCallback, useState, RefObject } from "react";
import { toPng } from "html-to-image";

type Status = "idle" | "generating" | "done" | "error";

export function useShareCard(ref: RefObject<HTMLElement | null>, filename = "meal-debt.png") {
  const [status, setStatus] = useState<Status>("idle");

  const generate = useCallback(async (): Promise<string | null> => {
    if (!ref.current) return null;
    setStatus("generating");
    try {
      const dataUrl = await toPng(ref.current, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: "#FAF8F5",
      });
      setStatus("done");
      return dataUrl;
    } catch {
      setStatus("error");
      return null;
    }
  }, [ref]);

  const download = useCallback(async () => {
    const dataUrl = await generate();
    if (!dataUrl) return false;
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();
    return true;
  }, [generate, filename]);

  const share = useCallback(async (): Promise<boolean> => {
    const dataUrl = await generate();
    if (!dataUrl) return false;
    try {
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], filename, { type: "image/png" });
      const nav = navigator as Navigator & {
        canShare?: (data: { files: File[] }) => boolean;
        share?: (data: { files: File[]; title?: string }) => Promise<void>;
      };
      if (nav.share && nav.canShare?.({ files: [file] })) {
        await nav.share({ files: [file], title: "Meal Debt" });
        return true;
      }
    } catch {
      // user cancelled or share unsupported — fall through
    }
    return false;
  }, [generate, filename]);

  return { generate, download, share, status };
}
