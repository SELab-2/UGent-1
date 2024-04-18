import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const PRIMARY_COLOR = "#1976d2";

export const displayRole = (roleNumber: number) => {
    switch (roleNumber) {
        case 1:
            return "Admin";
        case 2:
            return "Teacher";
        case 3:
            return "Student";
        default:
            return "Unknown";
    }
};
