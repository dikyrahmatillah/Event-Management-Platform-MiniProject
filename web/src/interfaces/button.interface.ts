import React from "react";
import { ButtonVariant } from "@/types/button.type";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
  
}
