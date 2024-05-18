"use client";

import { useMutation } from "convex/react";
import { CheckIcon, CopyIcon, GlobeIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Doc } from "@/convex/_generated/dataModel";
import { useOrigin } from "@/hooks/use-origin";
import { api } from "@/convex/_generated/api";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface IPublishProps {
  initialData: Doc<"documents">;
}
export const Publish = ({ initialData }: IPublishProps) => {
  const updateDocument = useMutation(api.documents.update);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const origin = useOrigin();

  const url = `${origin}/preview/${initialData._id}`;

  const onPublishChange = (isPublished: boolean) => {
    setIsSubmitting(true);

    const updatePromise = updateDocument({
      id: initialData._id,
      isPublished,
    }).finally(() => setIsSubmitting(false));

    toast.promise(updatePromise, {
      loading: isPublished ? "Publishing..." : "Unpublishing...",
      success: isPublished ? "Published!" : "Unpublished!",
      error: "Something went wrong!",
    });
  };

  const onCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Copied to clipboard!");
    });
    setCopied(true);

    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="ghost">
          {initialData.isPublished ? (
            <>
              Published
              <GlobeIcon className="w-4 h-4 ml-2 text-sky-400" />
            </>
          ) : (
            "Publish"
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent forceMount align="end" alignOffset={8} className="w-72">
        {initialData.isPublished ? (
          <div className="space-y-4">
            <div className="flex items-center gap-x-2">
              <GlobeIcon className="h-4 w-4 text-sky-500 animate-pulse" />
              <p className="text-xs font-medium text-sky-500">
                This note is live on web.
              </p>
            </div>
            <div className="flex items-center">
              <input
                value={url}
                disabled
                className="flex-1 px-2 text-xs border rounded-l-md h-8 bg-muted truncate"
              />
              <Button
                onClick={onCopy}
                disabled={copied}
                className="rounded-l-none h-8"
              >
                {copied ? (
                  <CheckIcon className="w-4 h-4" />
                ) : (
                  <CopyIcon className="w-4 h-4" />
                )}
              </Button>
            </div>
            <Button
              size="sm"
              disabled={isSubmitting}
              className="w-full text-xs"
              onClick={() => onPublishChange(false)}
            >
              Unpublish
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <GlobeIcon className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm font-medium mb-2">Publish this note</p>
            <span className="text-xs text-muted-foreground mb-4">
              Share you work with others.
            </span>
            <Button
              size="sm"
              disabled={isSubmitting}
              className="w-full text-xs"
              onClick={() => onPublishChange(true)}
            >
              Publish
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
