import { BehaviorSubject } from 'rxjs';

interface BugReport {
    id: number;
    error: Error;
    context: string;
    timestamp: Date;
    isAcknowledged: boolean;
}

class MechanicService {
    private bugs = new BehaviorSubject<BugReport[]>([]);
    private nextId = 0;

    public bugs$ = this.bugs.asObservable();

    init() {
        console.log("Mechanic Agent Initialized. Standing by for diagnostics.");
    }

    logBug(error: Error, context: string) {
        const newBug: BugReport = {
            id: this.nextId++,
            error,
            context,
            timestamp: new Date(),
            isAcknowledged: false,
        };
        const updatedBugs = [...this.bugs.getValue(), newBug];
        this.bugs.next(updatedBugs);
        console.warn(`Mechanic Agent Logged Bug #${newBug.id}: ${context}`, error);
    }

    acknowledgeBug(id: number) {
        const updatedBugs = this.bugs.getValue().map(bug => 
            bug.id === id ? { ...bug, isAcknowledged: true } : bug
        );
        this.bugs.next(updatedBugs);
    }

    getBugs(): BugReport[] {
        return this.bugs.getValue();
    }
}

export const mechanicService = new MechanicService();
