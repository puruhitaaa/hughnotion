"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { FileIcon } from "lucide-react";
import { useState } from "react";

import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";

import { Item } from "./item";

interface IDocumentListProps {
  parentDocumentId?: Id<"documents">;
  level?: number;
}

export const DocumentList = ({
  level = 0,
  parentDocumentId,
}: IDocumentListProps) => {
  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const handleExpand = (id: Id<"documents">) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const documents = useQuery(api.documents.get, {
    parentDocument: parentDocumentId,
  });

  const onRedirect = (id: Id<"documents">) => {
    router.push(`/documents/${id}`);
  };

  if (!documents) {
    return (
      <>
        <Item.Skeleton level={level} />
        {level === 0 && (
          <>
            <Item.Skeleton level={level} />
            <Item.Skeleton level={level} />
          </>
        )}
      </>
    );
  }

  return (
    <>
      <div
        style={{
          paddingLeft: `${(level + 2) * 12}px`,
        }}
        className={cn(
          "hidden text-sm font-medium text-muted-foreground/80",
          expanded && "last:block",
          level === 0 && "hidden last:hidden"
        )}
      >
        <p>No pages inside</p>
      </div>
      {documents.map((document) => (
        <div key={document._id}>
          <Item
            level={level}
            icon={FileIcon}
            id={document._id}
            label={document.title}
            documentIcon={document.icon}
            expanded={expanded[document._id]}
            onClick={() => onRedirect(document._id)}
            onExpand={() => handleExpand(document._id)}
          />
          {expanded[document._id] && (
            <DocumentList level={level + 1} parentDocumentId={document._id} />
          )}
        </div>
      ))}
    </>
  );
};
