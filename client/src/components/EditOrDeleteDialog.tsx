import { Dialog } from "@radix-ui/react-dialog";
import { PenBox, Trash2 } from "lucide-react";
import { FC, ReactNode } from "react";
import { DIALOG_DESCRIPTION } from "../schema/quiz";
import TooltipComponent from "./Tooltip-component";
import { Button } from "./ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

type EditDialogProps = {
  name: string;
  description: keyof typeof DIALOG_DESCRIPTION;
  children?: ReactNode;
};

const EditDialog: FC<EditDialogProps> = ({ name, description, children }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <TooltipComponent variant="ghost" content={`Modifier ${name}`}>
          <PenBox size={19} />
        </TooltipComponent>
      </DialogTrigger>
      <DialogContent className="space-y-2">
        <DialogHeader>
          <DialogTitle>{`Modifier ${name}`}</DialogTitle>
          <DialogDescription className="py-4">
            {DIALOG_DESCRIPTION[description]}
          </DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

type DeleteDialogProps = {
  name: string;
  disabled?: boolean;
  onClick?: () => void;
};

const DeleteDialog: FC<DeleteDialogProps> = ({ name, disabled, onClick }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <TooltipComponent variant="ghost" content={`Supprimer ${name}`}>
          <Trash2 size={19} />
        </TooltipComponent>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Êtes-vous vraiment sûr ?</DialogTitle>
          <DialogDescription>
            Cette élément sera supprimer définitivement si vous le confirmer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>
            <Button variant="secondary">Annuler</Button>
          </DialogClose>
          <DialogClose>
            <Button variant="outline" disabled={disabled} onClick={onClick}>
              Continuer
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

type EditOrDeleteDialogProps = {
  edit?: boolean;
  name: string;
  description: keyof typeof DIALOG_DESCRIPTION;
  children?: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
};

const EditOrDeleteDialog: FC<EditOrDeleteDialogProps> = ({
  edit = false,
  children,
  name,
  description,
  disabled,
  onClick,
}) => {
  return (
    <>
      {edit ? (
        <EditDialog name={name} description={description}>
          {children}
        </EditDialog>
      ) : (
        <DeleteDialog name={name} disabled={disabled} onClick={onClick} />
      )}
    </>
  );
};

export default EditOrDeleteDialog;
