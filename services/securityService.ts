import { DynamicNodeConfig } from '../types/index';
import { llmService } from './llmService';

interface ReviewResult {
    approved: boolean;
    reason: string;
}

class SecurityService {

    async reviewAgent(config: DynamicNodeConfig): Promise<ReviewResult> {
        const prompt = `
            You are "The Gatekeeper," a security audit AI. Your task is to review a proposed AI agent configuration for safety, ethics, and compliance.
            
            **Agent Configuration to Review:**
            ${JSON.stringify(config, null, 2)}

            **Review Criteria:**
            1.  **Safety:** Does the execution logic prompt encourage harmful, malicious, or unsafe operations? (e.g., deleting files, accessing personal data).
            2.  **Clarity:** Is the agent's purpose clear and well-defined?
            3.  **Feasibility:** Is the agent's described function plausible for an LLM to perform?
            
            **Your Response:**
            Respond with ONLY a raw JSON object with the following structure:
            {
              "approved": boolean,
              "reason": "A concise, one-sentence explanation for your decision."
            }
        `;

        try {
            const responseJson = await llmService.generate(prompt, true); // Always use sandbox for security review
            const result = JSON.parse(responseJson.replace(/```json\n?|\n?```/g, ''));
            return result as ReviewResult;
        } catch (error) {
            console.error("Gatekeeper review failed:", error);
            return {
                approved: false,
                reason: "The security review process encountered an internal error."
            };
        }
    }
}

export const securityService = new SecurityService();
