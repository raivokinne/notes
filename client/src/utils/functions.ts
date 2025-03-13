import axios from "axios";
import { format, parseISO } from "date-fns";

export async function csrf() {
    try {
        const res = await axios.get('http://localhost:8000/sanctum/csrf-cookie');
        return res
    } catch (error) {
        console.log(error);
    }
}

export const formatDate = (dateString: string) => {
    try {
        const date = parseISO(dateString);
        return format(date, "MMM d, yyyy 'at' h:mm a");
    } catch (error) {
        return dateString;
    }
};