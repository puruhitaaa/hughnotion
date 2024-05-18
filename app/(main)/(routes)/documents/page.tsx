"use client";
import { useUser } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";

import { Button } from "@/components/ui/button";

const DocumentsPage = () => {
  const createDocument = useMutation(api.documents.create);
  const router = useRouter();
  const { user } = useUser();

  const handleCreateDocument = async () => {
    const createDocPromise = createDocument({
      title: "Untitled",
    }).then((documentId) => {
      router.push(`/documents/${documentId}`);
    });
    toast.promise(createDocPromise, {
      loading: "Creating a new note...",
      success: "Note created!",
      error: "Something went wrong while creating a note.",
    });
  };

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image
        src="/empty.png"
        width={300}
        height={300}
        alt="Empty Documents Page"
        className="dark:hidden"
      />
      <Image
        src="/empty-dark.png"
        width={300}
        height={300}
        alt="Empty Dark Documents Page"
        className="dark:block hidden"
      />
      <h2 className="text-lg font-medium">
        Welcome to {user?.firstName}&apos;s Hughnotion!
      </h2>
      <Button onClick={handleCreateDocument}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Create Note
      </Button>
    </div>
  );
};

export default DocumentsPage;
