import Assistant from "./assistant";


export default function Home() {
  return (
<main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-l from-cyan-600 via-transparent to-transparent bg-right bg-auto bg-[3in]">
      <div className="w-full md:w-3/4 lg:w-2/3 xl:w-4/5 mx-auto p-5">
        <div className="grid grid-cols-2 gap-8">
          <div className="col-span-1 flex justify-center items-center">
            <img src="/images/Nubie_Logo.png" alt="Nubie" className="h-48 md:h-auto"  />
          </div>
          <div className="col-span-1 flex justify-center items-center">
            <div className="bg-white shadow-lg p-6 rounded-lg w-full xl:w-240 min-w-[340px]">
              <Assistant
                assistantId={''} //Enter your assistant ID
                apiKey={''} //Enter your assistant API ID
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
