export default function formatDate(date: Date) {
        const today = new Date();
        const yesterday = new Date();

        today.setHours(0, 0, 0, 0);
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);

        const created = new Date(date);
        created.setHours(0, 0, 0, 0);

        if (created.getTime() === today.getTime()) return "Today"
        if (created.getTime() === yesterday.getTime()) return "Yesterday"

        return created.toLocaleString();
    }