import { Playground } from "../components/Playground";

export function PlaygroundPage() {
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Playground</h1>
      <p className="text-gray-400 mb-6 text-[15px]">
        Build a circuit in the visual composer or write Qiskit code — switch between them at any
        time. Run on the local Aer simulator (or IBM Quantum if a token is configured) and explore
        the results.
      </p>
      <Playground />
    </div>
  );
}
