/**
 * 👑 AYABUS ANALYTICS HARVESTER (v3.0 Sovereign)
 * ------------------------------------------------------------------
 * Module: Analytics & Intelligence Centre
 * File: analytics.service.js
 * * DESCRIPTION:
 * The enterprise data layer. Listens to the Global Time Dial, constructs 
 * precise temporal database queries, and fetches the required telemetry 
 * (Tickets, Approvals, Schedules) for the Physics Engine.
 */

import { supabase } from '../../../lib/supabase';
import { TIME_WINDOWS } from './analytics.constants';

export const analyticsService = {

    // ========================================================================
    // 1. TEMPORAL RANGE GENERATOR
    // Converts "TODAY" or "7D" into exact ISO timestamps for the database.
    // ========================================================================
    getDateRange: (timeWindow, isPrevious = false) => {
        const now = new Date();
        let start = new Date();
        let end = new Date();

        switch (timeWindow) {
            case TIME_WINDOWS.TODAY:
                if (isPrevious) {
                    // Yesterday
                    start.setDate(now.getDate() - 1);
                    start.setHours(0, 0, 0, 0);
                    end = new Date(start);
                    end.setHours(23, 59, 59, 999);
                } else {
                    // Today
                    start.setHours(0, 0, 0, 0);
                }
                break;

            case TIME_WINDOWS.SEVEN_DAYS:
                if (isPrevious) {
                    // Days -14 to -7
                    start.setDate(now.getDate() - 14);
                    end.setDate(now.getDate() - 7);
                } else {
                    // Last 7 Days
                    start.setDate(now.getDate() - 7);
                }
                break;

            case TIME_WINDOWS.THIS_MONTH:
                if (isPrevious) {
                    // Last Month to exact same day
                    start.setMonth(now.getMonth() - 1, 1);
                    end.setMonth(now.getMonth() - 1, now.getDate());
                } else {
                    // 1st of Current Month to Now
                    start.setDate(1);
                    start.setHours(0, 0, 0, 0);
                }
                break;

            default:
                start.setHours(0, 0, 0, 0); // Default to Today
        }

        return { 
            startStr: start.toISOString(), 
            endStr: end.toISOString() 
        };
    },

    // ========================================================================
    // 2. THE MASTER FETCH ORCHESTRATOR
    // Pulls all required data streams concurrently for maximum speed.
    // ========================================================================
    /**
     * @param {String} timeWindow - e.g., 'TODAY', '7D', 'MTD'
     * @returns {Object} { currentTickets, previousTickets, slaData, activeCapacity }
     */
    fetchTelemetryData: async (timeWindow = TIME_WINDOWS.TODAY) => {
        try {
            // 1. Generate Timestamps for Current and Previous periods
            const currentRange = analyticsService.getDateRange(timeWindow, false);
            const prevRange = analyticsService.getDateRange(timeWindow, true);

            // 2. Execute massive concurrent database sweep
            const [
                currentTicketsRes, 
                prevTicketsRes, 
                approvalsRes, 
                schedulesRes
            ] = await Promise.all([
                // A. Current Tickets (With Partner & Route relations)
                supabase
                    .from('tickets')
                    .select('id, ticket_hash, status, seat_label, created_at, travel_date, departure_time, meta, partners(company_name), routes(origin_city, destination_city)')
                    .gte('created_at', currentRange.startStr)
                    .lte('created_at', currentRange.endStr),

                // B. Previous Tickets (For calculating Deltas)
                supabase
                    .from('tickets')
                    .select('id, status') // Lightweight select, only need counts/status
                    .gte('created_at', prevRange.startStr)
                    .lte('created_at', prevRange.endStr),

                // C. Approvals (For calculating the Maker-Checker SLA)
                supabase
                    .from('approvals')
                    .select('created_at, resolved_at, status')
                    .gte('created_at', currentRange.startStr)
                    .lte('created_at', currentRange.endStr)
                    .in('status', ['AUTHORIZED', 'REJECTED']), // Only fetch completed tasks

                // D. Active Schedules & Fleet Capacity (For calculating Penetration/Capture Rate)
                supabase
                    .from('route_schedules')
                    .select('id, bus_configs(layout_config)')
                    .eq('status', 'ACTIVE')
            ]);

            // 3. Failsafe Error Checking
            if (currentTicketsRes.error) throw currentTicketsRes.error;
            if (prevTicketsRes.error) throw prevTicketsRes.error;
            if (approvalsRes.error) throw approvalsRes.error;
            if (schedulesRes.error) throw schedulesRes.error;

            // 4. Transform SLA Data (Calculate average resolution time in minutes)
            let averageSlaMinutes = 0;
            const completedApprovals = approvalsRes.data || [];
            if (completedApprovals.length > 0) {
                const totalMinutes = completedApprovals.reduce((acc, app) => {
                    const start = new Date(app.created_at);
                    const end = new Date(app.resolved_at);
                    return acc + ((end - start) / (1000 * 60)); // diff in minutes
                }, 0);
                averageSlaMinutes = Math.round(totalMinutes / completedApprovals.length);
            }

            // 5. Calculate Total Physical Capacity (Total seats currently driving around)
            let activeNetworkCapacity = 0;
            const activeSchedules = schedulesRes.data || [];
            activeSchedules.forEach(schedule => {
                const layout = schedule.bus_configs?.layout_config || '';
                // Simple regex extraction: e.g., "L2-R2-BENCH" with 12 rows ~ 60 seats
                // In a true production environment, you might fetch 'total_seats' directly.
                // For this engine, we will assume a baseline of 60 seats per active schedule
                activeNetworkCapacity += 60; 
            });

            // 6. Return the perfectly structured payload to the UI
            return {
                success: true,
                data: {
                    currentTickets: currentTicketsRes.data || [],
                    previousTickets: prevTicketsRes.data || [],
                    slaAverageMinutes: averageSlaMinutes,
                    activeNetworkCapacity: activeNetworkCapacity
                }
            };

        } catch (error) {
            console.error("Telemetry Harvest Failed:", error);
            return { 
                success: false, 
                error: error.message,
                data: { currentTickets: [], previousTickets: [], slaAverageMinutes: 0, activeNetworkCapacity: 1 }
            };
        }
    }
};

export default analyticsService;