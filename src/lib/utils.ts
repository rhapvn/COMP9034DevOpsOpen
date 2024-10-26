import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatPlaceTag(tag: string) {
  let formatted = tag.charAt(0).toUpperCase() + tag.slice(1);
  if (tag === 'researchCentre') {
    formatted = 'Research Centre';
  }
  return formatted.replace(/([A-Z])/g, ' $1').trim();
}

export function formatUserRole(role: string) {
  switch(role) {
    case 'admin': return "Administrator";
    case 'approver': return "Higher Approver";
    case 'storage': return "Stock Control";
    default: return role.charAt(0).toUpperCase() + role.slice(1);
  }
}