import { 
    calculatePassengerLTV, 
    resolveTicketUrgency, 
    calculateSLARemaining, 
    analyzeMessageSentiment,
    formatPassengerId,
    maskPhoneNumber
} from './clients.utils';

/**
 * 👑 AYABUS CLIENT CENTRE (Level 1: The Brains - Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Clients
 * File: clients.service.js
 * * DESCRIPTION:
 * The Omniscient Data Engine. Fetches raw data (simulated backend) and 
 * pipes it through the utility mathematical processors before handing it 
 * to the Level 4/5 React UI Hubs.
 */

// ========================================================================
// HIGH-FIDELITY MOCK DATABASE (Pre-Backend Integration)
// ========================================================================

// Dynamic Time Generators to ensure SLAs are always active for UI testing
const now = Date.now();
const minutesAgo = (mins) => new Date(now - (mins * 60000)).toISOString();

const MOCK_PASSENGERS = [
    { id: 8991, name: 'Kato Paul', phone: '+256772123456', email: 'kato.p@example.com', lifetimeSpend: 5200000, lastActive: minutesAgo(12), activeStatus: 'ON_ROUTE', currentBus: 'UBL-882A', currentRoute: 'Kampala → Gulu' },
    { id: 8992, name: 'Nalubega Sarah', phone: '+256752987654', email: 'sarah.n@example.com', lifetimeSpend: 2150000, lastActive: minutesAgo(1440), activeStatus: 'IDLE', currentBus: null, currentRoute: null },
    { id: 8993, name: 'Ochieng David', phone: '+256782555444', email: 'ochieng.d@example.com', lifetimeSpend: 650000, lastActive: minutesAgo(4320), activeStatus: 'IDLE', currentBus: null, currentRoute: null },
    { id: 8994, name: 'Auma Grace', phone: '+256702111222', email: 'grace.a@example.com', lifetimeSpend: 45000, lastActive: minutesAgo(5), activeStatus: 'ON_ROUTE', currentBus: 'UBM-104K', currentRoute: 'Kampala → Mbarara' },
    { id: 8995, name: 'Mugisha Brian', phone: '+256777888999', email: 'brian.m@example.com', lifetimeSpend: 0, lastActive: minutesAgo(2), activeStatus: 'BOARDING', currentBus: 'UBJ-990C', currentRoute: 'Entebbe → Kampala' }
];

const MOCK_TICKETS = [
    {
        id: 'TCK-CX-101',
        passengerId: 8991, // Kato (SOVEREIGN VIP)
        categoryId: 'GENERAL_INQUIRY', // Low priority normally...
        subject: 'Can I bring extra luggage on the 14:00 bus?',
        createdAt: minutesAgo(3),
        status: 'OPEN',
        channel: 'WHATSAPP',
        messages: [
            { id: 1, sender: 'CLIENT', text: 'Hi, I have 3 heavy bags today. Will they fit on the Gulu bus?', timestamp: minutesAgo(3) }
        ]
    },
    {
        id: 'TCK-CX-102',
        passengerId: 8994, // Grace (STANDARD)
        categoryId: 'EMERGENCY_SAFETY', // Critical priority!
        subject: 'Driver is overspeeding near Karuma',
        createdAt: minutesAgo(1), // Just came in
        status: 'OPEN',
        channel: 'APP_SOS',
        messages: [
            { id: 1, sender: 'CLIENT', text: 'Please help, the driver on UBM-104K is speeding and driving very reckless. People are complaining.', timestamp: minutesAgo(1) }
        ]
    },
    {
        id: 'TCK-CX-103',
        passengerId: 8992, // Sarah (PLATINUM)
        categoryId: 'FINANCIAL_DISPUTE',
        subject: 'Double charge on MTN MoMo',
        createdAt: minutesAgo(45), // Pushing SLA limits
        status: 'PENDING_AGENT',
        channel: 'WEB',
        messages: [
            { id: 1, sender: 'CLIENT', text: 'My mobile money was deducted twice for the Mbarara ticket yesterday. I need a refund immediately.', timestamp: minutesAgo(45) },
            { id: 2, sender: 'SYSTEM', text: 'Automated Bot: We have received your query and are checking the Treasury ledger.', timestamp: minutesAgo(44) }
        ]
    }
];

// ========================================================================
// THE SOVEREIGN SERVICE CLASS
// ========================================================================
class ClientService {
    
    /**
     * Simulates network latency for realistic UI loading states.
     */
    async _delay(ms = 600) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ------------------------------------------------------------------------
    // MACRO DIRECTORY FETCHERS
    // ------------------------------------------------------------------------

    /**
     * Fetches all registered passengers and mathematically appends their LTV status.
     * Used by the PassengerMatrix.jsx
     */
    async getPassengerDirectory(filters = {}, page = 1, limit = 50) {
        await this._delay(400); // Network simulation
        
        let results = [...MOCK_PASSENGERS];

        // Process data through the utility engine
        const processed = results.map(pax => {
            const ltvTier = calculatePassengerLTV(pax.lifetimeSpend);
            return {
                ...pax,
                formattedId: formatPassengerId(pax.id),
                maskedPhone: maskPhoneNumber(pax.phone),
                ltvTier: ltvTier,
                isVip: ltvTier.id === 'SOVEREIGN' || ltvTier.id === 'PLATINUM'
            };
        });

        // Filter by VIP status if requested
        if (filters.vipOnly) {
            return { data: processed.filter(p => p.isVip), total: processed.filter(p => p.isVip).length, totalPages: 1 };
        }

        return { data: processed, total: processed.length, totalPages: 1 };
    }

    /**
     * Fetches the complete micro-dossier for a specific passenger.
     * Used by PassengerDossier.jsx
     */
    async getPassengerProfile(passengerId) {
        await this._delay(300);
        const pax = MOCK_PASSENGERS.find(p => p.id === passengerId);
        if (!pax) throw new Error("Passenger not found in registry.");

        const ltvTier = calculatePassengerLTV(pax.lifetimeSpend);
        
        // Return heavily enriched dossier
        return {
            ...pax,
            formattedId: formatPassengerId(pax.id),
            maskedPhone: maskPhoneNumber(pax.phone),
            ltvTier,
            walletBalance: pax.lifetimeSpend > 1000000 ? 55000 : 0, // Mock wallet data
            activeTickets: MOCK_TICKETS.filter(t => t.passengerId === passengerId).length,
            telemetry: pax.activeStatus === 'ON_ROUTE' ? {
                speedKmH: 82,
                partnerHealth: 94,
                driverName: 'Kibirige John',
                etaMinutes: 145
            } : null
        };
    }

    // ------------------------------------------------------------------------
    // OMNICHANNEL HELPDESK FETCHERS (The Omniscient Engine)
    // ------------------------------------------------------------------------

    /**
     * Fetches the inbox queue, automatically escalating VIPs and sorting by SLA urgency.
     * Used by OmniInbox.jsx
     */
    async getOmniInboxTickets(filters = {}) {
        await this._delay(500);

        const processedTickets = MOCK_TICKETS.map(ticket => {
            const pax = MOCK_PASSENGERS.find(p => p.id === ticket.passengerId);
            const ltvTier = calculatePassengerLTV(pax?.lifetimeSpend || 0);
            
            // 1. Resolve Urgency & Escalate VIPs
            const urgency = resolveTicketUrgency(ticket.categoryId, ltvTier);
            
            // 2. Calculate Live SLA Timers
            const slaTracker = calculateSLARemaining(ticket.createdAt, urgency.activeSlaMinutes);

            // 3. Extract NLP Sentiment from the first message
            const sentiment = analyzeMessageSentiment(ticket.messages[0].text);

            return {
                ...ticket,
                passenger: {
                    name: pax?.name || 'Unknown',
                    ltvTier: ltvTier,
                    isMoving: pax?.activeStatus === 'ON_ROUTE'
                },
                urgency,
                slaTracker,
                sentiment
            };
        });

        // The Ultimate Sorting Algorithm:
        // 1st: Breached SLAs
        // 2nd: Emergency Priority
        // 3rd: Escalate VIPs
        // 4th: Shortest SLA remaining
        processedTickets.sort((a, b) => {
            if (a.slaTracker.status === 'BREACHED' && b.slaTracker.status !== 'BREACHED') return -1;
            if (b.slaTracker.status === 'BREACHED' && a.slaTracker.status !== 'BREACHED') return 1;
            
            const priorityWeight = { 'CRITICAL': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
            const pA = priorityWeight[a.urgency.effectivePriority] || 0;
            const pB = priorityWeight[b.urgency.effectivePriority] || 0;
            if (pA !== pB) return pB - pA; // Descending priority

            return parseInt(a.slaTracker.text) - parseInt(b.slaTracker.text); // Lowest time remaining first
        });

        // Filter out closed if needed
        if (filters.status === 'OPEN') {
            return processedTickets.filter(t => t.status !== 'CLOSED' && t.status !== 'RESOLVED');
        }

        return processedTickets;
    }

    /**
     * Fetches a specific chat thread and its linked telemetry context.
     * Used by ResolutionWorkspace.jsx
     */
    async getTicketThread(ticketId) {
        await this._delay(200);
        const ticket = MOCK_TICKETS.find(t => t.id === ticketId);
        if (!ticket) throw new Error("Ticket not found.");

        const pax = await this.getPassengerProfile(ticket.passengerId);
        const urgency = resolveTicketUrgency(ticket.categoryId, pax.ltvTier);
        const slaTracker = calculateSLARemaining(ticket.createdAt, urgency.activeSlaMinutes);
        
        // Analyze entire thread sentiment
        const allText = ticket.messages.map(m => m.text).join(' ');
        const threadSentiment = analyzeMessageSentiment(allText);

        return {
            ...ticket,
            passenger: pax,
            urgency,
            slaTracker,
            sentiment: threadSentiment
        };
    }
}

// Export a singleton instance
export const clientService = new ClientService();