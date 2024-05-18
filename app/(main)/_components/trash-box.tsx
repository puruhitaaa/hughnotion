"use client";

import { useMutation, useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { SearchIcon, TrashIcon, UndoIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import { Input } from "@/components/ui/input";
import { Hint } from "@/components/hint";

interface ITrashBoxProps {}

export const TrashBox = ({}: ITrashBoxProps) => {
  const router = useRouter();
  const params = useParams();
  const documents = useQuery(api.documents.getArchived);
  const removeDocument = useMutation(api.documents.remove);
  const unarchiveDocument = useMutation(api.documents.unarchive);
  const removeAllDocuments = useMutation(api.documents.removeAll);

  const [search, setSearch] = useState("");

  const filteredDocuments =
    documents?.filter((document) =>
      document.title.toLowerCase().includes(search.toLowerCase())
    ) ?? [];

  const handleClick = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };
  const handleUnarchive = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    documentId: Id<"documents">
  ) => {
    e.stopPropagation();
    const unarchiveDocPromise = unarchiveDocument({ id: documentId });

    toast.promise(unarchiveDocPromise, {
      loading: "Restoring note...",
      success: "Note restored!",
      error: "Failed to restore note.",
    });
  };
  const handleRemove = async (documentId: Id<"documents">) => {
    const deleteDocPromise = removeDocument({ id: documentId }).then(() => {
      if (params.documentId === documentId) {
        router.push("/documents");
      }
    });

    toast.promise(deleteDocPromise, {
      loading: "Deleting note...",
      success: "Note deleted!",
      error: "Failed to deleted note.",
    });
  };
  const handleRemoveAll = async () => {
    const removeAllPromise = removeAllDocuments({}).then(() => {});

    toast.promise(removeAllPromise, {
      loading: "Deleting all trashed notes...",
      success: "All notes removed from trash!",
      error: "Failed to delete all trash notes.",
    });
    router.push("/documents");
  };

  if (!documents) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-1 p-2">
        <SearchIcon className="h-4 w-4" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
          placeholder="Filter by page title..."
        />
        <ConfirmModal onConfirm={handleRemoveAll}>
          <Button variant="destructive" size="xs">
            <Hint description="Empty Trash" side="bottom" sideOffset={10}>
              <TrashIcon className="h-4 w-4" />
            </Hint>
          </Button>
        </ConfirmModal>
      </div>
      <div className="mt-2 px-1 pb-1 max-h-[400px] overflow-auto">
        <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
          No documents found...
        </p>
        {filteredDocuments.map((document) => (
          <div
            role="button"
            key={document._id}
            onClick={() => handleClick(document._id)}
            className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary justify-between"
          >
            <span className="truncate pl-2">{document.title}</span>
            <div className="flex items-center">
              <div
                role="button"
                className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                onClick={(e) => handleUnarchive(e, document._id)}
              >
                <UndoIcon className="h-4 w-4" />
              </div>
              <ConfirmModal onConfirm={() => handleRemove(document._id)}>
                <div
                  role="button"
                  className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                >
                  <TrashIcon className="h-4 w-4" />
                </div>
              </ConfirmModal>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
