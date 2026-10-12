/*
 * PSCS — all website copy lives here.
 * Edit the strings below and reload the page. Text is always inserted as
 * plain text (never as HTML), so you can type any characters safely.
 *
 * Later:
 *  - brand.logoSrc: put a path such as "assets/logo.svg" to show a logo
 *    instead of the text wordmark.
 *  - contactDetails.email: put the real address (e.g. "hello@your-domain")
 *    and the contact section will show a working email link automatically.
 */
window.PSCS_CONTENT = {
  brand: {
    short: "PSCS",
    full: "Port Ship Cargo Solutions",
    logoSrc: null,
    logoAlt: "PSCS — Port Ship Cargo Solutions"
  },

  contactDetails: {
    email: null
  },

  nav: [
    { label: "Expertise", href: "#expertise" },
    { label: "Approach", href: "#approach" },
    { label: "Team", href: "#team" },
    { label: "Contact", href: "#contact" }
  ],

  hero: {
    eyebrow: "Port · Ship · Cargo",
    // headline and subheadline defaults; the Customize panel can override them
    headline: "Smarter processes. Connected maritime operations.",
    subheadline:
      "We design digital solutions that simplify and automate workflows across ports, ships and cargo.",
    primaryCta: { label: "Discuss your process", href: "#contact" },
    secondaryCta: { label: "Explore our expertise", href: "#expertise" }
  },

  expertise: {
    eyebrow: "Expertise",
    title: "Three connected areas. One focus: the work behind them.",
    intro:
      "Every operation is a chain of people, information and decisions. We look at where that chain slows down and design solutions around it.",
    note: "Example processes we can design solutions for — not a list of finished products.",
    toggleOpen: "Show example processes",
    toggleClose: "Hide example processes",
    domains: [
      {
        key: "port",
        name: "PORT",
        full: "Port Operations & Infrastructure",
        description:
          "Coordination that keeps a port moving — berths, vessel movements and marine services.",
        processes: [
          "Berth planning and allocation",
          "Vessel movement coordination",
          "Pilotage, towage and mooring workflows",
          "Marine resource scheduling",
          "Operational reporting"
        ]
      },
      {
        key: "ship",
        name: "SHIP",
        full: "Vessel Operations & Management",
        description:
          "Operational and administrative work around vessels, on board and ashore.",
        processes: [
          "Voyage and vessel operations",
          "Maritime documentation",
          "Maintenance and inspection workflows",
          "Ship-to-shore information exchange",
          "Fleet coordination"
        ]
      },
      {
        key: "cargo",
        name: "CARGO",
        full: "Cargo Operations & Logistics",
        description:
          "Planning, handling and tracking cargo — and the information that travels with it.",
        processes: [
          "Cargo planning and handling",
          "Loading and unloading coordination",
          "Cargo documentation",
          "Cargo tracking and visibility",
          "Logistics information exchange"
        ]
      }
    ]
  },

  approach: {
    eyebrow: "Approach",
    title: "Built around your process.",
    intro: "We start from how the work is actually done, not from a ready-made product.",
    steps: [
      { title: "Understand", text: "We examine your workflow and identify friction." },
      { title: "Build", text: "We design and develop a solution around your process." },
      { title: "Implement", text: "We integrate the solution into daily operations." }
    ]
  },

  team: {
    eyebrow: "Team",
    title: "Maritime knowledge. Digital thinking.",
    intro:
      "We bring together an understanding of maritime operations and the skills to design and build software for them.",
    competences: [
      {
        title: "Maritime operations",
        text: "How ports, vessels and cargo operations work day to day."
      },
      {
        title: "Process and solution design",
        text: "Mapping workflows, finding friction and shaping practical solutions."
      },
      {
        title: "Software development",
        text: "Building dependable tools that fit the way operational teams work."
      }
    ]
  },

  contact: {
    eyebrow: "Contact",
    title: "What would you like to simplify?",
    text:
      "Tell us about a workflow that takes too much time, relies on manual steps or lives in too many places. We would be glad to discuss it.",
    pending: "Contact details will be added soon.",
    emailLabel: "Write to us"
  },

  footer: {
    areas: ["PORT", "SHIP", "CARGO"]
  }
};
