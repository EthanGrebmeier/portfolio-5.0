"use client";
import React from "react";
import { useMediaQuery } from "usehooks-ts";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "./dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { cn } from "~/helpers/cn";

type ResponsiveDialogProps = {
  children: React.ReactNode;
  title: string;
  description?: string;
  trigger: React.ReactNode;
  bodyClassName?: string;
  headerClassName?: string;
};

const ResponsiveDialog = ({
  children,
  title,
  description,
  trigger,
  bodyClassName,
  headerClassName,
}: ResponsiveDialogProps) => {
  const [showDialog, setShowDialog] = React.useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className={bodyClassName}>
          <DialogHeader className={cn(headerClassName)}>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
          <div>{children}</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={showDialog} onOpenChange={setShowDialog}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className={cn(headerClassName)}>
          <DrawerTitle>{title}</DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>
        <div className={cn("p-4", bodyClassName)}>{children}</div>
      </DrawerContent>
    </Drawer>
  );
};

export default ResponsiveDialog;
