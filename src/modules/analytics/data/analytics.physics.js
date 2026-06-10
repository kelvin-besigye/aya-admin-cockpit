/**
 * 👑 AYABUS TEMPORAL PHYSICS ENGINE (v3.0 Sovereign)
 * ------------------------------------------------------------------
 * Module: Analytics & Intelligence Centre
 * File: analytics.physics.js
 * * DESCRIPTION:
 * The pure mathematical core. Transforms raw database arrays into 
 * military-grade telemetry (Deltas, Capture Rates, Matrix Rankings).
 * Strictly decoupled from the UI.
 */

export const AnalyticsPhysics = {

    // ========================================================================
    // 1. TEMPORAL DELTA CALCULATOR (The Relativity Engine)
    // ========================================================================
    /**
     * Calculates the percentage change between two time periods.
     * Includes failsafes for Infinity (div-by-zero) when previous period was 0.
     */
    calculateDelta: (currentValue, previousValue) => {
        if (previousValue === 0) {
            return { value: currentValue > 0 ? 100 : 0, formatted: currentValue > 0 ? '+100%' : '0%', trend: currentValue > 0 ? 'UP' : 'FLAT' };
        }
        const delta = ((currentValue - previousValue) / previousValue) * 100;
        const rounded = Math.round(delta * 10) / 10;
        
        return {
            value: rounded,
            formatted: rounded > 0 ? `+${rounded}%` : `${rounded}%`,
            trend: rounded > 0 ? 'UP' : (rounded < 0 ? 'DOWN' : 'FLAT')
        };
    },

    // ========================================================================
    // 2. ZONE 1: GLOBAL TELEMETRY (The Pulse)
    // ========================================================================
    /**
     * Calculates the exact operational state of the entire network.
     * @param {Array} currentTickets - Tickets for the selected time window
     * @param {Array} previousTickets - Tickets for the comparative time window
     * @param {Number} activeNetworkCapacity - Total physical seats available on dispatched buses
     */
    computeGlobalTelemetry: (currentTickets = [], previousTickets = [], activeNetworkCapacity = 1) => {
        // 1. Souls in Transit (Valid, unscanned + boarded humans)
        const currentSouls = currentTickets.filter(t => t.status === 'ISSUED' || t.status === 'BOARDED').length;
        const prevSouls = previousTickets.filter(t => t.status === 'ISSUED' || t.status === 'BOARDED').length;

        // 2. Platform Capture Rate (How much of the total market we control)
        const currentCapacitySafe = activeNetworkCapacity > 0 ? activeNetworkCapacity : 1;
        const currentCapture = (currentSouls / currentCapacitySafe) * 100;
        const prevCapture = previousTickets.length > 0 ? (prevSouls / currentCapacitySafe) * 100 : 0; // Simplified prev capacity assumption

        // 3. The No-Show Index (Drop-off Rate)
        const totalExpected = currentTickets.filter(t => t.status !== 'CANCELLATION_REQUESTED' && t.status !== 'REFUND_SETTLED').length;
        const totalBoarded = currentTickets.filter(t => t.status === 'BOARDED').length;
        const noShowRate = totalExpected > 0 ? ((totalExpected - totalBoarded) / totalExpected) * 100 : 0;

        // 4. Booking Velocity (Assuming a 24-hour baseline for "TODAY" metric)
        const velocityPerHour = Math.round((currentTickets.length / 24) * 10) / 10;

        return {
            soulsInTransit: { current: currentSouls, delta: AnalyticsPhysics.calculateDelta(currentSouls, prevSouls) },
            captureRate: { current: Math.round(currentCapture * 10)/10, delta: AnalyticsPhysics.calculateDelta(currentCapture, prevCapture) },
            noShowIndex: { current: Math.round(noShowRate * 10)/10, status: noShowRate > 10 ? 'WARNING' : 'HEALTHY' },
            velocity: velocityPerHour
        };
    },

    // ========================================================================
    // 3. ZONE 2: THE APEX MATRIX (Leaderboard Sorting)
    // ========================================================================
    /**
     * Groups raw ticket data by specific entities and ranks them Top to Bottom.
     */
    generateApexMatrix: (tickets = []) => {
        const operatorStats = {};
        const routeStats = {};

        // Aggregate Data
        tickets.forEach(ticket => {
            // Operator Aggregation
            const operator = ticket.partners?.company_name || 'Unknown Operator';
            if (!operatorStats[operator]) operatorStats[operator] = { volume: 0, boarded: 0 };
            operatorStats[operator].volume += 1;
            if (ticket.status === 'BOARDED') operatorStats[operator].boarded += 1;

            // Route Aggregation
            const origin = ticket.meta?.origin || ticket.routes?.origin_city || 'Unknown';
            const destination = ticket.meta?.destination || ticket.routes?.destination_city || 'Unknown';
            const routeKey = `${origin} ➜ ${destination}`;
            if (!routeStats[routeKey]) routeStats[routeKey] = 0;
            routeStats[routeKey] += 1;
        });

        // Format and Sort Operators
        const rankedOperators = Object.entries(operatorStats)
            .map(([name, stats]) => ({
                name,
                volume: stats.volume,
                reliability: Math.round((stats.boarded / stats.volume) * 100) || 0
            }))
            .sort((a, b) => b.volume - a.volume);

        // Format and Sort Routes
        const rankedRoutes = Object.entries(routeStats)
            .map(([name, volume]) => ({ name, volume }))
            .sort((a, b) => b.volume - a.volume);

        return {
            operators: {
                top: rankedOperators.slice(0, 5),
                bottom: rankedOperators.slice(-5).reverse() // Worst performers
            },
            routes: {
                congested: rankedRoutes.slice(0, 5),
                ghosts: rankedRoutes.slice(-5).reverse() // Empty routes
            }
        };
    },

    // ========================================================================
    // 4. ZONE 3: BEHAVIORAL PHYSICS (Lead Times)
    // ========================================================================
    /**
     * Parses exactly how many hours before departure a user clicked 'Buy'.
     */
    calculateBehavioralVelocity: (tickets = []) => {
        const buckets = { '< 2 Hours': 0, '2-12 Hours': 0, '12-24 Hours': 0, '24+ Hours': 0 };

        tickets.forEach(ticket => {
            try {
                if (!ticket.travel_date || !ticket.departure_time || !ticket.created_at) return;

                const bookedAt = new Date(ticket.created_at);
                const departure = new Date(ticket.travel_date);
                
                // Parse "09:00 AM" Time String
                const [time, modifier] = ticket.departure_time.split(' ');
                let [hours, minutes] = time.split(':');
                if (hours === '12') hours = '00';
                if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
                departure.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

                // Calculate Hours Diff
                const diffMs = departure - bookedAt;
                const diffHours = diffMs / (1000 * 60 * 60);

                if (diffHours < 2) buckets['< 2 Hours'] += 1;
                else if (diffHours <= 12) buckets['2-12 Hours'] += 1;
                else if (diffHours <= 24) buckets['12-24 Hours'] += 1;
                else buckets['24+ Hours'] += 1;

            } catch (err) {
                // Silently drop malformed ticket dates to preserve engine stability
            }
        });

        return buckets;
    },

    // ========================================================================
    // 5. ZONE 5: SEAT GRAVITY MAP (Human Preference)
    // ========================================================================
    /**
     * Counts how many times specific seat IDs (e.g., '1A', 'M', '12D') are booked.
     * The UI will map this to colors (Red = Hot, Blue = Cold).
     */
    computeSeatGravity: (tickets = []) => {
        const gravityMap = {};
        let totalAssigned = 0;

        tickets.forEach(ticket => {
            if (ticket.seat_label) {
                gravityMap[ticket.seat_label] = (gravityMap[ticket.seat_label] || 0) + 1;
                totalAssigned += 1;
            }
        });

        // Convert raw counts to Gravity Percentages (0.0 to 1.0) for the CSS opacity logic
        const normalizedMap = {};
        if (totalAssigned > 0) {
            // Find the most popular seat to establish the 100% baseline
            const maxBookings = Math.max(...Object.values(gravityMap)); 
            
            Object.keys(gravityMap).forEach(seat => {
                normalizedMap[seat] = gravityMap[seat] / maxBookings; 
            });
        }

        return { rawCounts: gravityMap, heatMatrix: normalizedMap };
    }
};

export default AnalyticsPhysics;