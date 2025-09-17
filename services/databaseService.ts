import initSqlJs from 'sql.js';
import type { SavedWorkflow, DynamicNodeConfig, NodeData, Edge } from '../types/index';

const DB_NAME = 'agentic-studio-db';

class DatabaseService {
    private db: any = null;

    async init() {
        try {
            const SQL = await initSqlJs({ locateFile: file => `https://aistudiocdn.com/sql.js@^1.10.3/dist/${file}` });
            const savedDb = localStorage.getItem(DB_NAME);
            if (savedDb) {
                const dbArray = Uint8Array.from(JSON.parse(savedDb));
                this.db = new SQL.Database(dbArray);
            } else {
                this.db = new SQL.Database();
                this.createTables();
            }
        } catch (error) {
            console.error("Failed to initialize database:", error);
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
        `);
        this.persist();
    }

    private persist() {
        if (!this.db) return;
        const data = this.db.export();
        localStorage.setItem(DB_NAME, JSON.stringify(Array.from(data)));
    }

    async saveWorkflow(name: string, nodes: NodeData[], edges: Edge[]): Promise<void> {
        if (!this.db) await this.init();
        const stmt = this.db.prepare("INSERT OR REPLACE INTO workflows (name, nodes, edges) VALUES (?, ?, ?)");
        stmt.run([name, JSON.stringify(nodes), JSON.stringify(edges)]);
        stmt.free();
        this.persist();
    }

    async loadWorkflow(name: string): Promise<SavedWorkflow | null> {
        if (!this.db) await this.init();
        const stmt = this.db.prepare("SELECT * FROM workflows WHERE name = ?");
        const result = stmt.getAsObject({ ':name': name });
        stmt.free();
        if (result.name) {
            return {
                name: result.name as string,
                nodes: JSON.parse(result.nodes as string),
                edges: JSON.parse(result.edges as string),
            };
        }
        return null;
    }
    
    async loadWorkflows(): Promise<Record<string, SavedWorkflow>> {
        if (!this.db) await this.init();
        const res = this.db.exec("SELECT * FROM workflows WHERE name != '__autosave'");
        const workflows: Record<string, SavedWorkflow> = {};
        if (res[0]) {
            res[0].values.forEach((row: any[]) => {
                workflows[row[0] as string] = {
                    name: row[0] as string,
                    nodes: JSON.parse(row[1] as string),
                    edges: JSON.parse(row[2] as string),
                };
            });
        }
        return workflows;
    }

    async deleteWorkflow(name: string): Promise<void> {
        if (!this.db) await this.init();
        const stmt = this.db.prepare("DELETE FROM workflows WHERE name = ?");
        stmt.run([name]);
        stmt.free();
        this.persist();
    }
    
    async saveCustomAgents(agents: DynamicNodeConfig[]): Promise<void> {
        if (!this.db) await this.init();
        this.db.exec("DELETE FROM custom_agents");
        const stmt = this.db.prepare("INSERT INTO custom_agents (name, config) VALUES (?, ?)");
        agents.forEach(agent => {
            stmt.run([agent.name, JSON.stringify(agent)]);
        });
        stmt.free();
        this.persist();
    }

    async loadCustomAgents(): Promise<DynamicNodeConfig[]> {
        if (!this.db) await this.init();
        const res = this.db.exec("SELECT config FROM custom_agents");
        if (res[0]) {
            return res[0].values.map((row: any[]) => JSON.parse(row[0] as string));
        }
        return [];
    }
}

export const databaseService = new DatabaseService();
