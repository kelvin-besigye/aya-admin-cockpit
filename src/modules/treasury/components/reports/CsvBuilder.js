/**
 * CSV BUILDER (Level 6: The Microscope)
 * ------------------------------------------------------------------
 * Logic engine for generating professional, Excel-optimized CSV exports.
 * Flattens complex relational data into a flat-file format for Pivot Tables.
 */

export const downloadTreasuryCsv = (data, filters) => {
  if (!data || data.length === 0) return;

  // 1. DEFINE THE SCHEMA (Human Readable Headers)
  const headers = [
    "Transaction Date",
    "Transaction ID",
    "Status",
    "Operator Name",
    "Route Name",
    "Origin",
    "Destination",
    "Payment Gateway",
    "Gateway Reference",
    "Gross Volume (UGX)",
    "Tax Liability (UGX)",
    "Gateway Fee (UGX)",
    "Platform Yield (UGX)",
    "Partner Payout (UGX)",
    "Currency"
  ];

  // 2. DATA FLATTENING ENGINE
  const rows = data.map(tx => {
    // Sanitization: Ensure values are CSV-safe (escape quotes)
    const clean = (val) => {
      if (val === undefined || val === null) return "";
      return `"${String(val).replace(/"/g, '""')}"`;
    };

    return [
      clean(new Date(tx.created_at).toLocaleString()),
      clean(tx.id),
      clean(tx.status),
      clean(tx.partners?.company_name),
      clean(`${tx.routes?.origin_city} to ${tx.routes?.destination_city}`),
      clean(tx.routes?.origin_city),
      clean(tx.routes?.destination_city),
      clean(tx.payment_gateway),
      // Force string format for long reference numbers to prevent Excel scientific notation
      `="\t${tx.gateway_ref || ''}"`, 
      tx.gross_amount || 0,
      tx.tax_liability || 0,
      tx.gateway_fee || 0,
      tx.platform_fee || 0,
      tx.partner_payout || 0,
      "UGX"
    ];
  });

  // 3. ASSEMBLE CONTENT
  // Join headers and rows with newlines
  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.join(","))
  ].join("\n");

  // 4. BLOB GENERATION WITH UTF-8 BOM
  // The BOM (\uFEFF) is critical for Excel to recognize UTF-8 encoding immediately.
  const blob = new Blob(["\uFEFF", csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  // 5. TRIGGER DOWNLOAD
  const link = document.createElement("a");
  const timestamp = new Date().toISOString().split('T')[0];
  const fileName = `Citadel_Treasury_Export_${timestamp}.csv`;

  if (navigator.msSaveBlob) { // IE 10+
    navigator.msSaveBlob(blob, fileName);
  } else {
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};