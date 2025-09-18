import initSqlJs from 'sql.js';
import type { SqlJsStatic } from 'sql.js';
import type { SavedWorkflow, DynamicNodeConfig, NodeData, Edge, LlmServiceConfig } from '../types/index';

const DB_NAME = 'agentic-studio-db';

class DatabaseService {
    private db: any = null;
    private SQL: SqlJsStatic | null = null;
    private initPromise: Promise<void> | null = null;

    init(): Promise<void> {
        if (this.initPromise) {
            return this.initPromise;
        }
        
        this.initPromise = (async () => {
            try {
                // Manually fetch the wasm binary to bypass fs.readFileSync in browser environments.
                const wasmUrl = `https://aistudiocdn.com/sql.js@^1.10.3/dist/sql-wasm.wasm`;
                const wasmBinary = await fetch(wasmUrl).then(res => res.arrayBuffer());
                
                this.SQL = await initSqlJs({ wasmBinary });

                const savedDb = localStorage.getItem(DB_NAME);
                if (savedDb) {
                    const dbArray = Uint8Array.from(JSON.parse(savedDb));
                    this.db = new this.SQL.Database(dbArray);
                } else {
                    this.db = new this.SQL.Database();
                    this.createTables();
                }
            } catch (error) {
                console.error("Failed to initialize database:", error);
                // Reset promise on failure to allow retries.
                this.initPromise = null; 
                this.db = null;
                // Propagate the error to the caller if needed
                throw error;
            }
        })();
        
        return this.initPromise;
    }

    private async ensureDb(): Promise<void> {
        if (!this.db) {
            await this.init();
        }
        if (!this.db) {
            throw new Error("Database failed to initialize and is not available.");
        }
    }

    private createTables() {
        if (!this.db) return;
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS workflows (
                name TEXT PRIMARY KEY,
                nodes TEXT,
                edges TEXT
            );
            CREATE TABLE IF NOT EXISTS custom_agents (
                name TEXT PRIMARY KEY,
                config TEXT
            );
            CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value TEXT
            );
        `);
        this.persist();
    }

    private persist() {
        if (!this.db) return;
        const data = this.db.export();
        localStorage.setItem(DB_NAME, JSON.stringify(Array.from(data)));
    }

    async saveWorkflow(name: string, nodes: NodeData[], edges: Edge[]): Promise<void> {
        await this.ensureDb();
        const stmt = this.db.prepare("INSERT OR REPLACE INTO workflows (name, nodes, edges) VALUES (?, ?, ?)");
        stmt.run([name, JSON.stringify(nodes), JSON.stringify(edges)]);
        stmt.free();
        this.persist();
    }

    async loadWorkflow(name: string): Promise<SavedWorkflow | null> {
        await this.ensureDb();
        const stmt = this.db.prepare("SELECT * FROM workflows WHERE name = ?");
        const result = stmt.getAsObject({ ':name': name });
        stmt.free();
        if (result.name) {
            try {
                return {
                    name: result.name as string,
                    nodes: JSON.parse(result.nodes as string),
                    edges: JSON.parse(result.edges as string),
                };
            } catch (e) {
                console.error(`Failed to parse workflow "${name}" from database.`, e);
                return null;
            }
        }
        return null;
    }
    
    async loadWorkflows(): Promise<Record<string, SavedWorkflow>> {
        await this.ensureDb();
        const res = this.db.exec("SELECT * FROM workflows WHERE name != '__autosave'");
        const workflows: Record<string, SavedWorkflow> = {};
        if (res[0]) {
            res[0].values.forEach((row: any[]) => {
                try {
                    workflows[row[0] as string] = {
                        name: row[0] as string,
                        nodes: JSON.parse(row[1] as string),
                        edges: JSON.parse(row[2] as string),
                    };
                } catch (e) {
                     console.error(`Failed to parse workflow "${row[0]}" from database during bulk load.`, e);
                }
            });
        }
        return workflows;
    }

    async deleteWorkflow(name: string): Promise<void> {
        await this.ensureDb();
        const stmt = this.db.prepare("DELETE FROM workflows WHERE name = ?");
        stmt.run([name]);
        stmt.free();
        this.persist();
    }
    
    async saveCustomAgents(agents: DynamicNodeConfig[]): Promise<void> {
        await this.ensureDb();
        this.db.exec("DELETE FROM custom_agents");
        const stmt = this.db.prepare("INSERT INTO custom_agents (name, config) VALUES (?, ?)");
        agents.forEach(agent => {
            stmt.run([agent.name, JSON.stringify(agent)]);
        });
        stmt.free();
        this.persist();
    }

    async loadCustomAgents(): Promise<DynamicNodeConfig[]> {
        await this.ensureDb();
        const res = this.db.exec("SELECT config FROM custom_agents");
        if (res[0]) {
             try {
                return res[0].values.map((row: any[]) => JSON.parse(row[0] as string));
            } catch (e) {
                console.error("Failed to parse custom agents from database.", e);
                return [];
            }
        }
        return [];
    }

    async saveLlmConfig(config: LlmServiceConfig): Promise<void> {
        await this.ensureDb();
        const stmt = this.db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)");
        stmt.run(['llm_config', JSON.stringify(config)]);
        stmt.free();
        this.persist();
    }

    async loadLlmConfig(): Promise<LlmServiceConfig | null> {
        await this.ensureDb();
        const stmt = this.db.prepare("SELECT value FROM settings WHERE key = 'llm_config'");
        const result = stmt.getAsObject();
        stmt.free();
        if (result.value) {
            try {
                return JSON.parse(result.value as string);
            } catch (e) {
                console.error("Failed to parse LLM config from database.", e);
                return null;
            }
        }
        return null;
    }
}

export const databaseService = new DatabaseService();