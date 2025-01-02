import Link from "next/link";
import { Button } from "../ui/button";

interface CreateButtonProps {
  label: string;
  url: string;
  className?: string;
}

const CreateButton = ({ label, url, className }: CreateButtonProps) => {
  return (
    <Link className="" href={url}>
      <Button className={className}>{label}</Button>
    </Link>
  );
};

export default CreateButton;
