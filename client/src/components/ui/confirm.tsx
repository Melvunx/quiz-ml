import { ConfirmDialog } from "react-confirm";
import { Button } from "./button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";

type ConfirmationProps = {
  confirmation: string;
  title?: string;
  description?: string;
};

const Confirmation: ConfirmDialog<ConfirmationProps, boolean> = ({
  show,
  cancel,
  proceed,
  title = "Êtes-vous sur de faire cela ?",
  description = "Vous perdrez toute votre progression lors du quiz.",
  confirmation,
}) => {
  return (
    <Dialog open={show}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {confirmation}
        <DialogFooter>
          <DialogClose>
            <Button
              variant="secondary"
              onClick={(e) => {
                e.preventDefault();
                cancel();
              }}
            >
              Annuler
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={(e) => {
              e.preventDefault();
              proceed(true);
            }}
          >
            Confirmer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Confirmation;
