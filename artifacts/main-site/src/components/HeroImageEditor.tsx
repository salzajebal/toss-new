import { useState } from "react";
import { useRequestHeroImageUpload } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

type Props = {
  path: string;
  alt: string;
  preview: string | null;
  disabled: boolean;
  onUpload: (path: string, preview: string) => void;
  onRemove: () => void;
  onAltChange: (alt: string) => void;
  onBusyChange: (busy: boolean) => void;
};

export function HeroImageEditor(props: Props) {
  const [uploading, setUploading] = useState(false);
  const upload = useRequestHeroImageUpload();
  const { toast } = useToast();

  async function selectImage(file: File) {
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type) ||
        file.size > 10 * 1024 * 1024 || file.size < 1) {
      toast({ title: "JPG, PNG, WebP, GIF 이미지를 10MB 이하로 선택해주세요.", variant: "destructive" });
      return;
    }
    setUploading(true);
    props.onBusyChange(true);
    try {
      const { uploadURL, objectPath } = await upload.mutateAsync({
        data: { name: file.name, size: file.size, contentType: file.type as "image/jpeg" | "image/png" | "image/webp" | "image/gif" },
      });
      const result = await fetch(uploadURL, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
      if (!result.ok) throw new Error("Upload failed");
      props.onUpload(objectPath, URL.createObjectURL(file));
      toast({ title: "이미지 업로드 완료", description: "변경사항 저장을 눌러 홈페이지에 반영해주세요." });
    } catch {
      toast({ title: "이미지 업로드 실패", description: "기존 이미지는 유지됩니다. 다시 시도해주세요.", variant: "destructive" });
    } finally {
      setUploading(false);
      props.onBusyChange(false);
    }
  }

  return (
    <section className="bg-card border border-border/60 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-border/60">
        <h2 className="text-base font-black">홈페이지 상단 이미지</h2>
        <p className="text-xs text-muted-foreground mt-1">기존 히어로 대신 선택한 이미지만 표시됩니다.</p>
      </div>
      <div className="p-5 space-y-4">
        {props.path ? (
          <img src={props.preview || `/api/site/hero-image?v=${encodeURIComponent(props.path)}`}
            alt={props.alt || "상단 이미지 미리보기"} className="w-full h-auto max-h-96 object-contain rounded-lg bg-background" />
        ) : (
          <p className="p-8 text-center text-sm text-muted-foreground border border-dashed border-border rounded-lg">
            등록된 이미지가 없습니다. 홈페이지에는 빈 공간 없이 다음 내용이 표시됩니다.
          </p>
        )}
        <label htmlFor="hero-image-file" className="block text-sm font-semibold">이미지 선택</label>
        <input id="hero-image-file" type="file" accept="image/jpeg,image/png,image/webp,image/gif"
          disabled={uploading || props.disabled}
          className="block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-primary-foreground disabled:opacity-50"
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (file) void selectImage(file);
          }} />
        <p role="status" className="text-xs text-muted-foreground">
          {uploading ? "이미지 업로드 중..." : "JPG, PNG, WebP, GIF · 최대 10MB · 원본 비율을 유지하며 화면 너비에 맞춰 표시됩니다."}
        </p>
        <label htmlFor="hero-image-alt" className="block text-sm font-semibold">이미지 설명</label>
        <input id="hero-image-alt" value={props.alt} maxLength={200} disabled={props.disabled || uploading}
          placeholder="이미지 내용을 설명해주세요."
          onChange={(event) => props.onAltChange(event.target.value)}
          className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm" />
        {props.path && (
          <button type="button" disabled={uploading || props.disabled} onClick={props.onRemove}
            className="text-sm text-destructive underline disabled:opacity-50">이미지 제거</button>
        )}
        <p className="text-xs text-muted-foreground">이미지 변경·제거 후 아래의 ‘변경사항 저장’을 눌러주세요.</p>
      </div>
    </section>
  );
}
