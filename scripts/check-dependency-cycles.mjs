// Return one cycle (with the starting topic repeated), or null for a DAG.
// Walk iteratively so long prerequisite chains do not exhaust the call stack.
export function findDependencyCycle(dependencies) {
  const graph = new Map();
  for (const { topicId, prerequisiteId } of dependencies) {
    if (!graph.has(topicId)) graph.set(topicId, []);
    graph.get(topicId).push(prerequisiteId);
  }
  const finished = new Set();
  for (const start of graph.keys()) {
    if (finished.has(start)) continue;
    const stack = [{ id: start, next: 0 }];
    const active = new Map([[start, 0]]);
    while (stack.length) {
      const frame = stack[stack.length - 1];
      const neighbors = graph.get(frame.id) ?? [];
      if (frame.next === neighbors.length) {
        finished.add(frame.id);
        active.delete(frame.id);
        stack.pop();
        continue;
      }
      const next = neighbors[frame.next++];
      if (active.has(next)) {
        return [...stack.slice(active.get(next)).map(item => item.id), next];
      }
      if (!finished.has(next)) {
        active.set(next, stack.length);
        stack.push({ id: next, next: 0 });
      }
    }
  }
  return null;
}
