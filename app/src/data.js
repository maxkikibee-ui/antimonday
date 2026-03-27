export const initialData = {
  metrics: { totalDeals: 24, value: 1250000, won: 8, conversionRate: 33 },
  pipelineStages: [
    { id: "lead", name: "New Lead", color: "#3b82f6" },
    { id: "contacted", name: "Contacted", color: "#f59e0b" },
    { id: "proposal", name: "Proposal Sent", color: "#4f46e5" },
    { id: "won", name: "Closed Won", color: "#10b981" },
    { id: "lost", name: "Closed Lost", color: "#ef4444" }
  ],
  deals: [
    { id: "d1", title: "Website Redesign", company: "TechCorp Inc.", value: 150000, stage: "lead", date: "2026-03-20" },
    { id: "d2", title: "Mobile App Beta", company: "StartApp LLC", value: 300000, stage: "contacted", date: "2026-03-21" },
    { id: "d3", title: "CRM Integration", company: "Mega Retail", value: 500000, stage: "proposal", date: "2026-03-18" },
    { id: "d4", title: "Annual Support IT", company: "HealthPlus", value: 80000, stage: "won", date: "2026-03-15" }
  ],
  contacts: [
    { id: "c1", name: "John Smith", email: "john@techcorp.com", phone: "081-234-5678", company: "TechCorp Inc.", status: "Active" },
    { id: "c2", name: "Sarah Connor", email: "sarah@startapp.com", phone: "089-876-5432", company: "StartApp LLC", status: "Lead" },
    { id: "c3", name: "Bruce Wayne", email: "bruce@megaretail.com", phone: "082-333-4444", company: "Mega Retail", status: "Active" }
  ]
};
