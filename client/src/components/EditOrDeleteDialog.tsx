import { Dialog } from "@radix-ui/react-dialog";
import clsx from "clsx";
import { PenBox, Trash2 } from "lucide-react";
import { FC, ReactNode } from "react";
import { DIALOG, DIALOG_DESCRIPTION } from "../schema/quiz";
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
  name: keyof typeof DIALOG;
  description?: keyof typeof DIALOG_DESCRIPTION;
  children?: ReactNode;
  className?: string;
};

const EditDialog: FC<EditDialogProps> = ({
  name,
  description,
  children,
  className,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <TooltipComponent variant="ghost" content={`Modifier ${DIALOG[name]}`}>
          <PenBox size={19} />
        </TooltipComponent>
      </DialogTrigger>
      <DialogContent className={clsx("space-y-2", className)}>
        <DialogHeader>
          <DialogTitle>{`Modifier ${DIALOG[name]}`}</DialogTitle>
          <DialogDescription className="py-4">
            {description ? DIALOG_DESCRIPTION[description] : null}
          </DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

type DeleteDialogProps = {
  name: keyof typeof DIALOG;
  disabled?: boolean;
  onClick?: () => void;
};

const DeleteDialog: FC<DeleteDialogProps> = ({ name, disabled, onClick }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <TooltipComponent variant="ghost" content={`Supprimer ${DIALOG[name]}`}>
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
  name: keyof typeof DIALOG;
  description?: keyof typeof DIALOG_DESCRIPTION;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
};

const EditOrDeleteDialog: FC<EditOrDeleteDialogProps> = ({
  edit = false,
  name,
  description,
  children,
  className,
  disabled,
  onClick,
}) => {
  return (
    <>
      {edit ? (
        <EditDialog name={name} description={description} className={className}>
          {children}
        </EditDialog>
      ) : (
        <DeleteDialog name={name} disabled={disabled} onClick={onClick} />
      )}
    </>
  );
};

export default EditOrDeleteDialog;
