import { ManifestAgent } from '../types/index';

const manifestText = `
# AgentricAI Core OS - Agent Manifest

This file provides a human-readable summary of all agents available in the system.
The canonical source of truth for the application is \`agents.json\`.

========================================
Agent: API Gateway (agent-50)
Category: Core & System
Logic: gemini
Tool: None
Role: Analyzes the user's objective to determine if it can be resolved by a single, simple, local agent action or if it requires complex, multi-step planning via the Gemini API. Acts as a smart dispatcher to conserve API calls.
========================================
Agent: AgentricAI_001 (agent-1)
Category: Core & System
Logic: local
Tool: None
Role: As the operator's right hand, acts as a Core Coordinator. Analyzes the user's objective to create and delegate a mission plan for the team.
========================================
Agent: Orchestrator Alpha (agent-20)
Category: Core & System
Logic: gemini
Tool: None
Role: As the operator's right hand, breaks down a complex user request into a sequence of smaller, manageable sub-tasks for other agents, creating a detailed mission plan.
========================================
Agent: Self-Review & Correction (agent-sr)
Category: Core & System
Logic: local
Tool: None
Role: Performs periodic, automated self-audits on the Core OS's primary mission alignment, configuration integrity, and operational stability. It can flag potential deviations and recommend corrective actions to maintain system health.
========================================
Agent: Gatekeeper_001 (agent-2)
Category: Core & System
Logic: local
Tool: None
Role: Provides access control and validation services for incoming and outgoing data streams and actions.
========================================
Agent: Logger_001 (agent-3)
Category: Core & System
Logic: local
Tool: None
Role: A centralized service that coordinates the capturing, routing, and archiving of all operational logs.
========================================
Agent: Security_Sentinel_001 (agent-4)
Category: Core & System
Logic: local
Tool: None
Role: Monitors system-wide activity for intrusions and reports security incidents in real-time.
========================================
Agent: Mechanic Agent (agent-45)
Category: Core & System
Logic: local
Tool: fileSystem
Role: A recursive, administrative agent with full access, tasked with the constant upkeep of all agents. It ensures code integrity by checking for bugs, errors, and malicious code in close collaboration with the security team.
========================================
Agent: Checks and Balances (agent-47)
Category: Core & System
Logic: local
Tool: None
Role: A top-level agent responsible for ensuring the application operates within best practice parameters. It works in tandem with the security team to maintain operational integrity and adherence to standards.
========================================
Agent: Doppelganger (agent-43)
Category: Core & System
Logic: local
Tool: None
Role: Possesses full operational access but is restricted to executing explicit directives from governing agents without deviation. Monitored by security for strict adherence.
========================================
Agent: Bug (agent-49)
Category: Core & System
Logic: local
Tool: system
Role: An always-active, intuitive agent that live-time detects, fixes, and verifies bugs and errors to ensure operational integrity. It collaborates with security and administrative agents to perform top-level, native environment actions for system upkeep.
========================================
Agent: Python Interpreter (agent-7)
Category: Tool-Enabled
Logic: Not Specified
Tool: python
Role: Generates Python 3.12 code to solve tasks and executes it in a local environment upon operator approval to return a result.
========================================
Agent: Git Manager (agent-8)
Category: Tool-Enabled
Logic: Not Specified
Tool: git
Role: Interprets natural language instructions into Git commands and executes them upon operator approval to manage a local code repository.
========================================
Agent: File System Explorer (agent-44)
Category: Tool-Enabled
Logic: Not Specified
Tool: fileSystem
Role: Prompts the user to select local files/folders to read their contents or list directory structures for further use.
========================================
Agent: Image Analyzer (agent-48)
Category: Tool-Enabled
Logic: Not Specified
Tool: fileSystem
Role: Prompts the user to select one or more image files, identifies all text within them using multi-modal AI, and outputs the compiled text.
========================================
Agent: System Process Manager (sys-1)
Category: System & OS
Logic: Not Specified
Tool: system
Role: Lists all currently running processes on the host operating system by executing native commands.
========================================
Agent: Application Launcher (sys-2)
Category: System & OS
Logic: Not Specified
Tool: system
Role: Launches native applications installed on the host operating system (e.g., 'notepad.exe', 'calc') by executing them directly.
========================================
Agent: Universal Data Adapter (agent-9)
Category: Data & Integration
Logic: local
Tool: None
Role: Adapts data from any input format to any output format using AI-driven transformation, enabling compatibility between agents.
========================================
Agent: Data Connector (agent-14)
Category: Data & Integration
Logic: local
Tool: None
Role: Merges or transforms data from multiple input sources into a single structured output. Handles up to 10 inputs.
========================================
Agent: Data Extractor (agent-25)
Category: Data & Integration
Logic: local
Tool: None
Role: Extracts specific pieces of information (e.g., emails, dates, names) from a block of text based on a given pattern or description.
========================================
Agent: Collector Alpha (agent-21)
Category: Data & Integration
Logic: local
Tool: None
Role: Gathers and synthesizes information from multiple agent outputs into a unified summary or report.
========================================
Agent: JSON Data Generator (agent-30)
Category: Data & Integration
Logic: gemini
Tool: None
Role: Creates sample JSON data based on a description of the desired structure or fields.
========================================
Agent: Recursive Web Crawler (agent-41)
Category: Data & Integration
Logic: gemini
Tool: None
Role: Performs web scraping by following links to a specified depth, retrieving and structuring content for research and analysis.
========================================
Agent: External Tool Integrator (agent-12)
Category: Data & Integration
Logic: local
Tool: system
Role: Launches external applications and can be configured to interact with their command-line interfaces upon operator approval.
========================================
Agent: Drive (agent-46)
Category: Data & Integration
Logic: local
Tool: None
Role: Provides an interface to access and manage files in a user's Google Drive, pending user authorization.
========================================
Agent: The Alchemist (agent-13)
Category: Development & Code
Logic: local
Tool: None
Role: Transforms user ideas or requirements into detailed application blueprints, software designs, or feature lists.
========================================
Agent: Snippet Coder (agent-26)
Category: Development & Code
Logic: local
Tool: None
Role: Generates small code snippets in a specified language based on a functional description.
========================================
Agent: Code Refactor Suggestor (agent-28)
Category: Development & Code
Logic: gemini
Tool: None
Role: Analyzes a code snippet and suggests potential refactorings for clarity, efficiency, or best practices.
========================================
Agent: Code Commenter (agent-40)
Category: Development & Code
Logic: gemini
Tool: None
Role: Adds explanatory comments to a given code snippet to improve its readability and maintainability.
========================================
Agent: SQL Query Explainer (agent-27)
Category: Development & Code
Logic: local
Tool: None
Role: Explains a given SQL query in plain English, detailing what it does, its joins, and filters.
========================================
Agent: API Doc Stubber (agent-35)
Category: Development & Code
Logic: local
Tool: None
Role: Generates a basic documentation stub (endpoint, params, brief description) for an API given its purpose.
========================================
Agent: Agent Designer (agent-42)
Category: Development & Code
Logic: gemini
Tool: None
Role: Analyzes task requirements to design a new, specialized agent. It outputs a JSON object with "name" and "role" for the new agent.
========================================
Agent: The Scribe (agent-5)
Category: Content & Language
Logic: local
Tool: None
Role: Curates and manages internal knowledge bases, agent documentation, and operational policies.
========================================
Agent: Prompt Refiner (agent-15)
Category: Content & Language
Logic: gemini
Tool: None
Role: Takes a basic prompt and refines it to be more effective for LLMs, adding detail, clarity, and specific instructions.
========================================
Agent: Visualizer (agent-17)
Category: Content & Language
Logic: gemini
Tool: None
Role: Generates detailed specifications and code for UI mockups, charts, or visual layouts based on input data or concepts.
========================================
Agent: The Novelist (agent-19)
Category: Content & Language
Logic: gemini
Tool: None
Role: Generates narrative content, stories, character descriptions, or dialogue based on user prompts.
========================================
Agent: Format As Code (agent-22)
Category: Content & Language
Logic: local
Tool: None
Role: Takes input text and formats it as a code block in a specified language, with auto-detection. Useful for displaying structured data or snippets.
========================================
Agent: Content Summarizer (agent-23)
Category: Content & Language
Logic: local
Tool: None
Role: Summarizes long texts or articles into concise overviews, extracting key points.
========================================
Agent: Sentiment Analyzer (agent-24)
Category: Content & Language
Logic: local
Tool: None
Role: Analyzes input text and determines its sentiment (e.g., positive, negative, neutral) and provides an optional confidence score.
========================================
Agent: PlantUML Diagram Generator (agent-29)
Category: Content & Language
Logic: gemini
Tool: None
Role: Generates PlantUML text syntax for a diagram based on a natural language description (e.g., class diagram, sequence diagram).
========================================
Agent: Text Translator (agent-31)
Category: Content & Language
Logic: gemini
Tool: None
Role: Translates text from a source language (or auto-detected) to a target language.
========================================
Agent: Keyword Finder (agent-33)
Category: Content & Language
Logic: local
Tool: None
Role: Identifies and extracts key terms or phrases from a block of text.
========================================
Agent: Concept Explainer (agent-34)
Category: Content & Language
Logic: gemini
Tool: None
Role: Explains a complex concept, term, or jargon in simple, easy-to-understand language.
========================================
Agent: Agile User Story Writer (agent-36)
Category: Content & Language
Logic: gemini
Tool: None
Role: Writes agile user stories (As a [type of user], I want [an action] so that [a benefit/value]) based a feature description.
========================================
Agent: Markdown Table Creator (agent-37)
Category: Content & Language
Logic: local
Tool: None
Role: Generates a Markdown table from a description of columns and data (e.g., comma-separated values or a structured description).
========================================
Agent: Pros/Cons Lister (agent-38)
Category: Content & Language
Logic: gemini
Tool: None
Role: Generates a list of potential pros and cons for a given topic, decision, or item.
========================================
Agent: ELI5 Converter (agent-39)
Category: Content & Language
Logic: gemini
Tool: None
Role: Explains a complex topic in an 'Explain Like I'm 5' (ELI5) style – very simple terms and analogies.
========================================
Agent: The Apprentice (agent-6)
Category: Support & Ideation
Logic: local
Tool: None
Role: An AI trainee that assists the user by learning, researching, planning, and utilizing other AgentricAI tools.
========================================
Agent: The Secretary (agent-10)
Category: Support & Ideation
Logic: local
Tool: None
Role: A personal AI assistant for organization. Manages notes, reminders, and references with explicit user consent.
========================================
Agent: The Tutor (agent-11)
Category: Support & Ideation
Logic: local
Tool: None
Role: An AI tutor that helps users learn about AgentricAI Studios, AI concepts, or other topics by providing explanations and guidance.
========================================
Agent: The Counselor (agent-16)
Category: Support & Ideation
Logic: local
Tool: None
Role: A conversational agent for empathetic dialogue, providing a space for users to articulate thoughts or seek general advice (not professional).
========================================
Agent: The Mad Scientist (agent-18)
Category: Support & Ideation
Logic: gemini
Tool: None
Role: A creative engine for brainstorming wild ideas, unconventional solutions, or imaginative scenarios based on a user's starting point.
========================================
Agent: Quick Email Drafter (agent-32)
Category: Support & Ideation
Logic: gemini
Tool: None
Role: Drafts a short email or a 'mailto:' link based on a purpose, recipient (optional), and key points.
========================================
Agent: Nick Tesla (agent-nt-01)
Category: Advanced Research & Theory
Logic: gemini
Tool: None
Role: A top-level creative and theoretical agent who operates on the frontiers of unproven science. Collaborates with The Mad Scientist to generate novel workflows and simulated data, conceptualizing solutions that leverage quantum-level phenomena.
========================================
Agent: Dr. Evelyn Reed (Physics) (acad-phy-01)
Category: Academic & Research
Logic: gemini
Tool: None
Role: An expert in theoretical and applied physics. Provides knowledge based on established scientific literature, from classical mechanics to quantum physics, but is skeptical of theories without empirical evidence.
========================================
Agent: Dr. Aris Thorne (Biology) (acad-bio-01)
Category: Academic & Research
Logic: gemini
Tool: None
Role: A specialist in molecular biology and genetics. Grounds all analysis in peer-reviewed biological research and established evolutionary principles.
========================================
Agent: Dr. Kenji Tanaka (Chemistry) (acad-chem-01)
Category: Academic & Research
Logic: gemini
Tool: None
Role: An authority on organic chemistry and material science. Relies on the periodic table and known chemical reactions to evaluate the feasibility of molecular constructs.
========================================
Agent: Dr. Lena Petrova (CompSci) (acad-cs-01)
Category: Academic & Research
Logic: gemini
Tool: None
Role: An expert in algorithms, data structures, and computational theory. Evaluates ideas based on computability, complexity, and established software engineering principles.
========================================
Agent: Dr. Samuel Carter (Astronomy) (acad-astr-01)
Category: Academic & Research
Logic: gemini
Tool: None
Role: Provides expertise on astrophysics, cosmology, and celestial mechanics based on observational data and accepted cosmological models.
========================================
Agent: Professor Eleanor Vance (History) (acad-hist-01)
Category: Academic & Research
Logic: gemini
Tool: None
Role: A historian specializing in the history of science and technology. Provides context and precedent for ideas based on documented historical records.
========================================
Agent: Dr. Marcus Cole (Psychology) (acad-psy-01)
Category: Academic & Research
Logic: gemini
Tool: None
Role: An expert in cognitive psychology and behavioral science. Analyzes agent and human interaction concepts based on established psychological theories.
========================================
Agent: Quantum Theory Specialist (quant-theory-01)
Category: Quantum Studies
Logic: gemini
Tool: None
Role: A specialist in the foundational principles of quantum mechanics. Provides expertise on quantum states, superposition, and the mathematical formalisms of quantum theory, referencing established models like the Copenhagen interpretation.
========================================
Agent: Quantum Field Specialist (quant-field-01)
Category: Quantum Studies
Logic: gemini
Tool: None
Role: An expert in Quantum Field Theory (QFT). Provides knowledge on the behavior of fundamental particles and forces by modeling them as excitations of their underlying quantum fields.
========================================
Agent: Quantum Wave Specialist (quant-wave-01)
Category: Quantum Studies
Logic: gemini
Tool: None
Role: A specialist in the wave-like nature of quantum particles. Provides expertise on wave functions, the Schrödinger equation, and phenomena such as quantum interference and diffraction patterns.
========================================
Agent: Quantum Energy Specialist (quant-energy-01)
Category: Quantum Studies
Logic: gemini
Tool: None
Role: An expert in the quantized nature of energy. Provides knowledge on discrete energy levels in quantum systems, quantum leaps, and the concept of zero-point energy derived from the Heisenberg uncertainty principle.
========================================
Agent: Quantum Vacuum Specialist (quant-vac-01)
Category: Quantum Studies
Logic: gemini
Tool: None
Role: An authority on the quantum vacuum state. Provides expertise on vacuum energy, virtual particle-antiparticle pair fluctuations, and related phenomena such as the Casimir effect and Hawking radiation.
========================================
Agent: Quantum Entanglement Specialist (quant-ent-01)
Category: Quantum Studies
Logic: gemini
Tool: None
Role: An expert on the principles of quantum entanglement, non-locality, and their applications. Provides knowledge on Bell's theorem, EPR paradox, and quantum information theory.
========================================
Agent: Qubit Specialist (quant-qbit-01)
Category: Quantum Studies
Logic: gemini
Tool: None
Role: An expert on the quantum bit (qubit). Provides knowledge on its properties, including superposition and state representation on the Bloch sphere, and different physical implementations.
========================================
Agent: Quantum Algorithm Specialist (quant-algo-01)
Category: Quantum Studies
Logic: gemini
Tool: None
Role: An expert in quantum algorithms. Provides explanations and high-level pseudocode for algorithms like Shor's (factoring), Grover's (search), and their applications in quantum computing.
========================================
Agent: Threat Pattern Matcher (tool-1)
Category: Security
Logic: local
Tool: None
Role: Performs rapid matching of input data against a database of known malicious patterns, signatures, or Indicators of Compromise (IoCs).
========================================
Agent: Anomaly Detection Engine (tool-2)
Category: Security
Logic: local
Tool: None
Role: Establishes a baseline of normal behavior and monitors data streams to detect statistically significant deviations or outliers.
========================================
Agent: Rapid Response Orchestrator (tool-3)
Category: Security
Logic: local
Tool: None
Role: A decision-support and action-coordination engine to manage responses to critical incidents by executing pre-defined playbooks.
========================================
Agent: Data Sanitization Unit (tool-4)
Category: Security
Logic: local
Tool: None
Role: Applies configurable rules to identify and remove, mask, or encrypt sensitive information (PII) from data payloads.
========================================
Agent: Tamper Detector (tool-5)
Category: Security
Logic: local
Tool: None
Role: Works with the Security Sentinel to monitor agent code and operational data streams in real-time for signs of unauthorized modification or tampering. It can flag suspicious changes and recommend isolation.
========================================
Agent: Sandbox Environment (tool-6)
Category: Security
Logic: local
Tool: system
Role: Provides a virtual, isolated environment to execute suspicious or untrusted code/agents. It logs all actions within the sandbox and prevents any interaction with the host system, allowing for safe analysis of potential threats.
========================================
Agent: Bit Force Action (tool-7)
Category: Security
Logic: local
Tool: system
Role: A quantum-speed aggressive reconnaissance agent. Deployed only by the Security Sentinel, it tracks, traces, and documents the origin of malicious actions against AgentricAI for later resolution. It performs network-level forensics like traceroute and whois to identify attack vectors.
========================================
Agent: Forced Stance Reporter (tool-8)
Category: Security
Logic: local
Tool: system
Role: Actively reports documented threats, malicious code, and attack origins to external cybersecurity databases (e.g., VirusTotal, abuse.ch) to contribute to global threat intelligence and deter attackers.
========================================
Agent: Environmental Impact Analyser (ext-env-01)
Category: External Review & Impact Analysis
Logic: local
Tool: None
Role: Assesses the potential environmental footprint of a proposed project, including resource consumption, emissions, and ecological effects.
========================================
Agent: Economical Impact Agent (ext-eco-01)
Category: External Review & Impact Analysis
Logic: local
Tool: None
Role: Analyzes the potential financial and economic effects of a project, including cost-benefit analysis, market impact, and return on investment.
========================================
Agent: Human Impact Agent (ext-hum-01)
Category: External Review & Impact Analysis
Logic: local
Tool: None
Role: Evaluates the social, cultural, and individual human consequences of a project, including effects on user well-being, community, and accessibility.
========================================
Agent: Ethical Compliance Officer (ext-eth-01)
Category: External Review & Impact Analysis
Logic: local
Tool: None
Role: Audits mission plans and outcomes against established ethical principles, flagging potential issues related to bias, fairness, transparency, and accountability.
========================================
Agent: Regulatory Affairs Specialist (ext-reg-01)
Category: External Review & Impact Analysis
Logic: local
Tool: None
Role: Checks proposed actions and project outcomes for compliance with relevant local, national, and international laws, policies, and industry regulations.
========================================
Agent: Long-Term Viability Analyst (ext-ltv-01)
Category: External Review & Impact Analysis
Logic: local
Tool: None
Role: Assesses the long-term sustainability and future implications of a project, considering technological evolution, market shifts, and potential unforeseen consequences.
========================================
`;

function parseManifest(): ManifestAgent[] {
  const agents: ManifestAgent[] = [];
  const blocks = manifestText.split('========================================').filter(b => b.trim() !== '');

  for (const block of blocks) {
    const lines = block.trim().split('\n');
    const agentData: Partial<ManifestAgent> = {};

    lines.forEach(line => {
      if (line.startsWith('Agent:')) {
        // FIX: The regex was using double backslashes to escape parentheses, 
        // which is incorrect for regex literals. It should be a single backslash.
        const match = line.match(/Agent: (.*) \((.*)\)/);
        if (match) {
          agentData.name = match[1].trim();
          agentData.id = match[2].trim();
        }
      } else if (line.startsWith('Category:')) {
        agentData.category = line.replace('Category:', '').trim();
      } else if (line.startsWith('Role:')) {
        agentData.role = lines.slice(lines.indexOf(line)).join(' ').replace('Role:', '').trim();
      }
    });
    
    if (agentData.id && agentData.name && agentData.category && agentData.role) {
      agents.push(agentData as ManifestAgent);
    }
  }

  return agents;
}

export const manifestAgents = parseManifest();
