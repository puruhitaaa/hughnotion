"use client";

import { ImageIcon, XIcon } from "lucide-react";
import { useMutation } from "convex/react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";

import { useCoverImage } from "@/hooks/use-cover-image";
import { Id } from "@/convex/_generated/dataModel";
import { useEdgeStore } from "@/lib/edgestore";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface ICoverProps {
  url?: string;
  preview?: boolean;
}

export const Cover = ({ url, preview }: ICoverProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { edgestore } = useEdgeStore();
  const coverImage = useCoverImage();
  const params = useParams();

  const removeCoverImage = useMutation(api.documents.removeCoverImage);

  const onRemoveCoverImage = async () => {
    setIsLoading(true);

    const promises = [];
    if (url) {
      const removeFileFromEdgePromise = edgestore.publicFiles.delete({
        url,
      });
      promises.push(removeFileFromEdgePromise);
    }

    const removeCoverPromise = removeCoverImage({
      id: params.documentId as Id<"documents">,
    });
    promises.push(removeCoverPromise);

    const promise = Promise.all(promises).finally(() => {
      setIsLoading(false);
    });

    toast.promise(promise, {
      loading: "Removing cover image...",
      success: "Cover image removed",
      error: "Failed to remove cover image",
    });
  };

  return (
    <div
      className={cn(
        "relative w-full h-[35vh] group",
        !url && "h-[12vh]",
        url && "bg-muted"
      )}
    >
      {!!url && <Image src={url} fill alt="Cover" className="object-cover" />}
      {!!url && !preview && (
        <div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2">
          <Button
            size="sm"
            variant="outline"
            disabled={isLoading}
            onClick={() => coverImage.onOpen({ url })}
            className="text-muted-foreground text-xs"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Change Cover
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={isLoading}
            onClick={onRemoveCoverImage}
            className="text-muted-foreground text-xs"
          >
            <XIcon className="h-4 w-4 mr-2" />
            Remove
          </Button>
        </div>
      )}
    </div>
  );
};

Cover.Skeleton = function CoverSkeleton() {
  return <Skeleton className="w-full h-[12vh] rounded-none mt-12" />;
};
