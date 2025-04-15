import Link from "next/link";
import { Button } from "../../ui/button";
import { Plus } from "lucide-react";

interface CreateButtonProps {
  label: string;
  url: string;
  className?: string;
  id?: string;
}

const CreateButton = ({ label, url, className, id }: CreateButtonProps) => {
  return (
    <Link href={url} id={id || ""}>
      <Button className={className}>
        <Plus />
        {label}
      </Button>
    </Link>
  );
};

export default CreateButton;
