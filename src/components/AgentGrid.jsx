import { AGENT_DEFS } from '../constants/agents';
import AgentCard from './AgentCard';

export default function AgentGrid({ agentStates, agentLogs, running }) {
  if (!running && Object.keys(agentStates).length === 0) return null;

  return (
    <div style={{
      display: "grid", gridTemplateColumns: "1fr 1fr",
      gap: 10, marginBottom: 32,
    }}>
      {AGENT_DEFS.map(a => (
        <AgentCard
          key={a.id}
          agent={a}
          status={agentStates[a.id] || "idle"}
          logs={agentLogs[a.id]}
        />
      ))}
    </div>
  );
}
