import Link from "next/link";
import { Button } from "@/ui/button";
import { Plus } from "lucide-react";

interface CreateButtonProps {
  label: string;
  url: string;
  id?: string;
}

const CreateButton = ({ label, url, id }: CreateButtonProps) => {
  return (
    <Link href={url} id={id || ""}>
      <Button className="flex items-center gap-2 px-4 py-2 text-xs text-primary-700 dark:text-primary-300 bg-primary-50 border border-primary-200 dark:border-primary-700/50 rounded-lg hover:bg-primary-50 dark:bg-primary-900/50 dark:hover:bg-primary-900 transition-colors duration-200 w-full sm:w-auto">
        <Plus />
        {label}
      </Button>
    </Link>
  );
};

export default CreateButton;
