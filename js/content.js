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
    email: "customer@portshipcargo.com"
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
    supportingLine: "Maritime consultancy. Operational solutions. Tailored technology.",
    subheadline:
      "We combine practical maritime experience with software engineering to advise on operations, improve workflows and build tailored systems across ports, vessels and cargo.",
    // earlier default copy: saved settings that still hold it are upgraded, owner edits are kept
    legacyHeadlines: ["Smarter processes. Connected maritime operations."],
    legacySubheadlines: [
      "We design digital solutions that simplify and automate workflows across ports, ships and cargo.",
      "We design and improve digital systems that connect people, information and workflows across ports, vessels and cargo."
    ],
    // photographic hero; set image to null to fall back to the illustrated scene
    image: IMG("hero", [800, 1200, 1590], 1590, 989, "(min-width: 1200px) 1200px, 100vw",
      "A container ship moored at night beneath three quay cranes, its lights reflected in calm water."),
    primaryCta: { label: "Discuss your needs", href: "#contact" },
    secondaryCta: { label: "Explore our expertise", href: "#expertise" }
  },

  expertise: {
    eyebrow: "Expertise",
    title: "Expertise across ports, vessels and cargo.",
    intro:
      "We help maritime businesses understand their operational challenges, improve the way work is organized and develop systems around their specific needs.",
    note: "Areas we can advise on and develop tailored systems for \u2014 not a catalogue of finished products.",
    toggleOpen: "Show services",
    toggleClose: "Hide services",
    advisoryTitle: "Advisory & Operational Support",
    systemsTitle: "Systems & Automation",
    domains: [
      {
        key: "port",
        name: "PORT",
        full: "Port Operations & Information",
        description:
          "Practical advice and tailored systems for vessel calls, port coordination and information exchange.",
        image: IMG("port", [480, 800, 1000], 1000, 750, "(min-width: 961px) 300px, 92vw",
          "Aerial view of a container ship alongside a quay with yellow cranes, assisted by a tugboat."),
        advisory: [
          "Review of port and vessel-call workflows.",
          "Berth, vessel movement and marine-service coordination processes.",
          "Operational procedures, handovers and reporting workflows.",
          "Information exchange between ports, agents, terminals and marine services."
        ],
        systems: {
          items: [
            "Port planning and operational monitoring systems, covering operational planning and coordination.",
            "Port information systems.",
            "Berth planning and resource scheduling tools.",
            "Shared operational updates and role-based notifications.",
            "Reporting, dashboards and integrations."
          ]
        }
      },
      {
        key: "ship",
        name: "SHIP",
        full: "Vessel Operations, Management & Maintenance",
        description:
          "Maritime advice and company-specific systems for dry cargo vessels, general cargo ships, container ships and tankers.",
        image: IMG("ship", [480, 800, 840], 840, 630, "(min-width: 961px) 300px, 92vw",
          "A container vessel at night with its accommodation block and loaded containers."),
        advisory: [
          "Vessel operational workflow review.",
          "Advice on company and shipboard processes.",
          "Cargo-operation workflow advice.",
          "Voyage and passage planning advisory.",
          "Review of documentation, handovers and ship-to-shore coordination.",
          "Maintenance and inspection workflow advice."
        ],
        systems: {
          groups: [
            {
              title: "Ship Management Systems",
              text: "Tailored tools for vessel procedures, operational workflows, documentation, responsibilities and ship-to-shore coordination."
            },
            {
              title: "Planned Maintenance Systems (PMS)",
              text: "Tailored maintenance and inspection systems for vessel equipment and areas, with clear schedules, checklists, responsibilities and records.",
              listTitle: "Illustrative capabilities",
              items: [
                "Organize equipment and areas by vessel.",
                "Cover deck, machinery spaces, ballast tanks and other relevant areas.",
                "Configure schedules by calendar intervals, equipment running hours or defined events.",
                "Assign tasks and responsible roles.",
                "Track completed, upcoming and overdue work.",
                "Store inspection findings, photographs and work history.",
                "Manage follow-up actions and reporting for shore teams."
              ],
              note: "Schedules accommodate company procedures and the applicable equipment and operational requirements."
            },
            {
              title: "Integrated Vessel Systems",
              text: "Connect operations, maintenance, documentation and reporting within one system, or improve the tools your company already uses."
            }
          ]
        }
      },
      {
        key: "cargo",
        name: "CARGO",
        full: "Cargo Operations & Coordination",
        description:
          "Practical maritime insight and tailored tools for cargo workflows, documentation and operational coordination.",
        image: IMG("cargo", [480, 720], 720, 540, "(min-width: 961px) 300px, 92vw",
          "Colourful stacked shipping containers beside yellow quay cranes."),
        advisory: [
          "Cargo-operation workflow review.",
          "Loading and unloading coordination processes.",
          "Vessel, terminal and agent information exchange.",
          "Cargo documentation workflows.",
          "Operational handovers and reporting."
        ],
        systems: {
          items: [
            "Cargo planning and coordination tools.",
            "Cargo status tracking and shared visibility.",
            "Documentation and approval workflows.",
            "Operational notifications and reporting.",
            "Integration between vessel, terminal and shore teams."
          ]
        }
      }
    ],
    digital: {
      title: "Digital solutions across all three areas.",
      text: "We also develop websites, operational portals, automated workflows and integrations that support maritime businesses and connect their existing tools."
    },
    clients: {
      title: "Who we work with.",
      text: "Shipowners and vessel operators, charterers, ports and terminals, ship agents, crewing companies and maritime service providers."
    }
  },

  approach: {
    eyebrow: "Approach",
    title: "Advice, improvement and systems built around your operation.",
    intro:
      "We start with the operational need. The right response may be practical advice, a new system or an improvement to the tools and processes already in place.",
    problemsLabel: "The challenge",
    optionsLabel: "Three ways to work with us",
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
        key: "consult",
        tag: "CONSULT",
        subtitle: "Maritime Advisory",
        title: "Understand the challenge.",
        text:
          "We review the situation, clarify the workflow and provide practical recommendations tailored to your vessels, operations and company needs.",
        cta: { label: "Discuss advisory support", href: "#contact" },
        image: null
      },
      {
        key: "reset",
        tag: "RESET",
        subtitle: "Build from the Ground Up",
        title: "Create a tailored solution.",
        text:
          "When a new approach is needed, we design and develop a system around your workflows, responsibilities and operational requirements.",
        cta: { label: "Discuss a new system", href: "#contact" },
        image: IMG("reset", [480, 768, 1200], 1200, 800, "(min-width: 1000px) 360px, (min-width: 600px) 40vw, 92vw",
          "A turquoise RESET key on a dark keyboard.")
      },
      {
        key: "upgrade",
        tag: "UPGRADE",
        subtitle: "Improve What Already Works",
        title: "Develop your existing capability.",
        text:
          "We improve current processes and tools, connect information and automate repetitive work while preserving what already serves your operation well.",
        cta: { label: "Discuss improving your tools", href: "#contact" },
        image: IMG("upgrade", [480, 768, 1200, 1536], 1536, 1024, "(min-width: 1000px) 360px, (min-width: 600px) 40vw, 92vw",
          "An amber-yellow UPGRADE key on a dark keyboard.")
      }
    ],
    steps: [
      {
        title: "Understand",
        text: "We examine the operation with the people involved and define the problem, requirements and intended outcome."
      },
      {
        title: "Develop",
        text: "We prepare practical recommendations, develop a new system or improve existing tools according to the agreed scope."
      },
      {
        title: "Implement",
        text: "We support the introduction of the agreed solution and refine it through operational feedback."
      }
    ],
    note:
      "Essential communications and human decisions stay part of the process. Notifications follow role, responsibility and urgency."
  },

  team: {
    eyebrow: "TEAM",
    title: "Maritime experience. Engineering expertise.",
    intro:
      "Our team combines experienced maritime captains with software engineering expertise. With higher education in maritime and IT disciplines, practical experience at sea and in port operations, and 15 years of software development experience, we connect operational understanding with the ability to build tailored systems.",
    competences: [
      {
        title: "Maritime & Port Operations",
        text: "Experience across dry cargo vessels, general cargo ships, container ships and tankers, complemented by knowledge of vessel traffic operations, port coordination and marine surveying."
      },
      {
        title: "Consultancy & Process Design",
        text: "Understanding how work happens on board and ashore, identifying friction and shaping practical recommendations around the operation."
      },
      {
        title: "Software Engineering & Integration",
        text: "Fifteen years of software development experience across varied projects, supported by higher education in IT and technical leadership experience."
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
      }
    }
  },

  contact: {
    eyebrow: "Contact",
    title: "What would you like to improve?",
    text:
      "Tell us about your maritime operation, a process you want to improve or a system you need to develop. We can discuss practical advice, a new solution or improvements to your existing setup.",
    pending: "Contact details will be added soon.",
    emailLabel: "Write to us",
    copyLabel: "Copy email",
    copiedLabel: "Copied \u2713",
    copiedStatus: "Email address copied to the clipboard.",
    copyFailed: "Please select and copy the email address."
  },

  footer: {
    areas: ["PORT", "SHIP", "CARGO"]
  }
};
