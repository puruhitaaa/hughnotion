"use client";

import { useUser } from "@clerk/clerk-react";
import { useParams, useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import {
  PlusIcon,
  TrashIcon,
  LucideIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";

import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";

import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface IItemProps {
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  level?: number;
  expanded?: boolean;
  isSearch?: boolean;
  id?: Id<"documents">;
  documentIcon?: string;
  onExpand?: () => void;
}

export const Item = ({
  id,
  label,
  onClick,
  expanded,
  isSearch,
  onExpand,
  level = 0,
  icon: Icon,
  documentIcon,
}: IItemProps) => {
  const ChevronIcon = expanded ? ChevronDownIcon : ChevronRightIcon;
  const createDocument = useMutation(api.documents.create);
  const archiveDocument = useMutation(api.documents.archive);
  const router = useRouter();
  const params = useParams();
  const { user } = useUser();

  const isActive = id && params.documentId === id;

  const handleExpand = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    onExpand && onExpand();
  };

  const handleCreate = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (!id) return;
    const createDocPromise = createDocument({
      title: "Untitled",
      parentDocument: id,
    }).then((documentId) => {
      if (!expanded && onExpand) onExpand();
      router.push(`/documents/${documentId}`);
    });

    toast.promise(createDocPromise, {
      loading: "Creating a new note...",
      success: "Note created!",
      error: "Something went wrong while creating a note.",
    });
  };

  const handleArchive = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (!id) return;
    const archiveDocPromise = archiveDocument({ id }).then(() => {
      router.push(`/documents`);
    });

    toast.promise(archiveDocPromise, {
      loading: "Moving to trash...",
      success: "Note moved to trash!",
      error: "Failed to archive note.",
    });
  };

  return (
    <div
      onClick={onClick}
      role="button"
      style={{ paddingLeft: `${(level + 1) * 12}px` }}
      className={cn(
        "group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium cursor-pointer",
        isActive && "bg-muted-foreground/5 text-primary"
      )}
    >
      {!!id && (
        <div
          role="button"
          onClick={handleExpand}
          className="h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1 cursor-pointer"
        >
          <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
        </div>
      )}
      {documentIcon ? (
        <div className="w-[18px] shrink-0 mr-2 text-[18px]">{documentIcon}</div>
      ) : (
        <Icon className="shrink-0 w-[18px] h-[18px] mr-2 text-muted-foreground" />
      )}
      <span className={cn("truncate", isActive && "font-bold")}>{label}</span>
      {isSearch && (
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-sm">⌘</span>K
        </kbd>
      )}
      {!!id && (
        <div className="ml-auto flex items-center gap-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <div
                role="button"
                className="opacity-0 group-hover:opacity-100 ml-auto h-full rounded-sm hover:bg-neutral-300 hover:dark:bg-neutral-600"
              >
                <MoreHorizontalIcon className="h-4 w-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-60"
              align="start"
              side="right"
              forceMount
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenuItem
                onClick={handleArchive}
                className="cursor-pointer"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <p className="text-xs text-muted-foreground p-2">
                last edited by {user?.fullName}
              </p>
            </DropdownMenuContent>
          </DropdownMenu>
          <div
            onClick={handleCreate}
            role="button"
            className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 cursor-pointer"
          >
            <PlusIcon className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  );
};

Item.Skeleton = function ItemSkeleton({ level = 0 }: { level?: number }) {
  return (
    <div
      style={{
        paddingLeft: `${(level + 1) * 12}px`,
      }}
      className="w-full flex gap-x-2 py-[3px]"
    >
      <Skeleton className="h-4 w-4 " />
      <Skeleton className="h-4 w-[30%]" />
    </div>
  );
};
