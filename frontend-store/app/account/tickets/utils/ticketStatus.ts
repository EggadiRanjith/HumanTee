/**
 * Ticket Status Utility
 * Centralized status configuration
 */

import { FiMessageSquare, FiClock, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { TicketStatus } from '../types';

export const TICKET_STATUSES = {
    OPEN: 'open',
    IN_PROGRESS: 'in_progress',
    WAITING: 'waiting_on_customer',
    RESOLVED: 'resolved',
    CLOSED: 'closed'
} as const;

export function getStatusConfig(status: TicketStatus) {
    switch (status) {
        case 'open':
            return {
                bg: 'bg-blue-500/10',
                text: 'text-blue-400',
                label: 'Open',
                icon: FiMessageSquare
            };
        case 'in_progress':
            return {
                bg: 'bg-amber-500/10',
                text: 'text-amber-400',
                label: 'In Progress',
                icon: FiClock
            };
        case 'waiting_on_customer':
            return {
                bg: 'bg-purple-500/10',
                text: 'text-purple-400',
                label: 'Action Needed',
                icon: FiAlertCircle
            };
        case 'resolved':
            return {
                bg: 'bg-green-500/10',
                text: 'text-green-400',
                label: 'Resolved',
                icon: FiCheckCircle
            };
        case 'closed':
            return {
                bg: 'bg-white/10',
                text: 'text-white/40',
                label: 'Closed',
                icon: FiCheckCircle
            };
        default:
            return {
                bg: 'bg-white/5',
                text: 'text-white/40',
                label: status,
                icon: FiMessageSquare
            };
    }
}
