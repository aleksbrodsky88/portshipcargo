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
/*
 * Image descriptor: IMG(name, widths, intrinsicW, intrinsicH, sizes, alt)
 * Files live in assets/img/<name>-<width>.webp. Masters are kept in
 * assets/originals/. Set `available` to false (or remove an entry's image)
 * to hide a picture whose derivative files are not in the project yet.
 */
function IMG(name, widths, width, height, sizes, alt) {
  var list = widths.slice().sort(function (a, b) { return a - b; });
  return {
    name: name,
    srcset: list.map(function (w) { return "assets/img/" + name + "-" + w + ".webp " + w + "w"; }).join(", "),
    src: "assets/img/" + name + "-" + list[list.length - 1] + ".webp",
    width: width,
    height: height,
    sizes: sizes,
    alt: alt
  };
}

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
    headline: "Bring order to maritime operations.",
    subheadline:
      "We design and improve digital systems that connect people, information and workflows across ports, vessels and cargo.",
    // earlier default copy: saved settings that still hold it are upgraded, owner edits are kept
    legacyHeadlines: ["Smarter processes. Connected maritime operations."],
    legacySubheadlines: [
      "We design digital solutions that simplify and automate workflows across ports, ships and cargo."
    ],
    // photographic hero; set image to null to fall back to the illustrated scene
    image: IMG("hero", [800, 1200, 1590], 1590, 989, "(min-width: 1200px) 1200px, 100vw",
      "A container ship moored at night beneath three quay cranes, its lights reflected in calm water."),
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
        image: IMG("port", [480, 800, 1000], 1000, 750, "(min-width: 961px) 300px, 92vw",
          "Aerial view of a container ship alongside a quay with yellow cranes, assisted by a tugboat."),
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
        image: IMG("ship", [480, 800, 840], 840, 630, "(min-width: 961px) 300px, 92vw",
          "A container vessel at night with its accommodation block and loaded containers."),
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
        image: IMG("cargo", [480, 720], 720, 540, "(min-width: 961px) 300px, 92vw",
          "Colourful stacked shipping containers beside yellow quay cranes."),
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
    title: "From fragmented work to connected operations.",
    intro:
      "We start with how work happens today. Then we build a new system or improve the one you already use, making information easier to find, responsibilities clearer and communication more relevant.",
    problemsLabel: "The challenge",
    optionsLabel: "Two ways to deliver",
    stepsLabel: "How we work",
    problems: [
      {
        key: "keys",
        tag: "Scattered keys",
        title: "Too many disconnected tasks.",
        text:
          "Scattered information, repeated data entry and unclear handovers make everyday work harder than it needs to be.",
        image: IMG("keys", [480, 768, 1200], 1200, 800, "(min-width: 821px) 540px, 92vw",
          "Computer keyboard keys scattered across a dark surface.")
      },
      {
        key: "calls",
        tag: "Missed calls",
        title: "Too many unnecessary interruptions.",
        text:
          "We connect shared updates and relevant notifications so people can find the information they need without repeated calls and email chains.",
        image: IMG("calls", [400, 800], 800, 1000, "(min-width: 821px) 360px, 70vw",
          "A phone screen showing a long list of missed-call notifications.")
      }
    ],
    options: [
      {
        key: "reset",
        tag: "RESET",
        title: "Build from the ground up.",
        text:
          "When a fresh start is the right choice, we design and develop a system around your workflows, roles and operational needs.",
        cta: { label: "Discuss a new system", href: "#contact" },
        image: IMG("reset", [480, 768, 1200], 1200, 800, "(min-width: 821px) 540px, 92vw",
          "A turquoise RESET key on a dark keyboard.")
      },
      {
        key: "upgrade",
        tag: "UPGRADE",
        title: "Improve what already works.",
        text:
          "We improve existing tools, connect information and automate repetitive steps while retaining the parts that serve your operation well.",
        cta: { label: "Discuss improving your tools", href: "#contact" },
        image: IMG("upgrade", [480, 768, 1200, 1536], 1536, 1024, "(min-width: 821px) 540px, 92vw",
          "An amber-yellow UPGRADE key on a dark keyboard.")
      }
    ],
    steps: [
      {
        title: "Understand",
        text: "We map the workflow with the people who use it, identifying delays, duplicate work and information gaps."
      },
      {
        title: "Build",
        text: "We develop a new solution or improve existing tools, validating the design against real operational needs."
      },
      {
        title: "Implement",
        text: "We introduce the solution into daily work, support adoption and refine it through feedback."
      }
    ],
    note:
      "Essential communications and human decisions stay part of the process. Notifications follow role, responsibility and urgency."
  },

  team: {
    eyebrow: "TEAM",
    title: "Maritime experience. Engineering expertise.",
    intro:
      "Our team brings together practical experience in ship command, port and vessel traffic operations, and marine surveying with software engineering and technical leadership. We understand how maritime work happens on board and ashore, and translate that understanding into clear, dependable digital systems.",
    competences: [
      {
        title: "Maritime and port operations",
        text: "Practical insight into vessel operations, traffic coordination, marine services and the information teams need to work together."
      },
      {
        title: "Process and solution design",
        text: "Turning complex workflows into clear roles, shared information and practical tools that reduce unnecessary administration."
      },
      {
        title: "Software engineering",
        text: "Designing, building and integrating dependable systems around real operational requirements."
      }
    ],
    // illustrative photographs of the competencies — not portraits of actual staff
    photos: {
      maritime: {
        caption: "Maritime and port operations",
        image: IMG("team-port", [600, 1000, 1400], 1400, 739, "(min-width: 821px) 520px, 92vw",
          "A port operations specialist in a high-visibility jacket and hard hat, holding a radio and a clipboard at night beside quay cranes. Illustrative photograph.")
      },
      software: {
        caption: "Software engineering",
        image: IMG("dev", [480, 800, 1122], 1122, 1402, "(min-width: 821px) 280px, 46vw",
          "A software engineer seen from behind, working at several monitors of code. Illustrative photograph.")
      },
      accent: {
        image: IMG("capsule", [300, 600], 600, 1066, "120px", "")
      }
    }
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
