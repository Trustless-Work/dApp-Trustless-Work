import Link from "next/link";
import { Button } from "../../ui/button";

interface CreateButtonProps {
  label: string;
  url: string;
  className?: string;
  id?: string;
}

const CreateButton = ({ label, url, className, id }: CreateButtonProps) => {
  return (
    <Link href={url} id={id || ""}>
      <Button className={className}>{label}</Button>
    </Link>
  );
};

export default CreateButton;
