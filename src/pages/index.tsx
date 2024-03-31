import Assistant from "./assistant";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full md:w-3/4 lg:w-2/3 xl:w-1/2 mx-auto p-5">
        <div className="flex flex-col items-center mb-8">
        <div className="text-6xl font-semibold text-blue-500" style={{ fontSize: '120px', WebkitTextStrokeWidth: '3px', WebkitTextStrokeColor: '#767a7a', fontFamily: "'aeromatics nc', 'Team Spirit NF', 'Orbitron', sans-serif" }}>
          Nubie
        </div>
          <p className="text-lg text-gray-600 font-semibold">Your Fantasy Football EXPERT</p>
        </div>
        <div className="flex justify-center items-center bg-white shadow-lg p-6 rounded-lg">
          <Assistant
            assistantId={''} //Enter your assistant ID
            apiKey={''} //Enter your assistant API ID
          />
        </div>
      </div>
    </main>
  );
}
