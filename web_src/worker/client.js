let worker = null, nextId = 0;
const pending = new Map();
function ensure() {
  if (worker) return;
  worker = new Worker(new URL("./surface_worker.js",import.meta.url),{type:"module"});
  worker.onmessage = ({data}) => {
    const call = pending.get(data.id);
    if (!call) return;
    pending.delete(data.id);
    if (data.error) call.reject(new Error(data.error)); else call.resolve(data.result);
  };
  worker.onerror = () => {
    for (const call of pending.values()) call.reject(new Error("Surface calculations stopped. Reload the page and run the workflow again."));
    pending.clear(); worker?.terminate(); worker = null;
  };
}
export function workerCall(message, transfer = []) {
  ensure();
  return new Promise((resolve,reject) => {
    const id = ++nextId; pending.set(id,{resolve,reject});
    try{worker.postMessage({...message,id},transfer);}catch(error){pending.delete(id);reject(error);}
  });
}
export function stopWorker() {
  worker?.terminate(); worker = null;
  for (const call of pending.values()) call.reject(new DOMException("Surface released","AbortError"));
  pending.clear();
}
