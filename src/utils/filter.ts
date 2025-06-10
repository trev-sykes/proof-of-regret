import { Confession } from "../components/confessionUi/ConfessionUi"
// Returns active confessions
const activeConfessions = (confessions: Confession[]) => {
    return confessions.filter(c =>
        new Date(Number(c.deadline) * 1000) >= new Date()
    );
};

// Returns ready to be resolved confessions
const readyToResolveConfessions = (confessions: Confession[]) => {
    return confessions.filter(c => {
        return new Date(Number(c.deadline) * 1000) < new Date() && !c.resolved;
    });
};

// Returns resolved confessions that are either forgiven or unforgiven
const resolvedConfessionsByForgiveness = (confessions: Confession[], isForgiven: boolean) => {
    return confessions.filter(c => c.resolved && (c.forgiven === isForgiven));
};
export const filter = {
    activeConfessions, readyToResolveConfessions, resolvedConfessionsByForgiveness
}