"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { useParams } from "next/navigation";

import { useCoverImage } from "@/hooks/use-cover-image";
import { Id } from "@/convex/_generated/dataModel";
import { useEdgeStore } from "@/lib/edgestore";
import { api } from "@/convex/_generated/api";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { SingleImageDropzone } from "@/components/single-image-dropzone";

export const CoverImageModal = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const update = useMutation(api.documents.update);
  const [file, setFile] = useState<File>();
  const { edgestore } = useEdgeStore();
  const coverImage = useCoverImage();
  const params = useParams();

  const onClose = () => {
    setFile(undefined);
    setIsSubmitting(false);
    coverImage.onClose();
  };

  const onChange = async (file?: File) => {
    if (file) {
      setIsSubmitting(true);
      setFile(file);

      let options: any = {};

      if (coverImage.data) {
        options.replaceTargetUrl = coverImage.data.url;
      }

      const res = await edgestore.publicFiles.upload({
        file,
        options,
      });

      await update({
        id: params.documentId as Id<"documents">,
        coverImage: res.url,
      });

      onClose();
    }
  };

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">Cover Image</h2>
        </DialogHeader>
        <div>
          <SingleImageDropzone
            value={file}
            onChange={onChange}
            disabled={isSubmitting}
            className="w-full outline-none"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
